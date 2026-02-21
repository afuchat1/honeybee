import { useEffect, useState } from "react";
import { Home as HomeIcon, Wrench, Users, MapPin, FileCheck, Heart, ArrowRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const goals = [
  {
    icon: HomeIcon,
    title: "Special Needs Sleeping Home",
    desc: "A safe, loving residential facility for children with special needs who lack adequate home care — providing 24/7 support, therapy, and education.",
  },
  {
    icon: Wrench,
    title: "Healing Spaces Inclusive Skills & Recovery Centre",
    desc: "A holistic centre integrating vocational training (makeup, hairdressing, baking, tailoring, ushering), psychosocial recovery, life-skills development, and structured work-based learning for 20 disabled and vulnerable youth per intake.",
  },
  {
    icon: Users,
    title: "Maama Suubi Restoration Office",
    desc: "A one-on-one restoration and prayer space in Jinja Town — serving as ministry headquarters for guidance, counseling, Bible & Brunch activities, Campfire sessions, and outreach events.",
  },
];

const progress = [
  { icon: MapPin, label: "Land acquired for the Skills Center" },
  { icon: FileCheck, label: "Ministry officially registered as a CBO" },
  { icon: Heart, label: "First child supported through the Special Needs program" },
];

interface VisionDoc {
  id: string;
  title: string;
  description: string;
  document_url: string;
  file_name: string;
}

const Vision = () => {
  const [docs, setDocs] = useState<VisionDoc[]>([]);

  useEffect(() => {
    supabase.from("vision_documents").select("*").order("sort_order").then(({ data }) => {
      setDocs((data as VisionDoc[]) || []);
    });
  }, []);

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Vision 2025–2030</h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Building a Hive of Hope — Our Five-Year Vision
        </p>
        <p className="text-muted-foreground leading-relaxed mb-16">
          Over the next five years, Honeybee Ministries aims to expand our reach across Eastern Uganda, creating sustainable systems of care and empowerment for the most vulnerable members of our communities.
        </p>

        {/* Goals */}
        <div className="mb-20">
          <h2 className="section-heading">Our Goals</h2>
          <div className="space-y-10 mt-8">
            {goals.map((g) => (
              <div key={g.title} className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <g.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-serif">{g.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-16">
          <h2 className="section-heading">Progress So Far</h2>
          <div className="space-y-4 mt-8">
            {progress.map((p) => (
              <div key={p.label} className="flex items-center gap-4 py-3 border-b border-border/60 last:border-0">
                <p.icon className="w-5 h-5 text-forest flex-shrink-0" strokeWidth={1.5} />
                <span className="text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Documents */}
        {docs.length > 0 && (
          <div className="mb-16">
            <h2 className="section-heading">Documents & Proposals</h2>
            <div className="space-y-3 mt-8">
              {docs.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">{doc.title}</p>
                    {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                  </div>
                  <Download size={18} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link to="/get-involved" className="btn-hero btn-hero-primary">
            Support Our Vision <ArrowRight size={16} className="ml-2 inline" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Vision;
