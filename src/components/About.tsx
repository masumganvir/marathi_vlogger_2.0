import portrait from "@/assets/about-portrait.jpg";
import { Award, Film, Heart, ArrowRight } from "lucide-react";

const badges = [
  { icon: Award, label: "Award Winning", num: "12+" },
  { icon: Film, label: "Years Crafting", num: "8+" },
  { icon: Heart, label: "Weddings Filmed", num: "100+" },
];

const About = () => {
  return (
    <section id="about" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-radial opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 items-center">
          {/* Image side */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm group">
              <img
                src={portrait}
                alt="Portrait of the cinematographer"
                loading="lazy"
                className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-cinematic"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-primary/15 rounded-sm" />
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
            </div>
            {/* Decorative frame corners */}
            <div className="absolute -top-5 -left-5 w-28 h-28 border-l-2 border-t-2 border-primary/50 rounded-tl-sm" />
            <div className="absolute -bottom-5 -right-5 w-28 h-28 border-r-2 border-b-2 border-primary/50 rounded-br-sm" />

            {/* Floating signature card */}
            <div className="absolute -bottom-8 left-6 lg:-right-10 lg:left-auto glass-premium p-6 max-w-[280px] hover-lift">
              <div className="font-display italic text-3xl text-gradient-gold mb-1">MarathiVlogger</div>
              <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">STUDIO · GONDIA · MH</div>
            </div>
          </div>

          {/* Text side */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 gold-line" />
              <span className="section-label">The Storyteller</span>
            </div>

            <h2 className="font-display text-section leading-[1.05] mb-10">
              Born in Gondia.
              <span className="italic text-gradient-gold"> Filming the world. </span>
              One frame at a time.
            </h2>

            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed mb-12 max-w-2xl">
              <p>
                MarathiVlogger Studio was born in the heart of Gondia, Maharashtra —
                from a love for stories, soil, and cinema. What started as a single
                lens in a small town has grown into a studio trusted by couples,
                creators and brands across India.
              </p>
              <p>
                We believe a wedding film should feel like a memory you didn't know
                you had. A reel should stop the scroll. A brand story should make
                people feel something. Every project is treated like the most
                important story of someone's life — because it is.
              </p>
            </div>

            {/* Badge stats */}
            <div className="flex flex-wrap gap-5 mb-10">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-4 glass-premium px-6 py-4 hover-lift group cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-gradient-gold leading-none">{b.num}</div>
                    <div className="text-[10px] uppercase tracking-luxury text-muted-foreground mt-0.5">{b.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="#services" className="btn-ghost group inline-flex">
              Explore Services
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
