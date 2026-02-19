import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, MailOpen } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactMessages = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setItems((data as Message[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (item: Message) => {
    await supabase.from("contact_messages").update({ is_read: !item.is_read }).eq("id", item.id);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    toast({ title: "Message deleted" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Contact Messages</h1>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 bg-background rounded-lg border border-border overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  if (!item.is_read) toggleRead(item);
                }}
                className={`px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                  selected?.id === item.id ? "bg-accent/50" : ""
                } ${!item.is_read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${!item.is_read ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{item.subject}</p>
              </div>
            ))}
            {items.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">No messages.</p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-background rounded-lg border border-border p-5">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selected.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    From: {selected.name} ({selected.email})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(selected)} className="text-muted-foreground hover:text-foreground">
                    {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap border-t border-border pt-4">
                {selected.message}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              Select a message to read it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
