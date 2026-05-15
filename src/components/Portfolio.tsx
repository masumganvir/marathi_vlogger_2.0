import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Loader2 } from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Fallback assets
import wedding from "@/assets/portfolio-wedding-1.jpg";
import preWedding from "@/assets/portfolio-prewedding-1.jpg";
import fashion from "@/assets/portfolio-fashion-1.jpg";
import drone from "@/assets/portfolio-drone-1.jpg";
import music from "@/assets/portfolio-music-1.jpg";
import event from "@/assets/portfolio-event-1.jpg";
import product from "@/assets/portfolio-product-1.jpg";
import reel from "@/assets/portfolio-reel-1.jpg";

type Item = {
  src: string;
  title: string;
  client: string;
  category: string;
  span?: string;
  type?: "image" | "video" | "youtube" | "instagram";
};

const exampleItems: Item[] = [
  { src: wedding, title: "An Eternal Vow", client: "Riya & Arnav · Udaipur", category: "Weddings", span: "row-span-2" },
  { src: drone, title: "Palace of Light", client: "Taj Falaknuma · Hyderabad", category: "Drone", span: "" },
  { src: fashion, title: "Obsidian", client: "Vogue Editorial", category: "Fashion", span: "" },
  { src: preWedding, title: "Salt & Sun", client: "Meera & Karan · Goa", category: "Pre-Weddings", span: "" },
  { src: music, title: "Neon Hymns", client: "Indie Single · Mumbai", category: "Music Videos", span: "row-span-2" },
  { src: event, title: "Crystal Ballroom", client: "Annual Gala · Delhi", category: "Events", span: "" },
  { src: product, title: "Hour of Gold", client: "Luxury Watch Co.", category: "Commercials", span: "" },
  { src: reel, title: "First Dance", client: "Reel · 2.4M views", category: "Reels", span: "" },
];

const categoryMap: Record<string, string> = {
  "wedding-films": "Weddings",
  "pre-wedding-shoots": "Pre-Weddings",
  "fashion-shoots": "Fashion",
  "music-videos": "Music Videos",
  "drone-cinematography": "Drone",
  "event-coverage": "Events",
  "product-commercials": "Commercials",
  "reel-creation": "Reels",
  "brand-films": "Commercials",
  "youtube-production": "Reels",
  "video-editing": "All",
  "motion-graphics": "Fashion"
};

const categories = ["All", "Weddings", "Pre-Weddings", "Fashion", "Music Videos", "Drone", "Events", "Commercials", "Reels"];

