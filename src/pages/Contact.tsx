import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
    // Simulate submission (will connect to backend later)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);

    toast({
      title: "Message sent",
      description: "Thank you for reaching out. We will get back to you soon.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Contact Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          We'd love to hear from you. Whether you have questions, want to partner with us, or would like to support our mission, please get in touch.
        </p>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Form */}
          <div className="md:col-span-3">
            <h2 className="section-heading">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-1.5"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="mt-1.5"
                />
                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={5}
                  className="mt-1.5"
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2">
            <h2 className="section-heading">Get in Touch</h2>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Location</p>
                  <p className="text-sm">Eastern Uganda</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <a href="mailto:info@honeybeeministries.org" className="text-sm hover:text-foreground transition-colors">
                    info@honeybeeministries.org
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-forest flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Phone</p>
                  <p className="text-sm">+256 XXX XXX XXX</p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <h3 className="font-sans font-semibold text-foreground text-sm mb-3">Follow Us</h3>
              <div className="flex gap-4 text-muted-foreground text-sm">
                <a href="#" className="hover:text-foreground transition-colors">Facebook</a>
                <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
