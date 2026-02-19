import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const quickLinks = [
  { name: "About", path: "/about" },
  { name: "Our Story", path: "/our-story" },
  { name: "Programs", path: "/programs" },
  { name: "Vision 2025–2030", path: "/vision" },
  { name: "Gallery", path: "/gallery" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Contact", path: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Honeybee Ministries</h3>
            <p className="text-sm leading-relaxed opacity-85 mb-6">
              A faith-based organization dedicated to empowering vulnerable children and communities in Eastern Uganda.
            </p>
            <p className="text-xs opacity-60 italic leading-relaxed">
              "Together we build a hive of hope — one act of kindness at a time."
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="opacity-80 hover:opacity-100 transition-opacity">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 opacity-80" />
                <span className="opacity-85">Naminya Ward, Wakisi Division, Buikwe District, Uganda</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="flex-shrink-0 opacity-80" />
                <a href="mailto:honeybeeministriesug@gmail.com" className="opacity-85 hover:opacity-100">
                  honeybeeministriesug@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs font-medium opacity-70 mb-2">Follow us</p>
              <div className="flex gap-4 text-sm">
                <a href="https://instagram.com/honeybeeministriesug" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100">
                  Instagram
                </a>
                <a href="https://facebook.com/honeybeeministriesug" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-foreground/15 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Honeybee Ministries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
