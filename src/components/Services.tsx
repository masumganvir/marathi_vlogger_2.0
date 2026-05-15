import { Link } from "react-router-dom";
import { SERVICES_DATA } from "@/data/services";
import { ArrowRight } from "lucide-react";

const Services = () => {
  return (
    <section id="services" className="relative py-36 lg:py-48 overflow-hidden">
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
            Twelve disciplines. One obsessive standard. Whatever the brief, the craft never bends.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {SERVICES_DATA.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.id}
                to={`/services/${s.slug}`}
                className="group relative p-8 lg:p-9 border border-border/60 rounded-sm hover:border-primary/40 bg-card/30 hover:bg-card/60 transition-all duration-600 hover-lift overflow-hidden block"
              >
                {/* Top sweep line */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-gold group-hover:w-full transition-all duration-700 rounded-full" />

                {/* Service number */}
                <div className="text-[10px] tracking-luxury text-primary/50 mb-6 font-mono font-semibold">
                  {s.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={1.4} />
                </div>

                <h3 className="font-display text-2xl lg:text-[1.65rem] mb-3 leading-tight group-hover:text-gradient-gold transition-colors duration-500">
                  {s.title}
                </h3>
                <p className="text-sm text-foreground/55 leading-relaxed group-hover:text-foreground/75 transition-colors duration-500 mb-4">
                  {s.desc}
                </p>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-luxury text-primary/0 group-hover:text-primary transition-all duration-500 font-bold">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-gold-subtle opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Unavailable overlay */}
                {!s.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-sm">
                    <span className="text-[10px] uppercase tracking-luxury text-zinc-500 font-bold border border-zinc-700 px-4 py-2 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* New YouTube Shorts Section */}
        <div className="mt-32 pt-32 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-primary/40" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-bold">Creations in Motion</span>
              </div>
              <h3 className="font-display text-4xl lg:text-5xl mb-6">
                Cinematic <span className="italic text-gradient-gold">Shorts.</span>
              </h3>
              <p className="text-foreground/50 text-lg">
                Crafting high-impact vertical narratives designed for the modern screen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "qEK4sw9yFNk",
              "fkTg3Fp7Y6U",
              "aDqgUuWaAkg",
              "3Kdu86ybDXE"
            ].map((id, index) => (
              <div 
                key={id} 
                className="group relative aspect-[9/16] bg-charcoal/40 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl"
              >
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autohide=1&controls=1`}
                  title={`YouTube Short ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Decorative overlay for luxury feel (slight vignette) */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

