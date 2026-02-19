const leadership = [
  { role: "Executive Director", desc: "Oversees all operations and strategic direction" },
  { role: "Programs Coordinator", desc: "Manages program implementation and monitoring" },
  { role: "Finance Officer", desc: "Handles budgeting, reporting, and compliance" },
  { role: "Community Liaison", desc: "Connects with local communities and stakeholders" },
];

const values = [
  "Faith — Rooted in Christian love and service",
  "Compassion — Meeting every person with dignity and care",
  "Integrity — Transparent and accountable in all we do",
  "Empowerment — Building capacity, not dependency",
  "Inclusion — Every child and every person matters",
  "Community — Working together for lasting change",
];

const About = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">About Us</h1>

        <div className="space-y-14">
          <div>
            <h2 className="section-heading">Our Background</h2>
            <p className="text-muted-foreground leading-relaxed">
              Honeybee Ministries was founded in Eastern Uganda with a heart for vulnerable children and underserved communities. What began as a small grassroots initiative has grown into a structured, faith-driven organization committed to holistic transformation through education, care, and empowerment. Our name reflects our belief that like honeybees, we thrive when we work together — each person contributing their unique gifts to build something greater than themselves.
            </p>
          </div>

          <div>
            <h2 className="section-heading">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              A community where every child, regardless of ability or background, has access to quality care, education, and the opportunity to reach their God-given potential.
            </p>
          </div>

          <div>
            <h2 className="section-heading">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To empower vulnerable children, youth, and communities in Eastern Uganda through faith-based programs that provide special needs support, mentorship, skills training, and spiritual development.
            </p>
          </div>

          <div>
            <h2 className="section-heading">Our Goal</h2>
            <p className="text-muted-foreground leading-relaxed">
              To create sustainable, community-driven systems that ensure long-term impact for the most vulnerable members of our society, fostering independence, dignity, and hope.
            </p>
          </div>

          <div>
            <h2 className="section-heading">Core Values</h2>
            <ul className="space-y-3 text-muted-foreground">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="section-heading">Leadership Structure</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Honeybee Ministries is governed by an Executive Committee and supported by dedicated program coordinators and volunteers. Our leadership team brings together experience in social work, education, ministry, and community development.
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
              {leadership.map((l) => (
                <div key={l.role} className="py-4 border-b border-border">
                  <h3 className="font-sans font-semibold text-foreground">{l.role}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
