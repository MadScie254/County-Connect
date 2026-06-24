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

      // Update the payment record in Supabase
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('checkout_request_id', checkoutRequestID)
        .select()
        .single();

      if (paymentError || !payment) {
        console.error("Payment update error:", paymentError);
      } else if (payment.application_id) {
         // Update the application status to "Pending Review" now that payment is done
         await supabase
           .from("applications")
           .update({ status: "Pending Review" })
           .eq("id", payment.application_id);

         // Record revenue using the new UUID schema
         const { error: revenueError } = await supabase.from('revenue').insert({
           ref: mpesaReceiptNumber || checkoutRequestID,
           amount: amount || payment.amount,
           payer_name: phoneNumber || payment.phone || "Unknown Citizen",
           stream: "Digital Services",
           reconciled: true
         });

         if (revenueError) {
           console.error("Supabase revenue insert error:", revenueError);
         }
      }
    } else {
      console.log(`STK Push failed or cancelled: ${body.ResultDesc}`);
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('checkout_request_id', checkoutRequestID);
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
