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
import { Plus, Pencil, Trash2, Star, Upload, Image, User } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  short_description: string;
  image_url: string | null;
  profile_image_url: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface GalleryImage {
  id: string;
  story_id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

const emptyForm = { title: "", content: "", short_description: "", is_featured: false, sort_order: 0 };

const ImpactManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Story[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("impact_stories").select("*").order("sort_order");
    setItems((data as Story[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (item: Story) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, short_description: item.short_description || "", is_featured: item.is_featured, sort_order: item.sort_order });
    setDialogOpen(true);
  };

  const openGallery = async (story: Story) => {
    setSelectedStory(story);
    const { data } = await supabase.from("story_gallery").select("*").eq("story_id", story.id).order("sort_order");
    setGalleryImages((data as GalleryImage[]) || []);
    setGalleryDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, storyId: string, field: "image_url" | "profile_image_url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `impact/${field}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    await supabase.from("impact_stories").update({ [field]: urlData.publicUrl }).eq("id", storyId);
    toast({ title: "Image uploaded" });
    setUploading(false);
    fetchData();
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStory) return;
    setGalleryUploading(true);
    const ext = file.name.split(".").pop();
    const path = `story-gallery/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setGalleryUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    await supabase.from("story_gallery").insert({
      story_id: selectedStory.id,
      image_url: urlData.publicUrl,
      caption: galleryCaption,
    });
    toast({ title: "Gallery image added" });
    setGalleryCaption("");
    setGalleryUploading(false);
    const { data } = await supabase.from("story_gallery").select("*").eq("story_id", selectedStory.id).order("sort_order");
    setGalleryImages((data as GalleryImage[]) || []);
  };

  const handleGalleryDelete = async (img: GalleryImage) => {
    await supabase.from("story_gallery").delete().eq("id", img.id);
    setGalleryImages(galleryImages.filter((g) => g.id !== img.id));
    toast({ title: "Image removed" });
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
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Profile</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Cover</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Featured</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {item.profile_image_url ? (
                    <label className="cursor-pointer">
                      <img src={item.profile_image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id, "profile_image_url")} disabled={uploading} />
                    </label>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <User size={14} />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id, "profile_image_url")} disabled={uploading} />
                    </label>
                  )}
                </td>
                <td className="px-4 py-3">
                  {item.image_url ? (
                    <label className="cursor-pointer">
                      <img src={item.image_url} alt="" className="w-12 h-10 object-cover rounded" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id, "image_url")} disabled={uploading} />
                    </label>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-12 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Upload size={14} />
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id, "image_url")} disabled={uploading} />
                    </label>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">{item.title}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {item.is_featured && <Star size={14} className="text-primary fill-primary" />}
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button onClick={() => openGallery(item)} className="text-muted-foreground hover:text-foreground" title="Gallery"><Image size={15} /></button>
                  <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No stories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Story" : "Add Story"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Short Description (shown on card)</Label>
              <Textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} className="mt-1" placeholder="Brief summary shown on the impact page card" />
            </div>
            <div>
              <Label>Full Content</Label>
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

      {/* Gallery Dialog */}
      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Gallery: {selectedStory?.title}</DialogTitle></DialogHeader>
          
          <div className="flex gap-2 items-end mb-4">
            <div className="flex-1">
              <Label>Caption (optional)</Label>
              <Input value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} placeholder="Image caption" className="mt-1" />
            </div>
            <label>
              <Button variant="outline" size="sm" disabled={galleryUploading} asChild>
                <span><Plus size={14} className="mr-1" /> {galleryUploading ? "Uploading..." : "Add Image"}</span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden">
                <img src={img.image_url} alt={img.caption} className="w-full h-28 object-cover" />
                {img.caption && <p className="text-xs text-muted-foreground p-1 truncate">{img.caption}</p>}
                <button
                  onClick={() => handleGalleryDelete(img)}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          {galleryImages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No gallery images yet.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImpactManager;
