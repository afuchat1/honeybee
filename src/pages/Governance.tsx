import { useEffect, useState } from "react";
import { Shield, FileText, Users, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GovDoc {
  id: string;
  title: string;
  content: string;
  document_url: string | null;
  section: string;
  sort_order: number;
}

const sectionIcons: Record<string, React.ElementType> = {
  structure: Building,
  committee: Users,
  accountability: Shield,
  registration: FileText,
  general: FileText,
};

const committeeRoles = [
  { title: "Chairperson", desc: "Provides strategic oversight and chairs board meetings" },
  { title: "Vice Chairperson", desc: "Supports the chairperson and leads in their absence" },
  { title: "Secretary", desc: "Manages records, minutes, and organizational correspondence" },
  { title: "Treasurer", desc: "Oversees financial management, auditing, and reporting" },
  { title: "Programs Director", desc: "Leads program design, implementation, and evaluation" },
  { title: "Community Representative", desc: "Serves as the voice of beneficiary communities" },
];

const Governance = () => {
  const [docs, setDocs] = useState<GovDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase.from("governance_docs").select("*").order("sort_order");
      setDocs((data as GovDoc[]) || []);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  const hasDocs = docs.length > 0;

  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Governance</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Honeybee Ministries is committed to the highest standards of organizational governance, transparency, and accountability.
        </p>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : hasDocs ? (
          <div className="space-y-16">
            {docs.map((doc) => {
              const Icon = sectionIcons[doc.section] || FileText;
              return (
                <div key={doc.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-forest" strokeWidth={1.5} />
                    <h2 className="section-heading mb-0">{doc.title}</h2>
                  </div>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    {doc.content.split("\n").filter(Boolean).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {doc.document_url && (
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-forest hover:underline"
                    >
                      <FileText size={14} /> View Document
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback static content */
          <div className="space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-forest" strokeWidth={1.5} />
                <h2 className="section-heading mb-0">Governance Structure</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Honeybee Ministries operates as a registered community-based organization in Uganda. The organization is governed by a Constitution that defines our mandate, structure, and operational guidelines.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-forest" strokeWidth={1.5} />
                <h2 className="section-heading mb-0">Executive Committee</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The Executive Committee meets quarterly to review organizational performance, approve budgets, and set strategic priorities.
              </p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                {committeeRoles.map((role) => (
                  <div key={role.title} className="py-4 border-b border-border">
                    <h3 className="font-sans font-semibold text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{role.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-forest" strokeWidth={1.5} />
                <h2 className="section-heading mb-0">Accountability & Finance</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Financial integrity is a cornerstone of our operations. All funds are managed through a designated organizational bank account with dual-signatory controls.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-forest" strokeWidth={1.5} />
                <h2 className="section-heading mb-0">Registration & Compliance</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Honeybee Ministries is registered as a Community-Based Organization (CBO) under the laws of Uganda.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Governance;
