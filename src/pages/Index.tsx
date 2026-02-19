import heroImage from "@/assets/hero-community.jpg";
import { Link } from "react-router-dom";
import { Heart, Users, Lightbulb } from "lucide-react";

const focusAreas = [
  {
    icon: Heart,
    title: "Special Needs Support",
    desc: "Providing care, therapy, and inclusion programs for children with special needs, ensuring every child has the opportunity to thrive.",
  },
  {
    icon: Users,
    title: "Youth Mentorship",
    desc: "Guiding young people through mentorship, leadership training, and spiritual growth to become positive change-makers in their communities.",
  },
  {
    icon: Lightbulb,
    title: "Skills Development",
    desc: "Equipping individuals with practical vocational skills and entrepreneurship training for sustainable, independent livelihoods.",
  },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Honeybee Ministries community members and children in Eastern Uganda"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto hero-text">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
            Honeybee Ministries
          </h1>
          <p className="text-xl md:text-2xl mb-3 font-light italic">
            Together we build a hive of hope
          </p>
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Empowering vulnerable children and communities in Eastern Uganda through faith, education, and sustainable development.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link to="/contact" className="btn-hero btn-hero-primary">
              Join the Hive
            </Link>
            <Link to="/programs" className="btn-hero btn-hero-outline">
              View Programs
            </Link>
            <Link to="/contact" className="btn-hero btn-hero-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-spacing">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Honeybee Ministries is a faith-based organization rooted in Eastern Uganda, committed to transforming the lives of vulnerable children, youth, and communities. Through compassion, mentorship, and practical skills training, we nurture a generation of empowered individuals who can thrive.
          </p>
          <Link
            to="/about"
            className="inline-block mt-8 text-forest font-semibold hover:underline underline-offset-4"
          >
            Learn more about us →
          </Link>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section-spacing bg-accent/30">
        <div className="wide-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Our Focus Areas
          </h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {focusAreas.map((area) => (
              <div key={area.title} className="text-center">
                <area.icon
                  className="w-10 h-10 mx-auto mb-5 text-primary"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {area.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Preview */}
      <section className="section-spacing">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Vision 2025–2030
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Over the next five years, Honeybee Ministries aims to expand our reach across Eastern Uganda, establishing sustainable community centers, training 500+ youth in vocational skills, and providing ongoing support to over 200 children with special needs.
          </p>
          <Link
            to="/impact"
            className="inline-block mt-8 text-forest font-semibold hover:underline underline-offset-4"
          >
            See our impact →
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
