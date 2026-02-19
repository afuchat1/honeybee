import { HandHeart, Baby, Handshake, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ways = [
  {
    icon: HandHeart,
    title: "Volunteer",
    desc: "Give your time and skills. We welcome volunteers in teaching, mentorship, healthcare, construction, and community outreach. Whether local or international, there's a place for you.",
  },
  {
    icon: Baby,
    title: "Sponsor a Child",
    desc: "Your monthly support can transform a child's life — providing access to therapy, education, meals, and a safe learning environment. Every child deserves a champion.",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    desc: "We welcome partnerships with churches, NGOs, businesses, and individuals who share our vision. Together, we can scale our impact and reach more communities.",
  },
  {
    icon: BookOpen,
    title: "Pray With Us",
    desc: "Prayer is the foundation of everything we do. Join our daily prayer community and stand with us in intercession for the children and families we serve.",
  },
];

const GetInvolved = () => {
  return (
    <>
      <section className="section-spacing">
        <div className="content-container">
          <h1 className="page-title">Get Involved</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-16 max-w-2xl">
            There are many ways to be part of the Honeybee family. Whether near or far, your contribution makes a difference.
          </p>

          <div className="space-y-12">
            {ways.map((w) => (
              <div key={w.title} className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <w.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2 font-serif">{w.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary/10">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
            Reach out to us today and let's explore how you can be part of this movement. Every act of kindness, big or small, ripples through communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-hero btn-hero-primary">
              Contact Us <ArrowRight size={16} className="ml-2 inline" />
            </Link>
            <Link to="/daily-prayer" className="btn-hero border border-foreground/20 text-foreground hover:bg-accent transition-colors">
              Join Daily Prayer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetInvolved;
