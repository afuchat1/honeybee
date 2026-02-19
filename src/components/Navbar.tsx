import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Impact", path: "/impact" },
  { name: "Daily Prayer", path: "/daily-prayer" },
  { name: "Governance", path: "/governance" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-foreground tracking-tight">
          <span className="text-2xl">🐝</span>
          <span className="hidden sm:inline">Honeybee Ministries</span>
          <span className="sm:hidden">Honeybee</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.path
                    ? "text-forest font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <ul className="container mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.path
                      ? "text-forest font-semibold bg-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
