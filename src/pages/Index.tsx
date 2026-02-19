import heroImage from "@/assets/hero-community.jpg";
import aboutImg from "@/assets/about-preview.jpg";
import programsImg from "@/assets/programs-preview.jpg";
import skillsImg from "@/assets/skills-preview.jpg";
import impactImg from "@/assets/impact-preview.jpg";
import prayerImg from "@/assets/prayer-preview.jpg";
import volunteerImg from "@/assets/volunteer-preview.jpg";
import { Link } from "react-router-dom";
import { Heart, Users, Lightbulb, BookOpen, GraduationCap, Wrench, ArrowRight, Quote } from "lucide-react";

const focusAreas = [
  {
    icon: Heart,
    title: "Special Needs Outreach",
    desc: "Supporting children with special needs through inclusive education, mentorship, therapy support, and practical skills training.",
  },
  {
    icon: GraduationCap,
    title: "Rising Star Academy",
    desc: "Mentorship programs guiding children, youth, and young adults in education, career, and personal development.",
  },
  {
    icon: Wrench,
    title: "Skills Centre",
    desc: "Training in practical trades — baking, hairdressing, welding, automotive — empowering beneficiaries with income-generating skills.",
  },
];

const stats = [
  { value: "200+", label: "Children Supported" },
  { value: "50+", label: "Youth Mentored" },
  { value: "5", label: "Community Programs" },
  { value: "3", label: "Districts Reached" },
];

