import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, Upload } from "lucide-react";

interface VisionDoc {
  id: string;
  title: string;
  description: string;
  document_url: string;
  file_name: string;
  sort_order: number;
}

const VisionDocsManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<VisionDoc[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("vision_documents").select("*").order("sort_order");
    setItems((data as VisionDoc[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !title.trim()) {
      toast({ title: "Please enter a title first", variant: "destructive" });
      return;
    }
    setUploading(true);

    const path = `vision-docs/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    const { error } = await supabase.from("vision_documents").insert({
      title: title.trim(),
      description: description.trim(),
      document_url: urlData.publicUrl,
      file_name: file.name,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document added" });
      await logActivity("created", "vision_document", undefined, { title });
      setTitle("");
      setDescription("");
      fetchData();
    }
    setUploading(false);
  };

  const handleDelete = async (item: VisionDoc) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await supabase.from("vision_documents").delete().eq("id", item.id);
    await logActivity("deleted", "vision_document", item.id);
    toast({ title: "Document deleted" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Vision Documents</h1>

      <div className="bg-background rounded-lg border border-border p-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Document Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Healing Spaces Proposal" className="mt-1" />
          </div>
          <div>
            <Label>Short Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" className="mt-1" />
          </div>
        </div>
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" disabled={uploading || !title.trim()} asChild>
            <span><Plus size={14} className="mr-1" /> {uploading ? "Uploading..." : "Upload Document"}</span>
          </Button>
          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">File</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="text-foreground font-medium">{item.title}</p>
                  {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-forest hover:underline">
                    <FileText size={12} /> {item.file_name || "View"}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">No documents yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisionDocsManager;
