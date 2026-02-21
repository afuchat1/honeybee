import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/logActivity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, ImageIcon } from "lucide-react";

interface SiteImage {
  id: string;
  image_key: string;
  image_url: string;
  label: string;
}

const IMAGE_SLOTS = [
  { key: "hero_background", label: "Homepage Hero Background" },
  { key: "about_preview", label: "About Section Image" },
  { key: "programs_preview", label: "Programs Strip Image 1" },
  { key: "skills_preview", label: "Programs Strip Image 2" },
  { key: "impact_preview", label: "Programs Strip Image 3" },
  { key: "prayer_preview", label: "Daily Prayer Section Image" },
  { key: "founder_photo", label: "Founder Photo (Esther Awori)" },
  { key: "volunteer_preview", label: "Get Involved Image" },
];

const SiteImagesManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("site_images").select("*");
    setImages((data as SiteImage[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const getImage = (key: string) => images.find((i) => i.image_key === key);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: { key: string; label: string }) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(slot.key);

    const ext = file.name.split(".").pop();
    const path = `site-images/${slot.key}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("uploads").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    const existing = getImage(slot.key);

    if (existing) {
      await supabase.from("site_images").update({ image_url: urlData.publicUrl }).eq("id", existing.id);
    } else {
      await supabase.from("site_images").insert({ image_key: slot.key, image_url: urlData.publicUrl, label: slot.label });
    }

    await logActivity("updated", "site_image", undefined, { key: slot.key });
    toast({ title: "Image updated" });
    setUploading(null);
    fetchData();
  };

  const handleDelete = async (slot: { key: string }) => {
    const existing = getImage(slot.key);
    if (!existing) return;
    if (!confirm("Remove this image? The default will be used instead.")) return;
    await supabase.from("site_images").delete().eq("id", existing.id);
    await logActivity("deleted", "site_image", existing.id, { key: slot.key });
    toast({ title: "Image removed" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Site Images</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage all images displayed on the website. Upload new images to replace the defaults.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IMAGE_SLOTS.map((slot) => {
          const img = getImage(slot.key);
          return (
            <div key={slot.key} className="bg-background rounded-lg border border-border overflow-hidden">
              {img ? (
                <img src={img.image_url} alt={slot.label} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center">
                  <ImageIcon size={32} className="text-muted-foreground/40" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground mb-2">{slot.label}</p>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <Button variant="outline" size="sm" className="w-full" disabled={uploading === slot.key} asChild>
                      <span><Upload size={14} className="mr-1" /> {uploading === slot.key ? "Uploading..." : "Upload"}</span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, slot)} />
                  </label>
                  {img && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(slot)} className="text-destructive hover:text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SiteImagesManager;
