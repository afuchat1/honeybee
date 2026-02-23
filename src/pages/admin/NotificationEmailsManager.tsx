import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface NotifEmail {
  id: string;
  email: string;
  is_enabled: boolean;
}

const NotificationEmailsManager = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<NotifEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("notification_emails").select("*").order("created_at");
    setEmails((data as NotifEmail[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!newEmail.trim() || emails.length >= 3) return;
    const { error } = await supabase.from("notification_emails").insert({ email: newEmail.trim() });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Email added" });
    setNewEmail("");
    fetchData();
  };

  const handleToggle = async (item: NotifEmail) => {
    await supabase.from("notification_emails").update({ is_enabled: !item.is_enabled }).eq("id", item.id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("notification_emails").delete().eq("id", id);
    toast({ title: "Email removed" });
    fetchData();
  };

  return (
    <div className="bg-background rounded-lg border border-border p-5 max-w-lg">
      <h2 className="text-lg font-serif font-semibold text-foreground mb-1">Notification Emails</h2>
      <p className="text-xs text-muted-foreground mb-4">Contact form messages will be forwarded to these emails (max 3).</p>

      <div className="space-y-3 mb-4">
        {emails.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Switch checked={item.is_enabled} onCheckedChange={() => handleToggle(item)} />
            <span className={`flex-1 text-sm ${item.is_enabled ? "text-foreground" : "text-muted-foreground line-through"}`}>
              {item.email}
            </span>
            <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {emails.length < 3 && (
        <div className="flex gap-2">
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@example.com"
            type="email"
            className="flex-1"
          />
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationEmailsManager;
