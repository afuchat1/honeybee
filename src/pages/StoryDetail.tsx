import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  profile_image_url: string | null;
  short_description: string;
  is_featured: boolean;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const [storyRes, galleryRes] = await Promise.all([
        supabase.from("impact_stories").select("*").eq("id", id).single(),
        supabase.from("story_gallery").select("*").eq("story_id", id).order("sort_order"),
      ]);
      setStory(storyRes.data as Story | null);
      setGallery((galleryRes.data as GalleryImage[]) || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="section-spacing text-center text-muted-foreground">Loading...</div>;
  if (!story) return <div className="section-spacing text-center text-muted-foreground">Story not found.</div>;

  return (
    <section className="section-spacing">
      <div className="content-container">
        <Link to="/impact" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Impact Stories
        </Link>

        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          {story.profile_image_url && (
            <img
              src={story.profile_image_url}
              alt={story.title}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif">{story.title}</h1>
            {story.is_featured && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium mt-2 inline-block">Featured</span>
            )}
          </div>
        </div>

        {/* Main image */}
        {story.image_url && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img src={story.image_url} alt={story.title} className="w-full max-h-[500px] object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 mb-16">
          {story.content.split("\n").filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Person Gallery */}
        {gallery.length > 0 && (
          <div>
            <h2 className="section-heading">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {gallery.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden">
                  <img src={img.image_url} alt={img.caption || story.title} className="w-full h-48 object-cover" loading="lazy" />
                  {img.caption && <p className="text-xs text-muted-foreground mt-2 px-1">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoryDetail;
