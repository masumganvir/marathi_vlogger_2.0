import { useEffect, useState } from "react";

const Loader = () => {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 2200);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-obsidian flex items-center justify-center transition-all duration-[1200ms] ${
        phase === "reveal" ? "opacity-0 scale-105 blur-sm pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-breathe" />
      </div>

      <div className="text-center relative z-10 animate-scale-in">
        {/* Spinning ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border-t border-r border-primary/60 animate-[spin-slow_8s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-gold rounded-sm flex items-center justify-center shadow-gold animate-pulse-gold"
              style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
            >
              <span className="font-display font-black text-obsidian text-4xl leading-none">M</span>
            </div>
          </div>
        </div>

        {/* Brand text */}
        <div className="overflow-hidden mb-2">
          <div className="font-display font-black text-4xl sm:text-5xl tracking-[0.15em] text-gradient-gold animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            MARATHIVLOGGER
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="text-[11px] tracking-luxury text-primary font-semibold animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            CINEMATIC STUDIO · GONDIA · MAHARASHTRA
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 mx-auto w-48 h-[2px] bg-border/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-gold rounded-full animate-loader-fill" />
        </div>

        <div className="mt-4 text-[9px] tracking-luxury text-muted-foreground animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          LOADING CINEMATIC EXPERIENCE
        </div>
      </div>
    </div>
  );
};

export default Loader;
