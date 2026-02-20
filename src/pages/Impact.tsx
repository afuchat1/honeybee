import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
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

        {/* Dynamic Impact Stories */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading stories...</div>
        ) : stories.length > 0 ? (
          <div className="space-y-16 mb-20">
            {stories.map((story, i) => (
              <div key={story.id}>
                {i > 0 && <div className="mb-16 h-px bg-border/60" />}
                <div className={`${story.image_url ? "md:flex md:gap-10 md:items-start" : ""}`}>
                  {story.image_url && (
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full md:w-72 h-48 object-cover rounded-xl mb-6 md:mb-0 flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="section-heading mb-0">{story.title}</h2>
                      {story.is_featured && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Featured</span>
                      )}
                    </div>
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      {story.content.split("\n").filter(Boolean).map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Fallback static content */}
            <div className="mb-20">
              <h2 className="section-heading">Dylan's Story</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>When Dylan was first brought to Honeybee Ministries, he was a quiet child who had been largely excluded from community life due to his physical disability.</p>
                <p>Through our Special Needs Support program, Dylan began receiving regular physiotherapy and was enrolled in an inclusive learning environment. Over time, his confidence grew.</p>
                <p>Today, Dylan is one of the most spirited members of his community group. His story continues to inspire families across the region.</p>
              </div>
            </div>
            <div className="mb-20">
              <h2 className="section-heading">Campfire: No Longer a Slave to Fear</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>Our Campfire gatherings bring together youth and community members for evenings of worship, testimony, and healing.</p>
                <p>Through prayer, counseling, and community support, participants have found renewed hope and strength.</p>
              </div>
            </div>
          </>
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
