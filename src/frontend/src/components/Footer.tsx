import { PenLine } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer className="border-t border-gold/20 bg-charcoal mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Links */}
          <div>
            <h4 className="font-display text-gold text-sm font-semibold mb-4 tracking-widest uppercase">
              Explore
            </h4>
            <ul className="space-y-2">
              {["About", "FAQ", "Terms", "Contact"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <span
                aria-label="Instagram"
                className="text-muted-foreground hover:text-gold transition-colors cursor-pointer"
              >
                <SiInstagram className="w-5 h-5" />
              </span>
              <span
                aria-label="X"
                className="text-muted-foreground hover:text-gold transition-colors cursor-pointer"
              >
                <SiX className="w-5 h-5" />
              </span>
              <span
                aria-label="Facebook"
                className="text-muted-foreground hover:text-gold transition-colors cursor-pointer"
              >
                <SiFacebook className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-3">
              <PenLine className="w-6 h-6 text-gold" />
            </div>
            <span className="font-display text-xl font-bold text-gold">
              Shero Shayari
            </span>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              A sanctuary of words — where hearts speak in verse.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-gold text-sm font-semibold mb-4 tracking-widest uppercase">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get the finest shayari in your inbox daily.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm bg-charcoal-card border border-gold/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: "#C8A35A", color: "#1B1F22" }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
