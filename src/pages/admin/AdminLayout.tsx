import { useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  BookOpenCheck,
  MessageSquare,
  Image,
  Shield,
  Users,
  Settings,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ImageIcon,
  FileText,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Programs", path: "/admin/programs", icon: BookOpen },
  { name: "Daily Prayer", path: "/admin/prayers", icon: BookOpenCheck },
  { name: "Impact Stories", path: "/admin/impact", icon: Heart },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Gallery", path: "/admin/gallery", icon: Image },
  { name: "Site Images", path: "/admin/site-images", icon: ImageIcon },
  { name: "Vision Docs", path: "/admin/vision-docs", icon: FileText },
  { name: "Governance", path: "/admin/governance", icon: Shield },
  { name: "Users & Roles", path: "/admin/users", icon: Users },
  { name: "Settings", path: "/admin/settings", icon: Settings },
  { name: "Activity Logs", path: "/admin/logs", icon: ClipboardList },
];

const AdminLayout = () => {
  const { user, loading, userRole, signOut } = useAuth();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!userRole || !["admin", "editor", "viewer"].includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-xl font-serif font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
          <button onClick={signOut} className="text-forest font-medium hover:underline">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-background border-r border-border flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
          <Link to="/admin" className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <span>🐝</span> Admin
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-0.5 ${
                  active
                    ? "bg-accent text-forest font-semibold"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2 px-3 truncate">
            {user.email}
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full rounded-md hover:bg-accent/50"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background border-b border-border h-14 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 mr-2 text-foreground"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {menuItems.find((m) => isActive(m.path))?.name || "Dashboard"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-md font-medium capitalize">
              {userRole}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
