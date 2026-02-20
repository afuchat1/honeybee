import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Program {
  id: string;
  title: string;
  description: string;
  goals: string[] | null;
  outcomes: string[] | null;
  image_url: string | null;
  sort_order: number;
}

const fallbackPrograms = [
  {
    id: "1",
    title: "Special Needs Outreach",
    description: "Our Special Needs program provides holistic care for children living with disabilities in Eastern Uganda. We offer therapeutic services, inclusive education support, and family counseling to ensure every child can participate fully in community life.",
    goals: ["Provide accessible therapy and rehabilitation services", "Train caregivers and families in inclusive practices", "Advocate for disability rights and inclusion in schools"],
    outcomes: null,
    image_url: null,
    sort_order: 0,
  },
  {
    id: "2",
    title: "Youth Mentorship & Guidance",
    description: "The Rising Star Mentorship Academy pairs vulnerable youth with trained mentors who provide guidance in education, life skills, spiritual growth, and career planning.",
    goals: ["Mentor 100+ youth annually through structured programs", "Develop leadership and communication skills", "Support academic achievement and career readiness"],
    outcomes: null,
    image_url: null,
    sort_order: 1,
  },
  {
    id: "3",
    title: "Skills & Empowerment Training",
    description: "Our Skills Training Centre equips young adults and community members with practical vocational skills — from tailoring and carpentry to agriculture and digital literacy.",
    goals: ["Offer certified training in 6+ vocational trades", "Provide startup kits for graduates to launch businesses", "Build partnerships with local employers for job placement"],
    outcomes: null,
    image_url: null,
    sort_order: 2,
  },
  {
    id: "4",
    title: "Healing Circles & Campfire Events",
    description: "Through community outreach, we bring spiritual encouragement, trauma counseling, health education, and practical support to underserved villages.",
    goals: ["Conduct monthly outreach visits to remote communities", "Provide trauma-informed counseling and support groups", "Create safe spaces for worship, testimony, and restoration"],
    outcomes: null,
    image_url: null,
    sort_order: 3,
  },
];

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data } = await supabase.from("programs").select("*").order("sort_order");
      if (data && data.length > 0) setPrograms(data as Program[]);
    };
    fetchPrograms();
  }, []);

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Our Programs</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Each of our programs is designed to address specific needs within Eastern Uganda's most vulnerable communities. We work with local leaders, families, and volunteers to create lasting change.
        </p>

        <div className="space-y-16">
          {programs.map((program, index) => (
            <article key={program.id}>
              {index > 0 && <div className="mb-16 h-px bg-border/60" />}
              <div className={`${program.image_url ? "md:flex md:gap-10 md:items-start" : ""}`}>
                {program.image_url && (
                  <img
                    src={program.image_url}
                    alt={program.title}
                    className="w-full md:w-72 h-48 object-cover rounded-xl mb-6 md:mb-0 flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div>
                  <h2 className="section-heading">{program.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{program.description}</p>
                  {program.goals && program.goals.length > 0 && (
                    <ul className="space-y-2">
                      {program.goals.map((goal) => (
                        <li key={goal} className="flex items-start gap-3 text-muted-foreground text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
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
