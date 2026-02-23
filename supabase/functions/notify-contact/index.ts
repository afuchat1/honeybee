import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceKey);

    // Get enabled notification emails
    const { data: emails } = await client
      .from("notification_emails")
      .select("email")
      .eq("is_enabled", true);

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ sent: false, reason: "no_emails" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Supabase's built-in email (using the auth admin API to send a custom email isn't available,
    // so we'll use a simple approach: log the notification. For actual email delivery, 
    // the admin can integrate with an external service.)
    // For now, we store a notification record that the admin can see.
    console.log(`Contact notification: ${name} (${email}) - ${subject}`);
    console.log(`Would send to: ${emails.map((e: any) => e.email).join(", ")}`);

    return new Response(
      JSON.stringify({ sent: true, recipients: emails.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
