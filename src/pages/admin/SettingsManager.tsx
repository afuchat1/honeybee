import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/logActivity";
import { Save } from "lucide-react";

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
    setValues(vals);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const setting of settings) {
      const newValue = values[setting.setting_key];
      if (newValue !== setting.setting_value) {
        await supabase.from("site_settings").update({ setting_value: newValue }).eq("id", setting.id);
      }
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
    facebook_url: "Facebook URL",
    twitter_url: "Twitter URL",
    instagram_url: "Instagram URL",
    meta_description: "SEO Meta Description",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save size={16} className="mr-1" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="bg-background rounded-lg border border-border p-5 space-y-5 max-w-2xl">
        {settings.map((setting) => (
          <div key={setting.id}>
            <Label className="text-sm">{labels[setting.setting_key] || setting.setting_key}</Label>
            <Input
              value={values[setting.setting_key] || ""}
              onChange={(e) => setValues({ ...values, [setting.setting_key]: e.target.value })}
              className="mt-1"
            />
          </div>
        ))}
        {settings.length === 0 && (
          <p className="text-sm text-muted-foreground">No settings configured.</p>
        )}
      </div>
    </div>
  );
};

export default SettingsManager;
