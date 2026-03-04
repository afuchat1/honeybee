import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import founderImgFallback from "@/assets/founder-esther.jpg";
import founderGraduation from "@/assets/founder-graduation.jpg";
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
          {/* Founder's Journey */}
          <div>
            <h2 className="section-heading">Our Founder's Story — Esther Awori: Building a Hive of Hope</h2>
            
            {/* Images at the top */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl overflow-hidden">
                <img src={img("founder_photo", founderImgFallback)} alt="Esther Awori, Founder" className="w-full h-72 md:h-80 object-cover" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={founderGraduation} alt="Esther Awori at a graduation celebration" className="w-full h-72 md:h-80 object-cover" loading="lazy" />
              </div>
            </div>

            <div className="text-muted-foreground leading-relaxed space-y-6">
              <p>Honeybee Ministries was not born from comfort. It was born from brokenness, prayer, and divine restoration.</p>
              <p>Esther Awori was raised in a humble but faith-filled family by Bishop Omar Emmanuel and her mother, Nantale Annet, residents of Buikwe District. Though financial resources were limited, their home overflowed with prayer, love, and belief in God's promises.</p>
              <p>From a young age, Esther was taught that destiny is not determined by background, but by purpose. Through dedication and discipline, she became a mechanical engineer by profession—a testimony that faith and hard work can lift a child from a simple home into professional excellence. She secured a good job and began building a stable future.</p>
              <p>Then life shifted suddenly. A severe back condition disrupted everything. Chronic pain forced her to step away from the career she had worked so hard to build. The loss of her job was not just financial—it was emotional and spiritual. Identity was shaken. Confidence collapsed.</p>
              <p>In the process of trying to manage the pain, medication dependency crept in. What began as treatment slowly turned into addiction. Depression followed. Isolation followed. Silence followed.</p>
              <p>And in that silent season, Esther encountered God differently—not as a distant figure but as a Restorer. She realized that when people face sudden loss—an accident, disability, job loss, addiction, grief—they are rarely equipped for the emotional and spiritual battle that follows. Many lose hope before they lose resources.</p>
              <p>But through prayer, inner healing, and gradual rebuilding, Esther began to rise again. Not instantly. Not perfectly. But faithfully.</p>
              <p>And that is where Honeybee Ministries was born.</p>

              <h3 className="text-xl font-semibold text-foreground mt-8">The Spiritual Foundation</h3>
              <p>Honeybee Ministries is rooted in the belief that restoration begins with the soul.</p>
              <p>We believe:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>God restores what life breaks.</li>
                <li>Pain can become purpose.</li>
                <li>No situation is beyond redemption.</li>
                <li>Every person carries divine worth and destiny.</li>
              </ul>
              <p>Our work is not just humanitarian—it is spiritual restoration combined with practical empowerment. We walk with people in prayer. We speak hope into broken seasons. We create environments where faith and healing coexist. Because healing is not only physical—it is emotional, spiritual, and mental.</p>

              <h3 className="text-xl font-semibold text-foreground mt-8">A Heart for the Vulnerable & Special Needs Community</h3>
              <p>One of the deepest burdens in Esther's heart is for individuals who feel forgotten—especially those living with disabilities or special needs.</p>
              <p>Many people who experience accidents and lose mobility feel discarded by society. Many individuals born with special needs are underestimated. Many families carrying these responsibilities feel overwhelmed and unsupported.</p>
              <p>Honeybee Ministries exists to say: You are not a burden. You are not forgotten. You are not finished.</p>
              <p>Our future Restoration & Skills Center is designed to be inclusive—a safe and supportive environment where:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Individuals who have lost limbs in accidents can rebuild confidence and learn adaptive skills.</li>
                <li>People recovering from long-term illness can regain strength and dignity.</li>
                <li>Those battling addiction can rediscover identity and self-worth.</li>
                <li>Vulnerable and special needs individuals can receive mentorship, skill development, and spiritual support.</li>
              </ul>
              <p>Because ability is not defined by physical limitation—it is defined by purpose.</p>
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
