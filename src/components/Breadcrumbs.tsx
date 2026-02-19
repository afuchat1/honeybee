import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const pathLabels: Record<string, string> = {
  about: "About",
  "our-story": "Our Story",
  programs: "Programs",
  impact: "Impact",
  vision: "Vision 2025–2030",
  "daily-prayer": "Daily Prayer",
  governance: "Governance",
  gallery: "Gallery",
  "get-involved": "Get Involved",
  contact: "Contact",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/40">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home size={14} />
              <span>Home</span>
            </Link>
          </li>
          {segments.map((segment, index) => {
            const path = "/" + segments.slice(0, index + 1).join("/");
            const label = pathLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            const isLast = index === segments.length - 1;

            return (
              <li key={path} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="opacity-40" />
                {isLast ? (
                  <span className="text-foreground font-medium">{label}</span>
                ) : (
                  <Link to={path} className="hover:text-foreground transition-colors">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
