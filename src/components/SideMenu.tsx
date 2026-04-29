import { useEffect, useState } from "react";
import { Camera, Film, Home, Mail, Sparkles, Star, User, Award, Instagram, Youtube, Linkedin, ArrowRight } from "lucide-react";

const navItems = [
  { href: "#home", label: "Home", icon: Home, hint: "Cinematic intro" },
  { href: "#about", label: "About", icon: User, hint: "The artist behind the lens" },
  { href: "#services", label: "Services", icon: Camera, hint: "What we craft" },
  { href: "#portfolio", label: "Portfolio", icon: Film, hint: "Selected works" },
  { href: "#stats", label: "Milestones", icon: Award, hint: "Numbers that speak" },
  { href: "#testimonials", label: "Stories", icon: Star, hint: "Words from clients" },
  { href: "#packages", label: "Packages", icon: Sparkles, hint: "Investment tiers" },
  { href: "#contact", label: "Contact", icon: Mail, hint: "Begin your story" },
];

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu = ({ open, onClose }: SideMenuProps) => {
  const [activeHash, setActiveHash] = useState<string>("#home");

  // Auto-close on scroll
  useEffect(() => {
    if (!open) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 80) onClose();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Active section observer
  useEffect(() => {
    const sections = navItems
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as Element[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveHash(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[60] transition-all duration-700 ${
          open
            ? "bg-obsidian/85 backdrop-blur-xl opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed top-0 left-0 z-[70] h-full w-[88vw] max-w-[440px] bg-gradient-to-br from-charcoal via-obsidian to-charcoal border-r border-primary/15 shadow-elegant overflow-hidden transition-transform duration-700 ease-cinematic ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-primary-deep/15 blur-[100px]" />
        <div className="grain absolute inset-0 pointer-events-none" />

        <div className="relative h-full flex flex-col p-8">
          {/* Brand */}
          <div
            className={`flex items-center gap-3 mb-14 transition-all duration-700 ${
              open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
            style={{ transitionDelay: open ? "200ms" : "0ms" }}
          >
            <div className="w-13 h-13 bg-gradient-gold flex items-center justify-center shadow-gold rounded-sm"
              style={{ width: 48, height: 48, clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
            >
              <span className="font-display font-black text-obsidian text-2xl">M</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-2xl tracking-wide">MarathiVlogger</div>
              <div className="text-[10px] tracking-luxury text-primary font-semibold">STUDIO · GONDIA · MH</div>
            </div>
          </div>

          {/* Section label */}
          <div
            className={`mb-8 flex items-center gap-3 transition-all duration-700 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <span className="text-[10px] uppercase tracking-luxury text-primary font-semibold">Navigate</span>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-2">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeHash === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center gap-4 px-5 py-4 border border-transparent rounded-sm hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 ${
                    open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  } ${isActive ? "border-primary/30 bg-primary/10" : ""}`}
                  style={{ transitionDelay: open ? `${350 + i * 60}ms` : "0ms" }}
                >
                  {/* Active rail */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] bg-gradient-gold-subtle rounded-full transition-all duration-500 ${
                      isActive ? "h-8" : "h-0 group-hover:h-6"
                    }`}
                  />
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? "bg-primary/15 text-primary scale-105"
                      : "bg-transparent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-display text-xl tracking-wide transition-colors font-bold ${
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] uppercase tracking-luxury text-muted-foreground/60 mt-0.5 font-medium">
                      {item.hint}
                    </div>
                  </div>
                  <span className="text-xs text-primary/50 font-mono font-semibold">
                    0{i + 1}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* CTA */}
          <div
            className={`mt-8 transition-all duration-700 ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: open ? "900ms" : "0ms" }}
          >
            <a
              href="https://airtable.com/apppjRZM2gWjM9L4v/pagLWhrzAHx6eDnF0/form"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="btn-premium w-full flex items-center justify-center gap-3 group cursor-pointer inline-flex"
            >
              Book a Cinematic Shoot
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>

            {/* Socials */}
            <div className="flex items-center justify-center gap-4 mt-7">
              {[
                { icon: Instagram, href: "https://www.instagram.com/marathi_vloggerr_2?igsh=Z21haXV2ODFtbHF4", label: "Instagram" },
                { icon: Youtube, href: "https://youtube.com/@daily_vloger_gagan?si=N7ycjHKC6b9uaWUp", label: "YouTube" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/masum-ganvir-358b9b337", label: "LinkedIn" },
              ].map(({ icon: I, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-[1.5px] border-primary/25 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 hover:rotate-6 transition-all duration-500"
                  aria-label={label}
                >
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="text-center mt-6 text-[9px] tracking-luxury text-muted-foreground/50 font-medium">
              © {new Date().getFullYear()} MARATHIVLOGGER STUDIO · GONDIA
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
