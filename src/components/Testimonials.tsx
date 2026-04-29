import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Watching our wedding film for the first time, I cried — not because it was sad, but because it felt like I was living that day all over again. He didn't film our wedding. He preserved it.",
    name: "Riya & Arnav Sharma",
    role: "Wedding · Udaipur",
  },
  {
    quote:
      "We've worked with three production houses for our brand campaigns. None matched the cinematic depth and emotional pull delivered. Our engagement tripled overnight.",
    name: "Naina Kapoor",
    role: "CMO · House of Lumière",
  },
  {
    quote:
      "He shot a single reel for our restaurant launch. It hit 2 million views in five days and booked us out for the next quarter. Worth every rupee — and then some.",
    name: "Aakash Verma",
    role: "Founder · Sufiyan Kitchens",
  },
  {
    quote:
      "The pre-wedding film felt like a Wong Kar-wai short. Friends still send screenshots months later. Pure art.",
    name: "Meera & Karan Iyer",
    role: "Pre-Wedding · Goa",
  },
];

const Testimonials = () => {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[i];

  return (
    <section id="testimonials" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-background to-charcoal/60" />
      <div className="absolute inset-0 bg-gradient-radial opacity-35 pointer-events-none" />

      <div className="container relative max-w-5xl">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 gold-line" />
            <span className="section-label">Words From Clients</span>
            <div className="w-16 gold-line" />
          </div>
          <h2 className="font-display text-section">
            Trusted by couples,<br />
            <span className="italic text-gradient-gold">brands, and dreamers.</span>
          </h2>
        </div>

        <div className="relative glass-premium p-10 sm:p-16 lg:p-24 min-h-[480px] flex flex-col justify-center rounded-sm">
          {/* Quote icon */}
          <Quote className="absolute top-8 left-8 w-20 h-20 text-primary/10" strokeWidth={0.8} />
          <Quote className="absolute bottom-8 right-8 w-20 h-20 text-primary/10 rotate-180" strokeWidth={0.8} />

          <div key={i} className="animate-fade-in">
            {/* Stars */}
            <div className="flex justify-center gap-1.5 mb-10">
              {[...Array(5)].map((_, k) => (
                <Star key={k} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>

            {/* Quote text */}
            <p className="font-display text-2xl sm:text-3xl lg:text-[2.5rem] text-center leading-snug italic text-foreground/95 mb-12 max-w-3xl mx-auto">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="text-center">
              <div className="text-lg font-semibold tracking-wide mb-1">{t.name}</div>
              <div className="text-[11px] tracking-luxury text-primary font-medium">{t.role}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-14">
            <button
              onClick={prev}
              className="w-14 h-14 rounded-full border-[1.5px] border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-btn transition-all duration-500 group"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </button>

            <div className="flex gap-3">
              {testimonials.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`rounded-full transition-all duration-500 ${
                    k === i
                      ? "w-10 h-2.5 bg-gradient-gold-subtle shadow-btn"
                      : "w-2.5 h-2.5 bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to ${k + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-14 h-14 rounded-full border-[1.5px] border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-btn transition-all duration-500 group"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