const Portfolio = () => {
  const [active, setActive] = useState("All");
  const [liveItems, setLiveItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const q = query(collection(db, "service_media"), where("active", "==", true));
        const snap = await getDocs(q);
        const fetched: Item[] = snap.docs.map(d => {
          const data = d.data();
          return {
            src: data.url,
            title: data.caption,
            client: data.description?.substring(0, 80) + "...",
            category: categoryMap[data.serviceSlug] || "All",
            type: data.type || "image"
          };
        });
        setLiveItems(fetched);
      } catch (e) {
        console.error("Failed to fetch portfolio:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        // High-end cinematic parameters: autoplay, mute, loop, no controls
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[2]}&rel=0&modestbranding=1&iv_load_policy=3`;
      }
    }
    if (type === 'instagram') {
      const id = url.split('/p/')?.[1]?.split('/')?.[0] || url.split('/reels/')?.[1]?.split('/')?.[0] || url.split('/reel/')?.[1]?.split('/')?.[0];
      if (id) return `https://www.instagram.com/p/${id}/embed`;
    }
    return url;
  };

  const displayItems = liveItems.length > 0 ? liveItems : exampleItems;
  const filtered = active === "All" ? displayItems : displayItems.filter((i) => i.category === active);

  return (
    <section id="portfolio" className="relative py-36 lg:py-48 overflow-hidden bg-white">
      {/* Royal Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-20 h-[1.5px] bg-gradient-to-r from-primary to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.5em] font-black text-primary italic">Cinematic Archive</span>
            </motion.div>
            <h2 className="font-display text-section leading-[0.95] tracking-tighter">
              Bespoke films &<br />
              <span className="italic font-light text-primary">royal perspectives.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6">
            <p className="text-slate-500 max-w-sm text-lg font-medium leading-relaxed">
              We don't just record events; we curate <span className="text-slate-900 font-bold">visual legacies</span> that stand the test of time.
            </p>
            {loading && (
              <div className="flex items-center gap-3 text-primary px-5 py-2 rounded-full bg-primary/5 border border-primary/10">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] uppercase tracking-widest font-black">Syncing Royal Feed...</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills - Royal Design */}
        <div className="flex flex-wrap gap-3 mb-20">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-[10px] uppercase tracking-[0.3em] font-black px-8 py-4 rounded-full border transition-all duration-700 ${
                active === c
                  ? "bg-slate-900 text-primary border-slate-900 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] scale-105"
                  : "bg-transparent text-slate-400 border-slate-100 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Royal Masonry Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 auto-rows-[340px] lg:auto-rows-[420px]">
          {filtered.map((it, i) => (
            <motion.div
              key={`${it.title}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 ${it.span || ""} shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(212,175,55,0.15)] transition-all duration-700`}
            >
              <div className="absolute inset-0 z-0">
                {it.type === "youtube" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative"
                  >
                    <iframe
                      src={getEmbedUrl(it.src, 'youtube')}
                      className="w-full h-full object-cover scale-[1.02] grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                      allow="autoplay; encrypted-media"
                      loading="lazy"
                    />
                    {/* Royal Glass Overlay - Interaction Blocked to allow scroll */}
                    <div className="absolute inset-0 bg-transparent pointer-events-auto" />
                  </motion.div>
                ) : it.type === "instagram" ? (
                  <iframe
                    src={getEmbedUrl(it.src, 'instagram')}
                    className="w-full h-full object-cover scale-[1.01] group-hover:scale-105 transition-all duration-1000"
                    allowTransparency
                  />
                ) : it.type === "video" ? (
                  <video
                    src={it.src}
                    className="w-full h-full object-cover scale-[1.01] group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                    muted loop playsInline
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={it.src}
                    alt={it.title}
                    className="w-full h-full object-cover scale-[1.01] group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                  />
                )}
              </div>
              
              {/* Luxury Gradient & Border */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700 pointer-events-none" />
              <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-[2.5rem] group-hover:border-primary/30 transition-colors duration-700 pointer-events-none" />

              {/* Royal Play Indicator */}
              <div className="absolute top-8 right-8 w-14 h-14 rounded-2xl glass-premium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-4 group-hover:translate-y-0 shadow-2xl pointer-events-none">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-primary fill-primary ml-0.5" />
                </div>
              </div>

              {/* Discipline Tag */}
              <div className="absolute top-8 left-8 text-[8px] tracking-[0.3em] text-white px-5 py-2 border border-white/20 backdrop-blur-xl rounded-full font-black uppercase bg-black/20 pointer-events-none group-hover:border-primary/50 group-hover:text-primary transition-all duration-700">
                {it.category}
              </div>

              {/* Royal Caption Reveal */}
              <div className="absolute inset-x-0 bottom-0 p-10 translate-y-6 group-hover:translate-y-0 transition-all duration-700 pointer-events-none">
                <h4 className="font-display text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-700 leading-none">
                  {it.title}
                </h4>
                <p className="text-[10px] tracking-luxury text-slate-300 font-bold uppercase line-clamp-1 group-hover:text-white transition-colors">
                  {it.client}
                </p>
                {/* Gold underline reveal */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className="h-[1px] bg-gradient-to-r from-primary to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            to="/booking"
            className="btn-ghost group inline-flex cursor-pointer"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
