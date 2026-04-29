import {
  Camera, Heart, Plane, Sparkles, Music, ShoppingBag,
  Mic2, Film, Palette, Briefcase, Youtube, Users,
} from "lucide-react";

const services = [
  { icon: Heart, title: "Wedding Films", desc: "Cinematic storytelling of your most important day, edited like a feature film." },
  { icon: Sparkles, title: "Pre-Wedding Shoots", desc: "Romantic, location-driven films that capture the chemistry between you." },
  { icon: Users, title: "Event Coverage", desc: "Birthdays, anniversaries, corporate galas — captured with editorial elegance." },
  { icon: Plane, title: "Drone Cinematography", desc: "Sweeping aerial shots that elevate any story from grand to breathtaking." },
  { icon: Camera, title: "Reel Creation", desc: "Scroll-stopping social content engineered for virality and brand growth." },
  { icon: ShoppingBag, title: "Product Commercials", desc: "Premium product films that make luxury feel tactile and desirable." },
  { icon: Palette, title: "Fashion Shoots", desc: "Editorial fashion photography & films with a moody, cinematic edge." },
  { icon: Mic2, title: "Music Videos", desc: "Concept-driven music videos with bold direction and visual identity." },
  { icon: Film, title: "Video Editing", desc: "Color graded, sound designed edits with festival-grade craftsmanship." },
  { icon: Briefcase, title: "Brand Films", desc: "Documentary-style brand stories that build trust and emotional resonance." },
  { icon: Youtube, title: "YouTube Production", desc: "Full creator production — strategy, shoot, edit, thumbnail, the works." },
  { icon: Sparkles, title: "Motion Graphics", desc: "Title cards, lower thirds, and animated brand identity systems." },
];

const Services = () => {
  return (
    <section id="services" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Background blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-background to-charcoal/60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/4 blur-[140px] pointer-events-none" />

      <div className="container relative">
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 gold-line" />
            <span className="section-label">What We Create</span>
          </div>
          <h2 className="font-display text-section leading-[1.05] mb-8">
            A full visual studio,
            <br />
            <span className="italic text-gradient-gold">from concept to cut.</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-xl leading-relaxed">
            Twelve disciplines. One obsessive standard. Whatever the brief, the
            craft never bends.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative p-8 lg:p-9 border border-border/60 rounded-sm hover:border-primary/40 bg-card/30 hover:bg-card/60 transition-all duration-600 cursor-pointer hover-lift overflow-hidden"
            >
              {/* Top sweep line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-gold group-hover:w-full transition-all duration-700 rounded-full" />

              {/* Service number */}
              <div className="text-[10px] tracking-luxury text-primary/50 mb-6 font-mono font-semibold">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Icon container */}
              <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500">
                <s.icon className="w-7 h-7 text-primary" strokeWidth={1.4} />
              </div>

              <h3 className="font-display text-2xl lg:text-[1.65rem] mb-3 leading-tight group-hover:text-gradient-gold transition-colors duration-500">
                {s.title}
              </h3>
              <p className="text-sm text-foreground/55 leading-relaxed group-hover:text-foreground/75 transition-colors duration-500">
                {s.desc}
              </p>

              {/* Bottom glow on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-gold-subtle opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
