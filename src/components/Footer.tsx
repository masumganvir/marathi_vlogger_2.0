import { Instagram, Youtube, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-12 border-t border-border/50 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-radial opacity-20 pointer-events-none" />

      <div className="container relative">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-8">
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
            <p className="font-display italic text-3xl text-foreground/75 max-w-md leading-snug mb-3">
              "Where every frame tells a Marathi story."
            </p>
            <p className="text-sm text-muted-foreground font-medium">— MarathiVlogger Studio</p>
          </div>

          {/* Explore column */}
          <div className="md:col-span-3">
            <div className="text-[11px] tracking-luxury text-primary mb-6 font-semibold">EXPLORE</div>
            <ul className="space-y-4">
              {["About", "Services", "Portfolio", "Packages", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-[15px] text-foreground/65 hover:text-primary transition-colors flex items-center gap-2 group font-medium">
                    {l}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio column */}
          <div className="md:col-span-4">
            <div className="text-[11px] tracking-luxury text-primary mb-6 font-semibold">STUDIO</div>
            <p className="text-[15px] text-foreground/65 mb-3 font-medium">
              Gondia, Maharashtra · Available across India & worldwide
            </p>
            <p className="text-[15px] text-foreground/65 mb-3 font-medium">marathivloggerstudios@gmail.com</p>
            <p className="text-[15px] text-foreground/65 mb-3 font-medium">+91 82629 71842 · +91 93707 03933</p>

            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/marathi_vloggerr_2?igsh=Z21haXV2ODFtbHF4" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com/@daily_vloger_gagan?si=N7ycjHKC6b9uaWUp" },
                { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/masum-ganvir-358b9b337" },
                { icon: Mail, label: "Email", href: "mailto:marathivloggerstudios@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel={label !== "Email" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-12 h-12 border-[1.5px] border-border/60 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-btn flex items-center justify-center transition-all duration-500"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-line mb-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-luxury text-muted-foreground font-medium">
          <div>© {new Date().getFullYear()} MARATHIVLOGGER STUDIO · ALL RIGHTS RESERVED</div>
          <div>CRAFTED WITH OBSESSION · GONDIA, MAHARASHTRA</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
