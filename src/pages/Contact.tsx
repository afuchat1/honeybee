import { useState, useEffect } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("setting_key, setting_value").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.setting_key] = s.setting_value; });
        setSettings(map);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name, email: result.data.email,
      subject: result.data.subject, message: result.data.message,
    });
    setSubmitting(false);
    if (error) { toast({ title: "Error", description: "Failed to send message.", variant: "destructive" }); return; }
    // Notify via edge function (fire & forget)
    supabase.functions.invoke("notify-contact", {
      body: { name: result.data.name, email: result.data.email, subject: result.data.subject, message: result.data.message },
    }).catch(() => {});
    toast({ title: "Message sent", description: "Thank you for reaching out. We will get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Contact Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">We'd love to hear from you.</p>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3">
            <h2 className="section-heading">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="mt-1.5" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="mt-1.5" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="mt-1.5" />
                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Your message..." rows={5} className="mt-1.5" />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="md:col-span-2">
            <h2 className="section-heading">Get in Touch</h2>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Location</p>
                  <p className="text-sm">{settings.location || "Eastern Uganda"}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <a href={`mailto:${settings.contact_email || "honeybeeministriesug@gmail.com"}`} className="text-sm hover:text-foreground transition-colors">
                    {settings.contact_email || "honeybeeministriesug@gmail.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Phone</p>
                  <p className="text-sm">{settings.contact_phone || "+256 XXX XXX XXX"}</p>
                </div>
              </li>
            </ul>
            <div className="mt-10">
              <h3 className="font-sans font-semibold text-foreground text-sm mb-3">Follow Us</h3>
              <div className="flex items-center gap-4 text-muted-foreground">
                {(settings.facebook_url || (!settings.facebook_url && !settings.instagram_url && !settings.youtube_url && !settings.whatsapp_number)) && (
                  <a href={settings.facebook_url || "#"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {(settings.instagram_url || (!settings.facebook_url && !settings.instagram_url && !settings.youtube_url && !settings.whatsapp_number)) && (
                  <a href={settings.instagram_url || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </a>
                )}
                {settings.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {settings.whatsapp_number && (
                  <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.144 7.521h-.004c-1.346 0-2.674-.353-3.847-1.02l-.276-.164-2.867.752.765-2.795-.18-.288C4.759 15.466 4 13.488 4 11.395 4 6.886 7.745 3.14 12.252 3.14c2.184 0 4.237.852 5.78 2.398a8.13 8.13 0 0 1 2.394 5.779c0 4.507-3.746 8.251-8.253 8.251M12.252 0C5.51 0 0 5.508 0 12.252c0 2.154.563 4.26 1.633 6.125L.112 24l5.73-1.503a11.436 11.436 0 0 0 6.41 1.94h.004c6.742 0 12.25-5.51 12.25-12.253C24.502 5.51 19.101 0 12.253 0"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
