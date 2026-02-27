import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import aboutImg from "@/assets/about-preview.jpg";
import programsImg from "@/assets/programs-preview.jpg";
import skillsImg from "@/assets/skills-preview.jpg";
import impactImg from "@/assets/impact-preview.jpg";
import prayerImg from "@/assets/prayer-preview.jpg";
import volunteerImg from "@/assets/volunteer-preview.jpg";
import heroImg from "@/assets/hero-community.jpg";
import founderImg from "@/assets/founder-esther.jpg";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  sort_order: number;
}

const fallbackImages = [
  { src: heroImg, alt: "Community gathering" },
  { src: aboutImg, alt: "Honeybee team with children" },
  { src: programsImg, alt: "Children in classroom" },
  { src: skillsImg, alt: "Youth skills training" },
  { src: impactImg, alt: "Happy children together" },
  { src: prayerImg, alt: "Community prayer" },
  { src: volunteerImg, alt: "Volunteers building together" },
  { src: founderImg, alt: "Esther Awori, Founder" },
];

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from("gallery").select("*").order("sort_order");
      setItems((data as GalleryItem[]) || []);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category || "general")))];
  const filtered = activeCategory === "all" ? items : items.filter((i) => (i.category || "general") === activeCategory);
  const hasDbImages = items.length > 0;

  return (
    <section className="section-spacing">
      <div className="wide-container">
        <h1 className="page-title">Gallery</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          Moments from our community — the children, programs, and people that make Honeybee Ministries what it is.
        </p>

        {/* Category filters */}
        {hasDbImages && categories.length > 2 && (
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
          <div className="text-center py-12 text-muted-foreground">Loading gallery...</div>
        ) : hasDbImages ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden group cursor-pointer ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full min-h-[180px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {fallbackImages.map((img, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden group cursor-pointer ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full min-h-[180px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
