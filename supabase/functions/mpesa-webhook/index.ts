import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await req.json();

    // Safaricom Daraja Webhook Payload Structure
    const body = data.Body.stkCallback;
    const resultCode = body.ResultCode;
    const merchantRequestID = body.MerchantRequestID;
    const checkoutRequestID = body.CheckoutRequestID;

    if (resultCode === 0) {
      // Transaction successful
      const callbackMetadata = body.CallbackMetadata.Item;
      const amountObj = callbackMetadata.find((item: any) => item.Name === "Amount");
      const receiptObj = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber");
      const phoneObj = callbackMetadata.find((item: any) => item.Name === "PhoneNumber");

      const amount = amountObj?.Value;
      const mpesaReceiptNumber = receiptObj?.Value;
      const phoneNumber = phoneObj?.Value?.toString();

      // Update the revenue table in Supabase
      // Assuming we stored the CheckoutRequestID or have a pending revenue entry
      // For now, let's insert a new reconciled revenue entry
      const { error } = await supabase.from('revenue').insert({
        id: `REV-${mpesaReceiptNumber}`,
        ref: mpesaReceiptNumber,
        amount: amount,
        "user": phoneNumber || "Unknown Citizen",
        stream: "M-Pesa API",
        time: new Date().toLocaleTimeString(),
        reconciled: true
      });

      if (error) {
        console.error("Supabase insert error:", error);
      }
    } else {
      console.log(`STK Push failed or cancelled: ${body.ResultDesc}`);
    }

    // Safaricom expects a success response so it doesn't retry
    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: "Failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
