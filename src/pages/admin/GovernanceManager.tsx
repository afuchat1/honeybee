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

interface GovDoc {
  id: string;
  title: string;
  content: string;
  document_url: string | null;
  section: string;
  sort_order: number;
}

const emptyForm = { title: "", content: "", section: "general", sort_order: 0 };

const GovernanceManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<GovDoc[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GovDoc | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const { data } = await supabase.from("governance_docs").select("*").order("sort_order");
    setItems((data as GovDoc[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: GovDoc) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, section: item.section, sort_order: item.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("governance_docs").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("updated", "governance_doc", editing.id);
    } else {
      const { error } = await supabase.from("governance_docs").insert(form);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      await logActivity("created", "governance_doc");
    }
    setDialogOpen(false);
    toast({ title: editing ? "Document updated" : "Document created" });
    fetchData();
  };

  const handleDelete = async (item: GovDoc) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await supabase.from("governance_docs").delete().eq("id", item.id);
    await logActivity("deleted", "governance_doc", item.id);
    toast({ title: "Document deleted" });
    fetchData();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `governance/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) { toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    await supabase.from("governance_docs").update({ document_url: urlData.publicUrl }).eq("id", docId);
    toast({ title: "File uploaded" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Governance</h1>
        <Button onClick={openAdd} size="sm"><Plus size={16} className="mr-1" /> Add Document</Button>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Section</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">File</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground font-medium">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell capitalize">{item.section}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {item.document_url ? (
                    <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="text-forest text-xs hover:underline">View file</a>
                  ) : (
                    <label className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Upload
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id)} />
                    </label>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground mr-2"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No documents yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Document" : "Add Document"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Section</Label>
              <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="e.g. structure, accountability" className="mt-1" />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="mt-1" />
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

export default GovernanceManager;
