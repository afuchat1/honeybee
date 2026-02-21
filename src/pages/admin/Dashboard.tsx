import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Heart, Image, MessageSquare, Eye, FileText, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  link?: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [programs, stories, gallery, messages, unread, siteImages, visionDocs] = await Promise.all([
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("impact_stories").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("site_images").select("id", { count: "exact", head: true }),
        supabase.from("vision_documents").select("id", { count: "exact", head: true }),
      ]);

      setStats([
        { label: "Programs", value: programs.count || 0, icon: BookOpen, link: "/admin/programs" },
        { label: "Impact Stories", value: stories.count || 0, icon: Heart, link: "/admin/impact" },
        { label: "Gallery Items", value: gallery.count || 0, icon: Image, link: "/admin/gallery" },
        { label: "Site Images", value: siteImages.count || 0, icon: ImageIcon, link: "/admin/site-images" },
        { label: "Vision Docs", value: visionDocs.count || 0, icon: FileText, link: "/admin/vision-docs" },
        { label: "Messages", value: messages.count || 0, icon: MessageSquare, link: "/admin/messages" },
        { label: "Unread", value: unread.count || 0, icon: Eye, link: "/admin/messages" },
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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link || "/admin"} className="bg-background p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
            <stat.icon size={18} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Link>
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
