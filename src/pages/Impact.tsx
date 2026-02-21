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
}

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
        <h1 className="page-title">Our Impact</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Every life we touch creates a ripple of change through families and communities. Here are the stories and milestones that define our journey.
        </p>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
        ) : stories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {stories.map((story) => (
              <Link
                key={story.id}
                to={`/impact/${story.id}`}
                className="group bg-background rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 transition-colors"
              >
                {/* Card image or profile */}
                <div className="p-6 pb-4 flex items-center gap-4">
                  {story.profile_image_url ? (
                    <img
                      src={story.profile_image_url}
                      alt={story.title}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-foreground font-serif group-hover:text-primary transition-colors truncate">{story.title}</h2>
                    {story.is_featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Featured</span>
                    )}
                  </div>
                </div>
                {story.image_url && (
                  <img src={story.image_url} alt={story.title} className="w-full h-44 object-cover" loading="lazy" />
                )}
                <div className="p-6 pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {story.short_description || story.content.substring(0, 150) + "..."}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold mt-4 group-hover:underline underline-offset-4">
                    Read Full Story <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { title: "Dylan's Story", desc: "When Dylan was first brought to Honeybee Ministries, he was a quiet child who had been largely excluded from community life due to his physical disability." },
              { title: "Campfire: No Longer a Slave to Fear", desc: "Our Campfire gatherings bring together youth and community members for evenings of worship, testimony, and healing." },
            ].map((s) => (
              <div key={s.title} className="bg-background rounded-2xl border border-border/60 overflow-hidden p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-muted-foreground/50" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground font-serif">{s.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
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
