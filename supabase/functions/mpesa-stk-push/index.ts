import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const DARAJA_CONSUMER_KEY = Deno.env.get("DARAJA_CONSUMER_KEY") || "TStt6uIQYqVYcl35RT4h7McQ8YMWDXTfLTop0b3NMoA8MNp7";
const DARAJA_CONSUMER_SECRET = Deno.env.get("DARAJA_CONSUMER_SECRET") || "WdTpidz3f9cvTGv1bEvevwwOY3y0HPs83CnGJwvhZ17genGpysHXTYE0i7WYnoOC";
const DARAJA_PASSKEY = Deno.env.get("DARAJA_PASSKEY") || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const DARAJA_SHORTCODE = Deno.env.get("DARAJA_SHORTCODE") || "174379";
const DARAJA_ENV = Deno.env.get("DARAJA_ENV") || "sandbox";
const APP_URL = Deno.env.get("APP_URL") || "https://county-connect.vercel.app";

const DARAJA_URL_BASE = DARAJA_ENV === "production" 
  ? "https://api.safaricom.co.ke" 
  : "https://sandbox.safaricom.co.ke";

function assertDarajaConfig() {
  const missing = [
    ["DARAJA_CONSUMER_KEY", DARAJA_CONSUMER_KEY],
    ["DARAJA_CONSUMER_SECRET", DARAJA_CONSUMER_SECRET],
    ["DARAJA_PASSKEY", DARAJA_PASSKEY],
    ["DARAJA_SHORTCODE", DARAJA_SHORTCODE],
    ["APP_URL", APP_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing Daraja configuration: ${missing.join(", ")}. Configure these as Supabase Edge Function secrets.`);
  }
}

async function generateAccessToken() {
  const credentials = btoa(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`);
  const response = await fetch(`${DARAJA_URL_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to generate access token: ${response.statusText}`);
  }
  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    assertDarajaConfig();

    // Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }
    
    // Initialize Supabase client for backend operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    const { amount, phone, reference, description, applicationId } = await req.json();

    if (!amount || !phone || !reference || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Basic phone validation
    if (!/^(07|01|\+2547|\+2541|2547|2541)\d{8}$/.test(phone)) {
       return new Response(JSON.stringify({ error: "Invalid Kenyan phone number format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Format phone to 254...
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.slice(1);
    }

    const accessToken = await generateAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);
    const password = btoa(`${DARAJA_SHORTCODE}${DARAJA_PASSKEY}${timestamp}`);

    const payload = {
      BusinessShortCode: DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: formattedPhone,
      PartyB: DARAJA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${APP_URL}/functions/v1/mpesa-webhook`,
      AccountReference: reference.substring(0, 12),
      TransactionDesc: description || "CountyConnect Payment",
    };

    const response = await fetch(`${DARAJA_URL_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.CheckoutRequestID) {
      // Use service role to insert payment record securely
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await adminClient.from("payments").insert({
        checkout_request_id: data.CheckoutRequestID,
        application_id: applicationId,
        phone: formattedPhone,
        amount: Math.ceil(amount),
        status: "pending"
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
