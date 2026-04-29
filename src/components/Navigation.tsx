import { useEffect, useState } from "react";
import MenuToggle from "./MenuToggle";
import { ArrowRight } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#packages", label: "Packages" },
  { href: "#contact", label: "Contact" },
];

interface NavigationProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

const Navigation = ({ menuOpen, onToggleMenu }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-cinematic ${
        scrolled
          ? "py-3 glass-strong shadow-elegant"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between gap-4">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <MenuToggle open={menuOpen} onToggle={onToggleMenu} />

          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform duration-500 rounded-sm"
              style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
            >
              <span className="font-display font-black text-obsidian text-2xl sm:text-3xl leading-none">M</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-glow rounded-full animate-pulse-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-xl sm:text-2xl tracking-wide text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                MarathiVlogger
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-luxury text-primary font-semibold">
                STUDIO · GONDIA · MH
              </div>
            </div>
          </a>
        </div>

        {/* Center nav links */}
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.28em] text-foreground/70 hover:text-primary transition-colors relative group font-medium"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-gold-subtle group-hover:w-full transition-all duration-500 rounded-full" />
            </a>
          ))}
        </nav>

        {/* CTA button */}
        <button
          data-tally-open="9q6YJQ"
          data-tally-layout="modal"
          data-tally-width="700"
          className="hidden md:inline-flex items-center gap-2.5 text-[11px] uppercase tracking-luxury font-semibold border-[1.5px] border-primary/50 px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground hover:shadow-btn hover:border-primary transition-all duration-500 group cursor-pointer"
        >
          Book a Shoot
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
        </button>
      </div>
    </header>
  );
};

export default Navigation;
