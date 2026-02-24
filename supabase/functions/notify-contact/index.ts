import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ sent: false, reason: "no_api_key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = createClient(supabaseUrl, serviceKey);
    const resend = new Resend(resendKey);

    // Get enabled notification emails
    const { data: emails } = await client
      .from("notification_emails")
      .select("email")
      .eq("is_enabled", true);

    if (!emails || emails.length === 0) {
      console.log("No notification emails configured");
      return new Response(JSON.stringify({ sent: false, reason: "no_emails" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipients = emails.map((e: any) => e.email);

    const { data, error } = await resend.emails.send({
      from: "Honeybee Ministries <noreply@afuchat.com>",
      to: recipients,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
        <hr />
        <p style="color: #999; font-size: 12px;">This message was sent via the Honeybee Ministries contact form.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ sent: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully to:", recipients.join(", "));
    return new Response(
      JSON.stringify({ sent: true, recipients: recipients.length }),
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