const values = [
  { title: "Faith", desc: "Rooted in Christian love and service" },
  { title: "Compassion", desc: "Meeting every person with dignity" },
  { title: "Integrity", desc: "Transparent and accountable" },
  { title: "Empowerment", desc: "Building capacity, not dependency" },
  { title: "Inclusion", desc: "Every child matters" },
  { title: "Community", desc: "Working together for change" },
];

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Honeybee Ministries community members and children in Eastern Uganda"
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
          <p className="text-sm md:text-base mb-4 opacity-80">
            Ecclesiastes 4:9–10
          </p>
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Creating a world where children with special needs, vulnerable youths, and families in pain can find healing, purpose, and empowerment.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link to="/contact" className="btn-hero btn-hero-primary">
              Join the Hive
            </Link>
            <Link to="/about" className="btn-hero btn-hero-outline">
              Our Story
            </Link>
            <Link to="/contact" className="btn-hero btn-hero-primary" style={{ background: "hsl(25 70% 50%)" }}>
              Donate
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview — image + text side by side */}
      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutImg}
                  alt="Honeybee Ministries team with children"
                  className="w-full h-[350px] md:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/20 -z-10 hidden md:block" />
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-forest/15 -z-10 hidden md:block" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                About Honeybee Ministries
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded on 29th August 2025 in Naminya Ward, Wakisi Division, Buikwe District, Uganda — Honeybee Ministries is a Christian-founded, interdenominational organization dedicated to nurturing, empowering, and restoring hope in communities, especially among children with special needs and vulnerable groups.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What began as a small grassroots initiative has grown into a structured, faith-driven organization committed to holistic transformation through education, care, and empowerment.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do — Programs */}
      <section className="section-spacing bg-accent/30">
        <div className="wide-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our programs are designed to meet the holistic needs of children, youths, and communities in Eastern Uganda.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {focusAreas.map((area) => (
              <div key={area.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <area.icon
                    className="w-7 h-7 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 font-serif">
                  {area.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
            >
              View All Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Image Grid */}
      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Tall rounded image */}
            <div className="rounded-[2rem] overflow-hidden shadow-lg md:row-span-2">
              <img
                src={programsImg}
                alt="Children learning in classroom"
                className="w-full h-full min-h-[300px] md:min-h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Circle image */}
            <div className="flex items-center justify-center">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg mx-auto">
                <img
                  src={skillsImg}
                  alt="Youth vocational training"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Rounded rectangle */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={impactImg}
                alt="Happy children in community"
                className="w-full h-48 md:h-56 object-cover"
                loading="lazy"
              />
            </div>
            {/* Wide rounded across bottom 2 cols */}
            <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={volunteerImg}
                alt="Community volunteers working together"
                className="w-full h-48 md:h-56 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 md:py-20 bg-forest text-forest-foreground">
        <div className="wide-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Impact So Far
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold font-serif mb-2">{stat.value}</p>
                <p className="text-sm md:text-base opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/impact"
              className="inline-flex items-center gap-2 font-semibold hover:underline underline-offset-4 opacity-90 hover:opacity-100 transition-opacity"
            >
              Read Impact Stories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Story Preview */}
      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Impact Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transforming Lives, One Child at a Time
              </h2>
              <div className="border-l-4 border-primary pl-5 mb-6">
                <Quote size={20} className="text-primary mb-2" />
                <p className="text-muted-foreground leading-relaxed italic">
                  "Before Honeybee Ministries, my child had no access to therapy or inclusive education. Today, he is thriving — learning new skills and making friends. This organization gave us hope when we had none."
                </p>
                <p className="text-sm text-foreground font-semibold mt-3">— A Parent in Buikwe District</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every day, Honeybee Ministries is making a tangible difference in the lives of vulnerable children and families across Eastern Uganda. From special needs therapy sessions to youth mentorship programs, our work is creating lasting, sustainable change in communities.
              </p>
              <Link
                to="/impact"
                className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
              >
                Read More Stories <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-xl">
                <img
                  src={impactImg}
                  alt="Children smiling together"
                  className="w-full h-[350px] md:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full bg-primary/20 -z-10 hidden md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-spacing bg-accent/30">
        <div className="wide-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is guided by these principles that keep us grounded, accountable, and focused on those we serve.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-background rounded-xl p-6 border border-border shadow-sm">
                <h3 className="font-serif font-bold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
            >
              Learn About Our Mission <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Prayer Preview */}
      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="rounded-full overflow-hidden shadow-xl w-64 h-64 md:w-80 md:h-80 mx-auto">
                <img
                  src={prayerImg}
                  alt="Community prayer gathering"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Spiritual Life</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Daily Prayer & Devotion
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At the heart of Honeybee Ministries is our faith. We believe in the power of prayer and scripture to transform lives. Every day, we share a devotional thought with scripture, reflection, and prayer for our community.
              </p>
              <blockquote className="border-l-4 border-primary pl-5 mb-6">
                <p className="text-muted-foreground italic leading-relaxed">
                  "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
                </p>
                <cite className="text-sm text-foreground font-semibold block mt-2 not-italic">— Jeremiah 29:11</cite>
              </blockquote>
              <Link
                to="/daily-prayer"
                className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
              >
                Today's Prayer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2025–2030 */}
      <section className="py-16 md:py-20 bg-forest text-forest-foreground">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vision 2025–2030
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto opacity-90 mb-8">
            Over the next five years, Honeybee Ministries aims to expand our reach across Eastern Uganda, establishing sustainable community centers, training 500+ youth in vocational skills, and providing ongoing support to over 200 children with special needs.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-10">
            <div className="text-center">
              <p className="text-3xl font-bold font-serif">500+</p>
              <p className="text-xs opacity-80 mt-1">Youth Trained</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-serif">200+</p>
              <p className="text-xs opacity-80 mt-1">Children Supported</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-serif">10</p>
              <p className="text-xs opacity-80 mt-1">New Centers</p>
            </div>
          </div>
          <Link
            to="/impact"
            className="inline-flex items-center gap-2 font-semibold hover:underline underline-offset-4 opacity-90 hover:opacity-100"
          >
            See Our Impact <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Governance Preview */}
      <section className="section-spacing">
        <div className="wide-container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Governance</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transparent & Accountable
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Honeybee Ministries is registered as a Community Based Organization (CBO) in Buikwe District, Uganda. We are governed by an Executive Committee that provides strategic oversight and ensures compliance with local and national regulations.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our leadership team includes an Executive Director, Programs Coordinator, Finance Officer, and Community Liaison — each bringing experience in social work, education, ministry, and community development.
              </p>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 text-forest font-semibold hover:underline underline-offset-4"
              >
                View Our Governance <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={volunteerImg}
                alt="Honeybee team and leadership"
                className="w-full h-[300px] md:h-[380px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Get Involved */}
      <section className="section-spacing bg-accent/30">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Get Involved
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Whether you want to volunteer, donate, partner, or simply learn more about our work — we'd love to hear from you. Together, we can build a hive of hope for the most vulnerable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-hero btn-hero-primary">
              Contact Us
            </Link>
            <Link to="/programs" className="btn-hero btn-hero-outline border-forest text-forest hover:bg-forest/10">
              Explore Programs
            </Link>
            <Link to="/daily-prayer" className="btn-hero btn-hero-outline border-forest text-forest hover:bg-forest/10">
              Daily Prayer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
