import { Check, ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  suffix: string;
  features: string[];
  featured: boolean;
  accentColor?: string;
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
    accentColor: "#D4AF37",
  },
  {
    name: "Mini Shoots",
    tagline: "Customized for various small shoots",
    price: "Variable",
    suffix: "based on requirements",
    features: [
      "Pre-weddings & small events",
      "Portraits & portfolio shoots",
      "Flexible coverage hours",
      "Budget-friendly custom pricing",
      "Tailored photo & video delivery",
      "Quick turnaround options",
    ],
    featured: false,
    accentColor: "#E8B4B8",
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
    accentColor: "#C0C0C0",
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
    accentColor: "#D4AF37",
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
    accentColor: "#E5E4E2",
  },
];

const Packages = () => {
  return (
    <section id="packages" className="relative py-36 lg:py-48 overflow-hidden bg-black">
      {/* Ambient glow backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-black">Luxury Investment</span>
            <div className="w-12 h-px bg-primary/40" />
          </div>
          <h2 className="font-display text-5xl md:text-7xl mb-8 leading-[1] tracking-tighter">
            Curated packages for<br />
            <span className="italic text-gradient-gold">every cinematic story.</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Every brief is unique. Use these as a starting point — <span className="text-white">bespoke quotes</span> available on request for global destinations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch justify-center">
          {tiers.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative flex flex-col p-10 lg:p-12 transition-all duration-500 rounded-[3.5rem] overflow-hidden h-full text-center ${
                t.featured
                  ? "bg-zinc-900/60 border-2 border-primary shadow-[0_30px_100px_-20px_rgba(212,175,55,0.25)] ring-1 ring-primary/30"
                  : "bg-zinc-900/30 border border-white/10 hover:border-white/20 hover:bg-zinc-900/40 shadow-2xl"
              }`}
            >
              {/* Card top gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
              
              {/* Featured Badge */}
              {t.featured && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-black text-[9px] font-black tracking-[0.2em] uppercase shadow-glow-sm"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Most Popular
                  </motion.div>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full pt-6">
                <div className="mb-10">
                  <div className="text-[10px] tracking-[0.4em] text-primary uppercase font-black mb-4">{t.tagline}</div>
                  <h3 className="font-display text-4xl lg:text-5xl font-black mb-12 tracking-tighter leading-none">{t.name}</h3>
                  
                  <div className="flex flex-col items-center justify-center min-h-[160px] mb-10 border-y border-white/10 py-10 bg-white/[0.02] rounded-3xl">
                    {t.originalPrice && (
                      <span className="text-xl text-zinc-600 line-through decoration-primary/60 mb-3 font-bold">{t.originalPrice}</span>
                    )}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`font-display text-gradient-gold font-black tracking-tighter leading-none drop-shadow-2xl ${t.price.length > 8 ? 'text-5xl xl:text-6xl' : 'text-6xl xl:text-7xl'}`}
                    >
                      {t.price}
                    </motion.div>
                    <div className="flex items-center gap-3 mt-6">
                      <div className="h-px w-4 bg-primary/30" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-black">{t.suffix}</span>
                      <div className="h-px w-4 bg-primary/30" />
                    </div>
                  </div>
                </div>

                <ul className="space-y-6 mb-16 flex-grow">
                  {t.features.map((f) => (
                    <li key={f} className="flex flex-col items-center gap-2 text-[14px] text-zinc-400 leading-relaxed group">
                      <Check className="w-4 h-4 mb-1" style={{ color: t.accentColor }} strokeWidth={4} />
                      <span className="group-hover:text-white transition-colors duration-300 font-medium px-4">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    to="/booking"
                    className={`group/btn relative flex flex-col items-center justify-center w-full py-6 rounded-[2.5rem] text-[12px] uppercase tracking-[0.3em] font-black transition-all duration-500 overflow-hidden shadow-2xl ${
                      t.featured
                        ? "bg-primary text-black hover:scale-[1.05]"
                        : "bg-white text-black hover:scale-[1.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <span>Reserve Your Date</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1.5" />
                    </div>
                    
                    {/* Glossy sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 p-16 rounded-[4rem] bg-zinc-900/40 border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <h4 className="font-display text-4xl font-black text-white mb-6 tracking-tight">Need a custom production?</h4>
            <p className="text-zinc-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              We specialize in complex, multi-day destination cinematic productions worldwide.
            </p>
            <Link 
              to="/booking"
              className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-black hover:bg-white transition-all duration-500 rounded-full text-[13px] font-black uppercase tracking-widest group shadow-glow"
            >
              Request Bespoke Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Packages;
