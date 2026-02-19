import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">🐝 Honeybee Ministries</h3>
            <p className="text-sm leading-relaxed opacity-85">
              A faith-based organization dedicated to empowering vulnerable children and communities in Eastern Uganda through compassion, mentorship, and skills development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "About Us", path: "/about" },
                { name: "Programs", path: "/programs" },
                { name: "Impact", path: "/impact" },
                { name: "Daily Prayer", path: "/daily-prayer" },
                { name: "Governance", path: "/governance" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="opacity-80 hover:opacity-100 transition-opacity">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 opacity-80" />
                <span className="opacity-85">Eastern Uganda</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 opacity-80" />
                <a href="mailto:info@honeybeeministries.org" className="opacity-85 hover:opacity-100">
                  info@honeybeeministries.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 opacity-80" />
                <span className="opacity-85">+256 XXX XXX XXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-forest-foreground/20 text-center text-sm opacity-70">
          © {new Date().getFullYear()} Honeybee Ministries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
