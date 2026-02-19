import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Prayer {
  id: string;
  prayer_date: string;
  scripture_text: string;
  scripture_reference: string;
  reflection: string;
  prayer: string;
  is_active: boolean;
}

const emptyForm = { prayer_date: "", scripture_text: "", scripture_reference: "", reflection: "", prayer: "" };

const DailyPrayerManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Prayer[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Prayer | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const { data } = await supabase.from("daily_prayers").select("*").order("prayer_date", { ascending: false });
    setItems((data as Prayer[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, prayer_date: new Date().toISOString().split("T")[0] });
    setDialogOpen(true);
  };

  const openEdit = (item: Prayer) => {
    setEditing(item);
    setForm({
      prayer_date: item.prayer_date,
      scripture_text: item.scripture_text,
      scripture_reference: item.scripture_reference,
      reflection: item.reflection,
      prayer: item.prayer,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from("daily_prayers").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("updated", "daily_prayer", editing.id);
    } else {
      const { error } = await supabase.from("daily_prayers").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("created", "daily_prayer");
    }
    setDialogOpen(false);
    toast({ title: editing ? "Prayer updated" : "Prayer created" });
    fetchData();
  };

  const handleDelete = async (item: Prayer) => {
    if (!confirm("Delete this prayer entry?")) return;
    await supabase.from("daily_prayers").delete().eq("id", item.id);
    await logActivity("deleted", "daily_prayer", item.id);
    toast({ title: "Prayer deleted" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Daily Prayer</h1>
        <Button onClick={openAdd} size="sm"><Plus size={16} className="mr-1" /> Add Prayer</Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Scripture</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground font-medium">{item.prayer_date}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-xs">{item.scripture_reference}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground mr-2"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No prayer entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Prayer" : "Add Prayer"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.prayer_date} onChange={(e) => setForm({ ...form, prayer_date: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Scripture Reference</Label>
              <Input value={form.scripture_reference} onChange={(e) => setForm({ ...form, scripture_reference: e.target.value })} placeholder="e.g. Jeremiah 29:11" className="mt-1" />
            </div>
            <div>
              <Label>Scripture Text</Label>
              <Textarea value={form.scripture_text} onChange={(e) => setForm({ ...form, scripture_text: e.target.value })} rows={3} className="mt-1" />
            </div>
            <div>
              <Label>Reflection</Label>
              <Textarea value={form.reflection} onChange={(e) => setForm({ ...form, reflection: e.target.value })} rows={4} className="mt-1" />
            </div>
            <div>
              <Label>Prayer</Label>
              <Textarea value={form.prayer} onChange={(e) => setForm({ ...form, prayer: e.target.value })} rows={4} className="mt-1" />
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyPrayerManager;
