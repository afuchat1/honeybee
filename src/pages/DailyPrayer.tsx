import { BookOpen } from "lucide-react";

const DailyPrayer = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <div className="text-center mb-12">
          <BookOpen className="w-10 h-10 mx-auto mb-4 text-primary" strokeWidth={1.5} />
          <h1 className="page-title mb-2">Daily Prayer</h1>
          <p className="text-muted-foreground">
            A moment of reflection, scripture, and prayer for our community.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">
          {/* Scripture */}
          <div>
            <h2 className="section-heading text-center">Today's Scripture</h2>
            <blockquote className="text-center text-lg md:text-xl text-foreground leading-relaxed italic border-l-4 border-primary pl-6 ml-0 md:border-l-0 md:pl-0 md:border-y md:border-border md:py-6">
              "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
            </blockquote>
            <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
              — Jeremiah 29:11 (NIV)
            </p>
          </div>

          {/* Reflection */}
          <div>
            <h2 className="section-heading text-center">Reflection</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                God's plans for us are rooted in love, even when our circumstances seem uncertain. Just as the honeybee works faithfully within the hive, trusting in the greater design, we are called to trust in the Lord's provision and purpose for our lives.
              </p>
              <p>
                Today, let us remember the children and communities we serve — those who face challenges that feel insurmountable. May we be instruments of hope, carrying God's promise into the darkest places.
              </p>
            </div>
          </div>

          {/* Prayer */}
          <div>
            <h2 className="section-heading text-center">Prayer</h2>
            <div className="text-muted-foreground leading-relaxed italic">
              <p>
                Heavenly Father, we thank You for Your faithfulness and for the work You are doing through Honeybee Ministries. We lift up the children in our care — may they know Your love and feel Your presence. Strengthen our team, guide our leaders, and provide for every need. Lord, use us to build a hive of hope that reflects Your glory. In Jesus' name, Amen.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>This devotional is updated regularly by our ministry team.</p>
        </div>
      </div>
    </section>
  );
};

export default DailyPrayer;
