import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

interface Program {
  id: string;
  title: string;
  description: string;
  goals: string[];
  outcomes: string[];
  image_url: string | null;
  sort_order: number;
}

const emptyForm = { title: "", description: "", goals: "", outcomes: "", sort_order: 0 };

const ProgramsManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Program[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("programs").select("*").order("sort_order");
    setItems((data as Program[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (item: Program) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      goals: item.goals.join("\n"),
      outcomes: item.outcomes.join("\n"),
      sort_order: item.sort_order,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, programId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `programs/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    await supabase.from("programs").update({ image_url: urlData.publicUrl }).eq("id", programId);
    toast({ title: "Image uploaded" });
    setUploading(false);
    fetchData();
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      goals: form.goals.split("\n").filter(Boolean),
      outcomes: form.outcomes.split("\n").filter(Boolean),
      sort_order: form.sort_order,
    };

    if (editing) {
      const { error } = await supabase.from("programs").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("updated", "program", editing.id, { title: form.title });
    } else {
      const { error } = await supabase.from("programs").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("created", "program", undefined, { title: form.title });
    }

    setDialogOpen(false);
    toast({ title: editing ? "Program updated" : "Program created" });
    fetchData();
  };

  const handleDelete = async (item: Program) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await supabase.from("programs").delete().eq("id", item.id);
    await logActivity("deleted", "program", item.id, { title: item.title });
    toast({ title: "Program deleted" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Programs</h1>
        <Button onClick={openAdd} size="sm"><Plus size={16} className="mr-1" /> Add Program</Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Image</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Order</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Upload size={14} />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id)} disabled={uploading} />
                    </label>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{item.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground mr-2"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No programs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Program" : "Add Program"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1" />
            </div>
            <div>
              <Label>Goals (one per line)</Label>
              <Textarea value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} rows={3} className="mt-1" />
            </div>
            <div>
              <Label>Outcomes (one per line)</Label>
              <Textarea value={form.outcomes} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} rows={3} className="mt-1" />
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

export default ProgramsManager;
