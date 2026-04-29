import { Check, ArrowRight, Crown } from "lucide-react";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  suffix: string;
  features: string[];
  featured: boolean;
};

const tiers: Tier[] = [
  {
    name: "Basic",
    tagline: "Short-form content for social & ads",
    price: "₹15,000",
    originalPrice: "₹25,000",
    suffix: "special offer",
    features: [
      "60s full coverage occasion reel",
      "Automated social video creation",
      "Product ads & showcasing reels",
      "Short animated video content",
      "Includes popular basic services",
      "Optimized for shorts & reels",
    ],
    featured: false,
  },
  {
    name: "Essence",
    tagline: "Intimate moments, beautifully filmed",
    price: "₹85,000",
    suffix: "starting at",
    features: [
      "6 hours of coverage",
      "1 cinematographer",
      "3-minute highlight film",
      "Color-graded edit",
      "60 edited photographs",
      "Online gallery",
    ],
    featured: false,
  },
  {
    name: "Signature",
    tagline: "Our most-loved wedding experience",
    price: "₹2,25,000",
    suffix: "starting at",
    features: [
      "Full day · 2 cinematographers",
      "Drone aerial coverage",
      "8-minute cinematic film",
      "60s social reel",
      "200 edited photographs",
      "Same-day teaser",
      "Premium archival USB",
    ],
    featured: true,
  },
  {
    name: "Heirloom",
    tagline: "A multi-day cinematic legacy",
    price: "On request",
    suffix: "bespoke quote",
    features: [
      "3-day destination coverage",
      "4-person crew",
      "Drone + gimbal + steadicam",
      "Feature-length documentary",
      "Multiple reels & teasers",
      "500+ edited photographs",
      "Hand-bound photo album",
      "Priority delivery",
    ],
    featured: false,
  },
];

const Packages = () => {
  return (
    <section id="packages" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/4 blur-[140px] pointer-events-none" />

      <div className="container relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 gold-line" />
            <span className="section-label">Investment</span>
            <div className="w-16 gold-line" />
          </div>
          <h2 className="font-display text-section mb-8">
            Curated packages for<br />
            <span className="italic text-gradient-gold">every kind of story.</span>
          </h2>
          <p className="text-foreground/55 text-lg leading-relaxed">
            Every brief is unique. Use these as a starting point — bespoke quotes
            available on request.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative p-10 lg:p-12 transition-all duration-600 group rounded-sm hover-lift overflow-hidden ${
                t.featured
                  ? "bg-gradient-to-b from-primary/12 via-primary/5 to-transparent border-[1.5px] border-primary/50 lg:-translate-y-6 shadow-glow"
                  : "border border-border/60 bg-card/20 hover:border-primary/30 hover:bg-card/40"
              }`}
            >
              {/* Shimmer on featured */}
              {t.featured && (
                <>
                  <div className="absolute inset-0 shimmer-gold pointer-events-none" />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-[10px] tracking-luxury px-5 py-2 rounded-full font-semibold shadow-btn flex items-center gap-2">
                    <Crown className="w-3 h-3" />
                    MOST CHOSEN
                  </div>
                </>
              )}

              <div className="text-[10px] tracking-luxury text-primary mb-3 font-medium">{t.tagline}</div>
              <h3 className="font-display text-4xl lg:text-5xl mb-8 font-bold">{t.name}</h3>

              <div className="mb-10 pb-10 border-b border-border/50">
                {t.originalPrice && (
                  <div className="text-lg lg:text-xl text-primary/60 line-through decoration-primary/40 decoration-[1.5px] font-medium mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{t.originalPrice}</div>
                )}
                <div className="font-display text-5xl lg:text-5xl xl:text-6xl text-gradient-gold mb-2 font-black">{t.price}</div>
                <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">{t.suffix}</div>
              </div>

              <ul className="space-y-5 mb-12">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] text-foreground/75 leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://airtable.com/apppjRZM2gWjM9L4v/pagLWhrzAHx6eDnF0/form"
                target="_blank"
                rel="noopener noreferrer"
                className={`group/btn flex items-center justify-center gap-3 w-full py-5 rounded-full text-[12px] uppercase tracking-luxury font-semibold transition-all duration-500 cursor-pointer inline-flex ${
                  t.featured
                    ? "bg-gradient-gold text-primary-foreground shadow-btn hover:shadow-btn-hover hover:scale-[1.02]"
                    : "border-[1.5px] border-primary/50 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-btn"
                }`}
              >
                Inquire Now
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center text-base text-foreground/55">
          Need something different?{" "}
          <a 
            href="https://airtable.com/apppjRZM2gWjM9L4v/pagLWhrzAHx6eDnF0/form"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline underline-offset-4 decoration-primary/40 cursor-pointer"
          >
            Request a custom quote
          </a>.
        </div>
      </div>
    </section>
  );
};

export default Packages;
