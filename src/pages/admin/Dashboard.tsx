import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Heart, Image, MessageSquare, Eye } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [programs, stories, gallery, messages, unread] = await Promise.all([
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("impact_stories").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);

      setStats([
        { label: "Programs", value: programs.count || 0, icon: BookOpen },
        { label: "Impact Stories", value: stories.count || 0, icon: Heart },
        { label: "Gallery Items", value: gallery.count || 0, icon: Image },
        { label: "Messages", value: messages.count || 0, icon: MessageSquare },
        { label: "Unread Messages", value: unread.count || 0, icon: Eye },
      ]);

      const { data: msgs } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentMessages(msgs || []);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background p-4 rounded-lg border border-border">
            <stat.icon size={20} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">From</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Subject</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <span className={msg.is_read ? "text-muted-foreground" : "text-foreground font-medium"}>
                        {msg.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{msg.subject}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
