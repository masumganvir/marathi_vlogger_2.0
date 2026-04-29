import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
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
  span: string;
};

const items: Item[] = [
  { src: wedding, title: "An Eternal Vow", client: "Riya & Arnav · Udaipur", category: "Weddings", span: "row-span-2" },
  { src: drone, title: "Palace of Light", client: "Taj Falaknuma · Hyderabad", category: "Drone", span: "" },
  { src: fashion, title: "Obsidian", client: "Vogue Editorial", category: "Fashion", span: "" },
  { src: preWedding, title: "Salt & Sun", client: "Meera & Karan · Goa", category: "Pre-Weddings", span: "" },
  { src: music, title: "Neon Hymns", client: "Indie Single · Mumbai", category: "Music Videos", span: "row-span-2" },
  { src: event, title: "Crystal Ballroom", client: "Annual Gala · Delhi", category: "Events", span: "" },
  { src: product, title: "Hour of Gold", client: "Luxury Watch Co.", category: "Commercials", span: "" },
  { src: reel, title: "First Dance", client: "Reel · 2.4M views", category: "Reels", span: "" },
];

const categories = ["All", "Weddings", "Pre-Weddings", "Fashion", "Music Videos", "Drone", "Events", "Commercials", "Reels"];

const Portfolio = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <section id="portfolio" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 gold-line" />
              <span className="section-label">Featured Work</span>
            </div>
            <h2 className="font-display text-section leading-[1.05]">
              Selected films &<br />
              <span className="italic text-gradient-gold">stories from the lens.</span>
            </h2>
          </div>
          <p className="text-foreground/55 max-w-sm text-lg leading-relaxed">
            A curated selection from over <span className="text-primary font-semibold">500 shoots</span> — each a different soul, a different story.
          </p>
        </div>

        {/* Filter pills — rounded, premium */}
        <div className="flex flex-wrap gap-2.5 mb-14">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-[11px] uppercase tracking-luxury px-5 py-3 rounded-full border-[1.5px] transition-all duration-400 font-medium ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground shadow-btn"
                  : "border-border/60 text-foreground/55 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Masonry grid — bigger and bolder */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-[300px] lg:auto-rows-[360px]">
          {filtered.map((it, i) => (
            <a
              key={`${it.title}-${i}`}
              href="#"
              className={`group relative overflow-hidden block rounded-sm ${it.span} animate-fade-in`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <img
                src={it.src}
                alt={it.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-cinematic)] group-hover:scale-110"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Play badge */}
              <div className="absolute top-5 right-5 w-12 h-12 rounded-full glass-premium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-3 group-hover:translate-y-0 hover:scale-110">
                <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
              </div>

              {/* Category tag */}
              <div className="absolute top-5 left-5 text-[9px] tracking-luxury text-primary/90 px-3 py-1.5 border border-primary/30 backdrop-blur-md rounded-full font-medium bg-primary/5">
                {it.category}
              </div>

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <div className="font-display text-2xl lg:text-3xl font-bold leading-tight mb-1">{it.title}</div>
                <div className="text-[10px] tracking-luxury text-primary/80 font-medium">{it.client}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a 
            href="https://airtable.com/apppjRZM2gWjM9L4v/pagLWhrzAHx6eDnF0/form"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost group inline-flex cursor-pointer"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
