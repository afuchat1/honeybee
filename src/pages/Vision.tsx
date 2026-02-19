import { Home as HomeIcon, Wrench, Users, MapPin, FileCheck, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const goals = [
  {
    icon: HomeIcon,
    title: "Special Needs Sleeping Home",
    desc: "A safe, loving residential facility for children with special needs who lack adequate home care — providing 24/7 support, therapy, and education.",
  },
  {
    icon: Wrench,
    title: "Skills Center",
    desc: "A fully equipped vocational training center offering certified courses in baking, hairdressing, welding, carpentry, and digital skills — giving youth the tools for independence.",
  },
  {
    icon: Users,
    title: "Mentorship & Life Guidance",
    desc: "Expanding the Rising Star Academy to mentor 500+ youth across Eastern Uganda — providing education support, career guidance, and spiritual development.",
  },
];

const progress = [
  { icon: MapPin, label: "Land acquired for the Skills Center" },
  { icon: FileCheck, label: "Ministry officially registered as a CBO" },
  { icon: Heart, label: "First child supported through the Special Needs program" },
];

const Vision = () => {
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
