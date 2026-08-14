import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/logActivity";
import { Save } from "lucide-react";
import NotificationEmailsManager from "./NotificationEmailsManager";
import { validateWhatsAppNumber, normalizePhone } from "@/lib/phone";

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
}

const SettingsManager = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("site_settings").select("*").order("setting_key");
    const items = (data as Setting[]) || [];
    setSettings(items);
    const vals: Record<string, string> = {};
    items.forEach((s) => { vals[s.setting_key] = s.setting_value; });
    // Ensure the WhatsApp prefilled message field is editable even if not yet seeded.
    if (!vals.hasOwnProperty("whatsapp_message")) vals.whatsapp_message = "";
    setValues(vals);
  };

  useEffect(() => { fetchData(); }, []);

  const whatsappError = validateWhatsAppNumber(values.whatsapp_number || "");

  const handleSave = async () => {
    if (whatsappError) {
      toast({ title: "Invalid WhatsApp number", description: whatsappError, variant: "destructive" });
      return;
    }
    setSaving(true);
    const existingKeys = new Set(settings.map((s) => s.setting_key));

    for (const setting of settings) {
      let newValue = values[setting.setting_key];
      if (setting.setting_key === "whatsapp_number") newValue = normalizePhone(newValue || "");
      if (newValue !== setting.setting_value) {
        await supabase.from("site_settings").update({ setting_value: newValue }).eq("id", setting.id);
      }
    }

    // Insert any new settings that exist in values but not in the database yet.
    for (const [key, value] of Object.entries(values)) {
      if (existingKeys.has(key)) continue;
      let newValue = value;
      if (key === "whatsapp_number") newValue = normalizePhone(newValue || "");
      await supabase.from("site_settings").insert({ setting_key: key, setting_value: newValue });
    }

    await logActivity("updated", "site_settings");
    toast({ title: "Settings saved" });
    setSaving(false);
    fetchData();
  };

  const labels: Record<string, string> = {
    site_name: "Site Name",
    site_tagline: "Tagline",
    contact_email: "Contact Email",
    contact_phone: "Contact Phone",
    contact_address: "Contact Address",
    location: "Location",
    facebook_url: "Facebook URL",
    twitter_url: "Twitter URL",
    instagram_url: "Instagram URL",
    youtube_url: "YouTube URL",
    whatsapp_number: "WhatsApp Number (e.g. 256758574664)",
    whatsapp_message: "WhatsApp Prefilled Message",
    meta_description: "SEO Meta Description",
  };

  const placeholders: Record<string, string> = {
    whatsapp_message: "Hello Honeybee Ministries, I would like to know more about your work.",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving || !!whatsappError} size="sm">
          <Save size={16} className="mr-1" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-background rounded-lg border border-border p-5 space-y-5 max-w-2xl">
          {settings.map((setting) => {
            const isWhatsApp = setting.setting_key === "whatsapp_number";
            const error = isWhatsApp ? whatsappError : null;
            return (
              <div key={setting.id}>
                <Label className="text-sm">{labels[setting.setting_key] || setting.setting_key}</Label>
                <Input
                  value={values[setting.setting_key] || ""}
                  onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
                  maxLength={isWhatsApp ? 20 : undefined}
                  inputMode={isWhatsApp ? "tel" : undefined}
                  aria-invalid={!!error}
                  className={`mt-1 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {isWhatsApp && (
                  error ? (
                    <p className="mt-1 text-xs text-destructive">{error}</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      International format with country code, no leading 0 (e.g. 256758574664).
                    </p>
                  )
                )}
              </div>
            );
          })}

          {/* WhatsApp prefilled message is rendered explicitly so it can be edited even before a DB row exists. */}
          {values.hasOwnProperty("whatsapp_message") && !settings.some((s) => s.setting_key === "whatsapp_message") && (
            <div>
              <Label className="text-sm">{labels.whatsapp_message}</Label>
              <Input
                value={values.whatsapp_message || ""}
                placeholder={placeholders.whatsapp_message}
                onChange={(e) => setValues({ ...values, whatsapp_message: e.target.value })}
                className="mt-1"
              />
            </div>
          )}

          {settings.length === 0 && (
            <p className="text-sm text-muted-foreground">No settings configured.</p>
          )}
        </div>

        {/* Notification emails */}
        <NotificationEmailsManager />
      </div>
    </div>
  );
};

export default SettingsManager;
