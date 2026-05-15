import { useEffect, useState, useRef } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles, PenLine } from "lucide-react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";

// Rich seeded reviews that show immediately — replaced/merged by Firebase when available
const seedTestimonials = [
  {
    id: "seed-1",
    review:
      "Watching our wedding film for the first time, I cried — not because it was sad, but because it felt like I was living that day all over again. He didn't film our wedding. He preserved it.",
    name: "Riya & Arnav Sharma",
    location: "Wedding · Udaipur",
    service: "Wedding Cinematography",
    rating: 5,
  },
  {
    id: "seed-2",
    review:
      "We've worked with three production houses for our brand campaigns. None matched the cinematic depth and emotional pull delivered here. Our engagement tripled overnight.",
    name: "Naina Kapoor",
    location: "CMO · House of Lumière",
    service: "Commercial / Brand Film",
    rating: 5,
  },
  {
    id: "seed-3",
    review:
      "He shot a single reel for our restaurant launch. It hit 2 million views in five days and booked us out for the next quarter. Worth every rupee — and then some.",
    name: "Aakash Verma",
    location: "Founder · Sufiyan Kitchens, Nagpur",
    service: "Social Media Reels",
    rating: 5,
  },
  {
    id: "seed-4",
    review:
      "The pre-wedding film felt like a Wong Kar-wai short. Friends still send screenshots months later. Pure art — every frame was intentional, every emotion captured perfectly.",
    name: "Meera & Karan Iyer",
    location: "Pre-Wedding · Goa",
    service: "Pre-Wedding Film",
    rating: 5,
  },
  {
    id: "seed-5",
    review:
      "From the first call to the final delivery, the entire experience was world-class. The team understood our vision immediately and delivered something that exceeded every expectation.",
    name: "Priya & Rohan Desai",
    location: "Destination Wedding · Jaipur",
    service: "Wedding Cinematography",
    rating: 5,
  },
  {
    id: "seed-6",
    review:
      "Our corporate event highlight reel is being used in every investor pitch now. The production quality speaks for itself. Absolutely phenomenal work.",
    name: "Siddharth Kulkarni",
    location: "CEO · NovaTech Solutions, Pune",
    service: "Corporate Event",
    rating: 5,
  },
];

interface Testimonial {
  id: string;
  review: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  imageUrl?: string;
}

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex justify-center gap-1.5 mb-8">
    {[...Array(5)].map((_, k) => (
      <Star
        key={k}
        className={`w-5 h-5 transition-all duration-300 ${
          k < rating
            ? "fill-primary text-primary drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
            : "text-zinc-700"
        }`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(seedTestimonials);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch live Firebase reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("approved", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const live: Testimonial[] = snap.docs.map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              review: d.review,
              name: d.name,
              location: d.location || d.service || "",
              service: d.service || "",
              rating: d.rating || 5,
              imageUrl: d.imageUrl || "",
            };
          });
          setTestimonials([...live, ...seedTestimonials]);
        }
      } catch {
        // Silently use seed data if Firebase is not yet configured
      }
    };
    fetchReviews();
  }, []);

  const goTo = (idx: number, dir: "left" | "right" = "right") => {
    if (isTransitioning) return;
    setDirection(dir);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((idx + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 350);
  };

  const next = () => goTo(current + 1, "right");
  const prev = () => goTo(current - 1, "left");

  // Auto-advance every 6s
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection("right");
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((p) => (p + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 350);
    }, 6000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  const handleManualNav = (action: () => void) => {
    action();
    startInterval(); // Reset timer on manual nav
  };

  const t = testimonials[current];
  const liveCount = testimonials.length - seedTestimonials.length;

  return (
    <section id="testimonials" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-background to-charcoal/60" />
      <div className="absolute inset-0 bg-gradient-radial opacity-35 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 gold-line" />
            <span className="section-label">Words From Clients</span>
            <div className="w-16 gold-line" />
          </div>
          <h2 className="font-display text-section">
            Trusted by couples,
            <br />
            <span className="italic text-gradient-gold">brands, and dreamers.</span>
          </h2>

          {/* Live review count badge */}
          {liveCount > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] tracking-luxury text-green-500 font-medium">
                {liveCount} verified client review{liveCount > 1 ? "s" : ""} · Live
              </span>
            </div>
          )}

          {/* Add Review CTA */}
          <Link
            to="/review"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-primary/30 rounded-full text-[11px] uppercase tracking-luxury text-primary hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 group"
          >
            <PenLine className="w-3.5 h-3.5" />
            Share Your Experience
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
          </Link>
        </div>

        {/* Card */}
        <div className="relative glass-premium p-10 sm:p-16 lg:p-24 min-h-[520px] flex flex-col justify-center rounded-sm overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

          {/* Quote icons */}
          <Quote className="absolute top-8 left-8 w-20 h-20 text-primary/10" strokeWidth={0.8} />
          <Quote
            className="absolute bottom-8 right-8 w-20 h-20 text-primary/10 rotate-180"
            strokeWidth={0.8}
          />

          {/* Animated content */}
          <div
            className="transition-all duration-350"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning
                ? `translateX(${direction === "right" ? "-30px" : "30px"})`
                : "translateX(0)",
              transitionDuration: "350ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="flex flex-col items-center">
              {/* User Image */}
              <div className="mb-8 relative">
                <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1 bg-charcoal/50">
                  {t.imageUrl ? (
                    <img 
                      src={t.imageUrl} 
                      alt={t.name} 
                      className="w-full h-full rounded-full object-cover shadow-elegant"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-gold flex items-center justify-center">
                      <span className="font-display font-bold text-obsidian text-xl">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-charcoal shadow-gold">
                  <Star className="w-3 h-3 fill-obsidian text-obsidian" />
                </div>
              </div>

              <StarRow rating={t.rating} />

              <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-center leading-snug italic text-foreground/95 mb-10 max-w-3xl mx-auto">
                "{t.review}"
              </p>

              <div className="text-center space-y-2">
                <div className="text-lg font-semibold tracking-wide flex items-center justify-center gap-2">
                  {t.name}
                  {t.id.startsWith("seed-") === false && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-[8px] text-green-400 uppercase font-bold">
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-[11px] tracking-luxury text-primary font-medium">
                  {t.location || t.service}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] uppercase tracking-luxury text-primary/80">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t.service}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-14">
            <button
              onClick={() => handleManualNav(prev)}
              className="w-14 h-14 rounded-full border-[1.5px] border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-btn transition-all duration-500 group"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2.5 flex-wrap justify-center max-w-xs">
              {testimonials.map((_, k) => (
                <button
                  key={k}
                  onClick={() => handleManualNav(() => goTo(k, k > current ? "right" : "left"))}
                  className={`rounded-full transition-all duration-500 ${
                    k === current
                      ? "w-10 h-2.5 bg-gradient-gold-subtle shadow-btn"
                      : "w-2.5 h-2.5 bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to review ${k + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleManualNav(next)}
              className="w-14 h-14 rounded-full border-[1.5px] border-primary/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-btn transition-all duration-500 group"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Review counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-luxury text-muted-foreground/40 font-medium tabular-nums">
            {current + 1} / {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
