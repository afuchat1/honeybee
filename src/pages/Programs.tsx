import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Special Needs Outreach",
    description:
      "Our Special Needs program provides holistic care for children living with disabilities in Eastern Uganda. We offer therapeutic services, inclusive education support, and family counseling to ensure every child can participate fully in community life.",
    goals: [
      "Provide accessible therapy and rehabilitation services",
      "Train caregivers and families in inclusive practices",
      "Advocate for disability rights and inclusion in schools",
    ],
  },
  {
    title: "Youth Mentorship & Guidance",
    description:
      "The Rising Star Mentorship Academy pairs vulnerable youth with trained mentors who provide guidance in education, life skills, spiritual growth, and career planning. Our structured program helps young people build confidence and develop a vision for their future.",
    goals: [
      "Mentor 100+ youth annually through structured programs",
      "Develop leadership and communication skills",
      "Support academic achievement and career readiness",
    ],
  },
  {
    title: "Skills & Empowerment Training",
    description:
      "Our Skills Training Centre equips young adults and community members with practical vocational skills — from tailoring and carpentry to agriculture and digital literacy — enabling them to earn a sustainable livelihood.",
    goals: [
      "Offer certified training in 6+ vocational trades",
      "Provide startup kits for graduates to launch businesses",
      "Build partnerships with local employers for job placement",
    ],
  },
  {
    title: "Healing Circles & Campfire Events",
    description:
      "Through community outreach, we bring spiritual encouragement, trauma counseling, health education, and practical support to underserved villages. Our healing programs address the emotional and spiritual needs of communities affected by poverty, conflict, and loss.",
    goals: [
      "Conduct monthly outreach visits to remote communities",
      "Provide trauma-informed counseling and support groups",
      "Create safe spaces for worship, testimony, and restoration",
    ],
  },
];

const Programs = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Our Programs</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Each of our programs is designed to address specific needs within Eastern Uganda's most vulnerable communities. We work with local leaders, families, and volunteers to create lasting change.
        </p>

        <div className="space-y-16">
          {programs.map((program, index) => (
            <article key={program.title}>
              {index > 0 && <div className="mb-16 h-px bg-border/60" />}
              <h2 className="section-heading">{program.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {program.description}
              </p>
              <ul className="space-y-2">
                {program.goals.map((goal) => (
                  <li key={goal} className="flex items-start gap-3 text-muted-foreground text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/get-involved" className="btn-hero btn-hero-primary">
            Get Involved <ArrowRight size={16} className="ml-2 inline" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
