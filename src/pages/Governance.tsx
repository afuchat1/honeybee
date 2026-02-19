import { Shield, FileText, Users, Building } from "lucide-react";

const committeeRoles = [
  { title: "Chairperson", desc: "Provides strategic oversight and chairs board meetings" },
  { title: "Vice Chairperson", desc: "Supports the chairperson and leads in their absence" },
  { title: "Secretary", desc: "Manages records, minutes, and organizational correspondence" },
  { title: "Treasurer", desc: "Oversees financial management, auditing, and reporting" },
  { title: "Programs Director", desc: "Leads program design, implementation, and evaluation" },
  { title: "Community Representative", desc: "Serves as the voice of beneficiary communities" },
];

const Governance = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <h1 className="page-title">Governance</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-16">
          Honeybee Ministries is committed to the highest standards of organizational governance, transparency, and accountability. We operate under a clear governance framework to ensure responsible stewardship of resources and trust.
        </p>

        <div className="space-y-16">
          {/* Governance Structure */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h2 className="section-heading mb-0">Governance Structure</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Honeybee Ministries operates as a registered community-based organization in Uganda. The organization is governed by a Constitution that defines our mandate, structure, and operational guidelines. An Executive Committee provides oversight, while day-to-day operations are managed by a dedicated team of staff and volunteers.
            </p>
          </div>

          {/* Executive Committee */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h2 className="section-heading mb-0">Executive Committee</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The Executive Committee meets quarterly to review organizational performance, approve budgets, and set strategic priorities. Members serve on a voluntary basis and are selected for their expertise and commitment to our mission.
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

          {/* Accountability & Finance */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h2 className="section-heading mb-0">Accountability & Finance</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Financial integrity is a cornerstone of our operations. All funds are managed through a designated organizational bank account with dual-signatory controls. We maintain detailed records of all income and expenditure, and our accounts are subject to annual external audit.
              </p>
              <p>
                Donors and partners receive regular financial reports and impact updates. We are committed to ensuring that every shilling entrusted to us is used effectively and transparently for the benefit of those we serve.
              </p>
            </div>
          </div>

          {/* Registration */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-forest" strokeWidth={1.5} />
              <h2 className="section-heading mb-0">Registration & Compliance</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Honeybee Ministries is registered as a Community-Based Organization (CBO) under the laws of Uganda. We comply with all applicable regulations governing non-governmental organizations, including regular reporting to the relevant district authorities.
              </p>
              <p>
                Our constitution, registration certificate, and compliance documentation are available upon request for verification by donors, partners, and regulatory bodies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Governance;
