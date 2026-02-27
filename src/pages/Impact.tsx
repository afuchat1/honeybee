import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, User } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  profile_image_url: string | null;
  short_description: string;
  is_featured: boolean;
  sort_order: number;
  slug: string | null;
  created_at: string;
}

const toSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Impact = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase.from("impact_stories").select("*").order("sort_order");
      setStories((data as Story[]) || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <section className="section-spacing">
      <div className="content-container">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-accent/30">
          <div className="px-8 py-14 md:py-20">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Home • Impact Stories</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Impact Stories</h1>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
        ) : stories.length > 0 ? (
          <div className="space-y-10 mb-20">
            {stories.map((story) => {
              const storySlug = story.slug || toSlug(story.title);
              const dateStr = new Date(story.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              });
              return (
                <article
                  key={story.id}
                  className="bg-background rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="p-6 md:p-8">
                    <p className="text-sm text-primary font-semibold mb-3">{dateStr}</p>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-4">
                      {story.title}
                    </h2>

                    {/* Cover image */}
                    {story.image_url && (
                      <div className="rounded-xl overflow-hidden mb-5 border border-primary/20">
                        <img
                          src={story.image_url}
                          alt={story.title}
                          className="w-full max-h-80 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Profile + short desc */}
                    <div className="flex items-start gap-4 mb-5">
                      {story.profile_image_url ? (
                        <img
                          src={story.profile_image_url}
                          alt={story.title}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-muted-foreground/50" />
                        </div>
                      )}
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
                        {story.short_description || story.content.substring(0, 200) + "..."}
                      </p>
                    </div>

                    <Link
                      to={`/impact/${storySlug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            No stories yet. Check back soon!
          </div>
        )}

        {/* Progress Highlights */}
        <div className="mb-20">
          <h2 className="section-heading">Progress Highlights</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {[
              { number: "500+", label: "Children supported" },
              { number: "200+", label: "Youth mentored" },
              { number: "15+", label: "Communities reached" },
              { number: "4", label: "Active programs" },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-6">
                <div className="text-3xl md:text-4xl font-serif font-bold text-forest mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="btn-hero btn-hero-primary">Partner With Us</Link>
        </div>
      </div>
    </section>
  );
};

export default Impact;
