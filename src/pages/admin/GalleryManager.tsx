import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category: string;
  sort_order: number;
}

const GalleryManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("general");

  const fetchData = async () => {
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    setItems((data as GalleryItem[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);

    const { error } = await supabase.from("gallery").insert({
      image_url: urlData.publicUrl,
      caption,
      category,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Image added" });
      await logActivity("created", "gallery", undefined, { caption });
      setCaption("");
      fetchData();
    }
    setUploading(false);
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("gallery").delete().eq("id", item.id);
    await logActivity("deleted", "gallery", item.id);
    toast({ title: "Image deleted" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Gallery</h1>

      {/* Upload form */}
      <div className="bg-background rounded-lg border border-border p-4 mb-6">
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Caption</Label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Image caption" className="mt-1" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. events" className="mt-1" />
          </div>
          <div>
            <Label>Upload Image</Label>
            <div className="mt-1">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" disabled={uploading} asChild>
                  <span><Plus size={14} className="mr-1" /> {uploading ? "Uploading..." : "Choose File"}</span>
                </Button>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-background rounded-lg border border-border overflow-hidden group relative">
            <img src={item.image_url} alt={item.caption} className="w-full h-40 object-cover" />
            <div className="p-2">
              <p className="text-xs text-foreground truncate">{item.caption || "No caption"}</p>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
            <button
              onClick={() => handleDelete(item)}
              className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No gallery images yet.</p>
      )}
    </div>
  );
};

export default GalleryManager;
