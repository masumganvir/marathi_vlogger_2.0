import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Shoots Delivered" },
  { value: 100, suffix: "+", label: "Weddings Filmed" },
  { value: 5, suffix: "M+", label: "Reel Views" },
  { value: 12, suffix: "", label: "International Awards" },
];

const useCount = (target: number, run: boolean) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const dur = 2200;
    const start = performance.now();
    let frame: number;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);
  return n;
};

const StatCard = ({ s, run, idx }: { s: Stat; run: boolean; idx: number }) => {
  const n = useCount(s.value, run);
  return (
    <div
      className="text-center group"
      style={{ animationDelay: `${idx * 0.1}s` }}
    >
      {/* Big number */}
      <div className="font-display text-7xl sm:text-8xl lg:text-9xl text-gradient-gold mb-3 leading-none font-black tracking-tight group-hover:scale-105 transition-transform duration-500">
        {n}
        <span className="text-5xl sm:text-6xl lg:text-7xl">{s.suffix}</span>
      </div>
      {/* Tiny gold line separator */}
      <div className="mx-auto w-12 h-[2px] bg-gradient-gold-subtle mb-4 rounded-full opacity-60" />
      <div className="text-xs tracking-luxury text-foreground/55 uppercase font-semibold">{s.label}</div>
    </div>
  );
};

const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setRun(true),
      { threshold: 0.25 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="relative py-28 lg:py-36 border-y border-border/50 overflow-hidden">
      {/* Ambient radial */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {stats.map((s, i) => (
            <StatCard key={s.label} s={s} run={run} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
