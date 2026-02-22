import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import founderImgFallback from "@/assets/founder-esther.jpg";
import impactImgFallback from "@/assets/impact-preview.jpg";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const OurStory = () => {
  const [siteImages, setSiteImages] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_images").select("image_key, image_url").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((img: any) => { map[img.image_key] = img.image_url; });
        setSiteImages(map);
      }
    });
  }, []);

  const img = (key: string, fallback: string) => siteImages[key] || fallback;

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Our Story</h1>

        <div className="space-y-20">
          {/* Dylan's Story */}
          <div>
            <h2 className="section-heading">Dylan's Story — A Story of Hope</h2>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-3 text-muted-foreground leading-relaxed space-y-4">
                <p>When Dylan was first brought to Honeybee Ministries, he was a quiet child who had been largely excluded from community life due to his physical disability. His family, like many in rural Eastern Uganda, lacked the resources and knowledge to support his specific needs.</p>
                <p>Through our Special Needs Support program, Dylan began receiving regular physiotherapy and was enrolled in an inclusive learning environment. Over time, his confidence grew. He began participating in group activities, forming friendships, and expressing himself through art and storytelling.</p>
                <p>Today, Dylan is one of the most spirited members of his community group. His mother has become an advocate for disability inclusion in her village, and his story continues to inspire families across the region.</p>
              </div>
              <div className="md:col-span-2">
                <div className="rounded-2xl overflow-hidden">
                  <img src={img("impact_preview", impactImgFallback)} alt="Children at Honeybee Ministries" className="w-full h-auto object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          {/* Founder's Journey */}
          <div>
            <h2 className="section-heading">The Founder's Journey — Esther Awori</h2>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden">
                  <img src={img("founder_photo", founderImgFallback)} alt="Esther Awori, Founder" className="w-full h-auto object-cover" loading="lazy" />
                </div>
              </div>
              <div className="md:col-span-3 order-1 md:order-2 text-muted-foreground leading-relaxed space-y-4">
                <p>Esther Awori's journey to founding Honeybee Ministries was born out of personal experience with pain, faith, and a deep conviction that every child deserves a chance.</p>
                <p>After years of prayer, preparation, and service in various community roles, Esther felt called to create an organization that would combine faith-based values with practical, sustainable programs. In August 2025, she officially registered Honeybee Ministries as a Community Based Organization in Buikwe District.</p>
                <p>Her vision was simple but powerful: to build a "hive of hope" where every person — especially children with special needs and vulnerable youth — could find belonging, purpose, and a path to a brighter future.</p>
              </div>
            </div>
          </div>

          {/* Faith and Restoration */}
          <div>
            <h2 className="section-heading">Faith, Restoration & Purpose</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>At its core, Honeybee Ministries is a faith story. It is the story of a God who restores broken things and calls ordinary people to extraordinary purpose. The name "Honeybee" was chosen intentionally — because bees work together, each contributing their unique role to sustain the hive.</p>
              <p>This is the spirit of our ministry. We believe that transformation happens in community — when people of faith come together with compassion, skill, and determination to serve those who need it most.</p>
            </div>
          </div>

          {/* Campfire */}
          <div>
            <h2 className="section-heading">Campfire Experience: "No Longer a Slave to Fear"</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>Our Campfire gatherings bring together youth and community members for evenings of worship, testimony, and healing. Named after the warmth and light of a campfire, these gatherings create a safe space for people to share their struggles and find encouragement.</p>
              <p>One recurring theme has been freedom from fear — fear of the future, fear born of trauma, and fear of being forgotten. Through prayer, counseling, and community support, participants have found renewed hope and strength.</p>
              <p>The Campfire program has become one of our most requested community events, with attendance growing steadily each quarter.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/get-involved" className="btn-hero btn-hero-primary">
            Join Our Story <ArrowRight size={16} className="ml-2 inline" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
