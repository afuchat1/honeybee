import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  sort_order: number;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("sort_order");

        if (error) {
          console.error("Error fetching gallery:", error);
        }

        setItems((data as GalleryItem[]) || []);
      } catch (err) {
        console.error("Gallery fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category || "general")))];
  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => (i.category || "general") === activeCategory);

  const hasImages = items.length > 0;

  return (
    <section className="section-spacing">
      <div className="wide-container">
        <h1 className="page-title">Gallery</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          Moments from our community — the children, programs, and people that make Honeybee Ministries what it is.
        </p>

        {/* Category filters */}
        {!loading && hasImages && categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden bg-gray-200 animate-pulse ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "4/4" : "4/3" }}
              />
            ))}
          </div>
        ) : hasImages ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden group cursor-pointer relative ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={item.image_url || PLACEHOLDER_IMG}
                  alt={item.caption || "Gallery image from Honeybee Ministries"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ aspectRatio: i === 0 ? "4/4" : "4/3" }}
                  loading="lazy"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-background text-sm">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl font-medium mb-4">No gallery images yet</p>
            <p>Upload some beautiful moments via the admin dashboard!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
