import { Link } from "react-router-dom";

const milestones = [
  { year: "2025", goal: "Launch 2 new community centers in underserved districts" },
  { year: "2026", goal: "Train 150 youth in vocational skills through the Skills Training Centre" },
  { year: "2027", goal: "Expand Special Needs Support to serve 100+ children" },
  { year: "2028", goal: "Establish scholarship fund for Rising Star Academy graduates" },
  { year: "2029", goal: "Partner with 20+ schools for inclusive education programs" },
  { year: "2030", goal: "Achieve full financial sustainability through local enterprise programs" },
];

const Impact = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Our Impact</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Every life we touch creates a ripple of change through families and communities. Here are the stories and milestones that define our journey.
        </p>

        {/* Dylan's Story */}
        <div className="mb-20">
          <h2 className="section-heading">Dylan's Story</h2>
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              When Dylan was first brought to Honeybee Ministries, he was a quiet child who had been largely excluded from community life due to his physical disability. His family, like many in rural Eastern Uganda, lacked the resources and knowledge to support his specific needs.
            </p>
            <p>
              Through our Special Needs Support program, Dylan began receiving regular physiotherapy and was enrolled in an inclusive learning environment. Over time, his confidence grew. He began participating in group activities, forming friendships, and expressing himself through art and storytelling.
            </p>
            <p>
              Today, Dylan is one of the most spirited members of his community group. His mother has become an advocate for disability inclusion in her village, and his story continues to inspire families across the region. Dylan's journey is a testament to what becomes possible when a child is met with care, dignity, and opportunity.
            </p>
          </div>
        </div>

        {/* Campfire */}
        <div className="mb-20">
          <h2 className="section-heading">Campfire: No Longer a Slave to Fear</h2>
          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              Our Campfire gatherings bring together youth and community members for evenings of worship, testimony, and healing. Named after the warmth and light of a campfire, these gatherings create a safe space for people to share their struggles and find encouragement.
            </p>
            <p>
              One recurring theme has been freedom from fear — fear of the future, fear born of trauma, and fear of being forgotten. Through prayer, counseling, and community support, participants have found renewed hope and strength. Many have described the experience as transformative, marking a turning point in their emotional and spiritual lives.
            </p>
            <p>
              The Campfire program has become one of our most requested community events, with attendance growing steadily each quarter.
            </p>
          </div>
        </div>

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
                <div className="text-3xl md:text-4xl font-serif font-bold text-forest mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision 2025-2030 Milestones */}
        <div>
          <h2 className="section-heading">Vision 2025–2030 Milestones</h2>
          <div className="space-y-4 mt-8">
            {milestones.map((m) => (
              <div key={m.year} className="flex items-start gap-4 py-3 border-b border-border last:border-0">
                <span className="font-serif font-bold text-primary text-lg min-w-[60px]">
                  {m.year}
                </span>
                <span className="text-muted-foreground leading-relaxed">{m.goal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="btn-hero btn-hero-primary"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Impact;
