import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ✅ Keep these two only
import prayerImgFallback from "@/assets/prayer-preview.jpg";
import founderImgFallback from "@/assets/founder-esther.jpg";

import { Link } from "react-router-dom";
import { Heart, GraduationCap, Wrench, Flame, ArrowRight } from "lucide-react";

const programsList = [
  { icon: Heart, title: "Special Needs Outreach", desc: "Supporting children with special needs through inclusive education, mentorship, therapy support, and practical skills training." },
  { icon: GraduationCap, title: "Rising Star Academy", desc: "Mentorship programs guiding children, youth, and young adults in education, career, and personal development." },
  { icon: Wrench, title: "Skills Centre", desc: "Training in practical trades — baking, hairdressing, welding, automotive — empowering beneficiaries with income-generating skills." },
  { icon: Flame, title: "Healing Circles & Campfire", desc: "Community gatherings for worship, testimony, and trauma healing — creating safe spaces for restoration and hope." },
];

const Index = () => {
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

  const img = (key: string, fallback?: string) =>
    siteImages[key] || fallback || "";

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={img("hero_background")}
          alt="Honeybee Ministries community in Eastern Uganda"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto hero-text">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Welcome to<br />Honeybee Ministries
          </h1>
          <p className="text-xl md:text-2xl mb-2 font-light italic font-serif">
            "Together we build a hive of hope"
          </p>
          <p className="text-sm mb-4 opacity-70">Ecclesiastes 4:9–10</p>
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Creating a world where children with special needs, vulnerable youths, and families in pain can find healing, purpose, and empowerment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/get-involved" className="btn-hero btn-hero-primary">Join the Hive</Link>
            <Link to="/our-story" className="btn-hero btn-hero-outline">Our Story</Link>
            <Link to="/contact" className="btn-hero btn-hero-primary" style={{ background: "hsl(25 70% 50%)" }}>Donate</Link>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={img("about_preview")}
                alt="Honeybee community members"
                className="w-full h-[380px] object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
                About Honeybee Ministries
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded on 29th August 2025 in Naminya Ward, Wakisi Division, Buikwe District, Uganda — Honeybee Ministries is a Christian-founded, interdenominational organization dedicated to nurturing, empowering, and restoring hope in communities, especially among children with special needs and vulnerable groups.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our name reflects our belief that like honeybees, we thrive when we work together — each person contributing their unique gifts to build something greater than themselves.
              </p>
              <Link to="/our-story" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4">
                Read Our Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 bg-background">
        <div className="wide-container">
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              <img src={img("programs_preview")} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              <img src={img("skills_preview")} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              <img src={img("impact_preview")} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="wide-container grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Our Founder</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">Esther Awori</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Esther Awori's journey to founding Honeybee Ministries was born out of personal experience with pain, faith, and a deep conviction that every child deserves a chance.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden max-w-sm">
              <img
                src={img("founder_photo", founderImgFallback)}
                alt="Esther Awori, Founder of Honeybee Ministries"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-muted/40">
        <div className="wide-container grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex justify-center order-2 md:order-1">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden">
              <img
                src={img("prayer_preview", prayerImgFallback)}
                alt="Community prayer"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Spiritual Life</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">Daily Prayer & Devotion</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At the heart of Honeybee Ministries is our faith.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
