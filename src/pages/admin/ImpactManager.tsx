import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
}

const emptyForm = { title: "", content: "", is_featured: false, sort_order: 0 };

const ImpactManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Story[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const { data } = await supabase.from("impact_stories").select("*").order("sort_order");
    setItems((data as Story[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (item: Story) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, is_featured: item.is_featured, sort_order: item.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("impact_stories").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("updated", "impact_story", editing.id, { title: form.title });
    } else {
      const { error } = await supabase.from("impact_stories").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("created", "impact_story", undefined, { title: form.title });
    }
    setDialogOpen(false);
    toast({ title: editing ? "Story updated" : "Story created" });
    fetchData();
  };

  const handleDelete = async (item: Story) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await supabase.from("impact_stories").delete().eq("id", item.id);
    await logActivity("deleted", "impact_story", item.id);
    toast({ title: "Story deleted" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Impact Stories</h1>
        <Button onClick={openAdd} size="sm"><Plus size={16} className="mr-1" /> Add Story</Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Featured</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground font-medium">{item.title}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {item.is_featured && <Star size={14} className="text-primary fill-primary" />}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground mr-2"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No stories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Story" : "Add Story"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="mt-1" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
              <Label>Featured Story</Label>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1" />
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImpactManager;
