const programs = [
  {
    title: "Special Needs Support",
    description:
      "Our Special Needs Support program provides holistic care for children living with disabilities in Eastern Uganda. We offer therapeutic services, inclusive education support, and family counseling to ensure every child can participate fully in community life.",
    goals: [
      "Provide accessible therapy and rehabilitation services",
      "Train caregivers and families in inclusive practices",
      "Advocate for disability rights and inclusion in schools",
    ],
    outcomes: [
      "Over 50 children receiving ongoing therapeutic support",
      "Community awareness programs reaching 500+ families",
      "Partnerships with 10 local schools for inclusive education",
    ],
  },
  {
    title: "Rising Star Mentorship Academy",
    description:
      "The Rising Star Mentorship Academy pairs vulnerable youth with trained mentors who provide guidance in education, life skills, spiritual growth, and career planning. Our structured program helps young people build confidence and develop a vision for their future.",
    goals: [
      "Mentor 100+ youth annually through structured programs",
      "Develop leadership and communication skills",
      "Support academic achievement and career readiness",
    ],
    outcomes: [
      "85% of mentees showing improved academic performance",
      "Youth-led community projects in 5 districts",
      "Growing network of trained volunteer mentors",
    ],
  },
  {
    title: "Skills Training Centre",
    description:
      "Our Skills Training Centre equips young adults and community members with practical vocational skills — from tailoring and carpentry to agriculture and digital literacy — enabling them to earn a sustainable livelihood and contribute to their families and communities.",
    goals: [
      "Offer certified training in 6+ vocational trades",
      "Provide startup kits for graduates to launch businesses",
      "Build partnerships with local employers for job placement",
    ],
    outcomes: [
      "200+ graduates since inception",
      "70% of graduates employed or self-employed within 6 months",
      "Ongoing partnerships with local cooperatives and businesses",
    ],
  },
  {
    title: "Community Outreach & Healing Programs",
    description:
      "Through community outreach, we bring spiritual encouragement, trauma counseling, health education, and practical support to underserved villages across Eastern Uganda. Our healing programs address the emotional and spiritual needs of communities affected by poverty, conflict, and loss.",
    goals: [
      "Conduct monthly outreach visits to remote communities",
      "Provide trauma-informed counseling and support groups",
      "Distribute essential supplies and health resources",
    ],
    outcomes: [
      "Regular outreach to 15+ communities",
      "Support groups serving 200+ individuals",
      "Emergency relief provided during crisis situations",
    ],
  },
];

const Programs = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Our Programs</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Each of our programs is designed to address specific needs within Eastern Uganda's most vulnerable communities. We work with local leaders, families, and volunteers to create lasting, sustainable change.
        </p>

        <div className="space-y-20">
          {programs.map((program, index) => (
            <article key={program.title} className="relative">
              {index > 0 && (
                <div className="absolute -top-10 left-0 right-0 h-px bg-border" />
              )}
              <h2 className="section-heading">{program.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {program.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-sans font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">
                    Goals
                  </h3>
                  <ul className="space-y-2">
                    {program.goals.map((goal) => (
                      <li key={goal} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">
                    Outcomes
                  </h3>
                  <ul className="space-y-2">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
