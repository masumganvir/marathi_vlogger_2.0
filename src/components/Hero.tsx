import heroImg from "@/assets/hero-cinematic.jpg";
import { ArrowDown, ArrowRight, Play, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ADMIN_EMAILS = [
  "marathivloggerstudio@gmail.com"
];

const Hero = () => {
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress || "");

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center grain">
      {/* ... previous content ... */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Cinematic wedding moment at golden hour"
          className="w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-obsidian/40" />
      </div>

      {/* Ambient gold glow orbs */}
      <div className="absolute top-1/4 right-1/3 w-[700px] h-[700px] bg-gradient-radial pointer-events-none opacity-80" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none animate-breathe" />

      {/* Side rail — left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-10">
        <div className="gold-line-vertical h-28" />
        <div className="text-[10px] tracking-luxury text-primary font-medium [writing-mode:vertical-rl] rotate-180">
          GONDIA · MAHARASHTRA
        </div>
        <div className="gold-line-vertical h-28" />
      </div>

      {/* Side rail — right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-10">
        <div className="gold-line-vertical h-24" />
        <div className="text-[10px] tracking-luxury text-foreground/60 [writing-mode:vertical-rl]">
          SCROLL · TO · DISCOVER
        </div>
        <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
      </div>

      {/* Main content */}
      <div className="container relative z-10 pt-36 pb-24">
        <div className="max-w-5xl">
          {/* Studio tag */}
          <div className="flex items-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="w-16 gold-line" />
            <span className="section-label">MarathiVlogger Studio · Est. Gondia</span>
          </div>

          {/* Hero headline — MASSIVE and bold */}
          <h1
            className="font-display font-black text-hero leading-[0.92] mb-10 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            Where Every
            <br />
            <span className="italic text-gradient-gold">Frame</span>
            <br />
            Tells a
            <br />
            <span className="italic">Marathi Story.</span>
          </h1>

          {/* Subtext */}
          <p
            className="max-w-xl text-lg sm:text-xl text-foreground/85 leading-relaxed mb-14 animate-fade-up font-light"
            style={{ animationDelay: "0.8s" }}
          >
            From the soil of Gondia to screens across the world — cinematic
            weddings, soulful reels, fashion films & brand stories crafted with
            the heart of a poet and the eye of a filmmaker.
          </p>

          {/* CTA Buttons — Premium, bold, irresistible */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-fade-up" style={{ animationDelay: "1s" }}>
            <Link 
              to="/booking"
              className="btn-premium group cursor-pointer inline-flex"
            >
              Book Your Story
              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>

            <a 
              href="https://www.instagram.com/marathi_vloggerr_2?igsh=Z21haXV2ODFtbHF4" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost group"
            >
              <span className="w-11 h-11 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary transition-all duration-500">
                <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
              </span>
              Watch Showreel
            </a>

            <Link 
              to="/introduction"
              className="btn-ghost group"
            >
              <span className="w-11 h-11 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary transition-all duration-500">
                <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
              </span>
              Detailed Intro
            </Link>

            {isAdmin && (
              <Link 
                to="/admin"
                className="btn-ghost group border-red-500/20 hover:border-red-500/50"
              >
                <span className="w-11 h-11 rounded-full border border-red-500/40 flex items-center justify-center group-hover:bg-red-500/15 group-hover:border-red-500 transition-all duration-500">
                  <Shield className="w-4 h-4 text-red-500" />
                </span>
                Admin Console
              </Link>
            )}
          </div>
        </div>

        {/* Bottom marquee strip */}
        <div className="absolute bottom-6 left-0 right-0 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 pr-16">
                {["Weddings", "Fashion", "Music Videos", "Drone Cinematography", "Reels", "Commercials", "Documentary"].map((t) => (
                  <span key={t} className="font-display italic text-3xl sm:text-4xl text-primary/30 flex items-center gap-16">
                    {t}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
