import gaganPortrait from "@/assets/gagan-ganvir.jpg";
import { Award, Film, Heart, ArrowRight, MapPin, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const badges = [
  { icon: Award, label: "Award Winning", num: "12+" },
  { icon: Film, label: "Films Created", num: "500+" },
  { icon: Heart, label: "Happy Clients", num: "100+" },
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
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] group shadow-2xl"
            >
              <img
                src={gaganPortrait}
                alt="Gagan Ganvir — Cinematographer & Founder, MarathiVlogger Studio, Gondia"
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-[1.2s] ease-cinematic"
              />
              <div className="absolute inset-0 ring-2 ring-inset ring-primary/20 rounded-[2rem]" />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Name tag on photo */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-white font-display text-2xl font-black tracking-tight">Gagan Ganvir</div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest text-primary font-black">Gondia, Maharashtra</span>
                </div>
              </div>

              {/* Available badge */}
              <div className="absolute top-6 right-6">
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-glow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  Available
                </motion.div>
              </div>
            </motion.div>

            {/* Decorative frame corners */}
            <div className="absolute -top-5 -left-5 w-28 h-28 border-l-2 border-t-2 border-primary/50 rounded-tl-sm" />
            <div className="absolute -bottom-5 -right-5 w-28 h-28 border-r-2 border-b-2 border-primary/50 rounded-br-sm" />

            {/* Floating signature card */}
            <div className="absolute -bottom-8 left-6 lg:-right-10 lg:left-auto glass-premium p-6 max-w-[280px] hover-lift">
              <div className="font-display italic text-xl text-gradient-gold mb-1">MarathiVlogger</div>
              <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">FOUNDER & CINEMATOGRAPHER</div>
            </div>
          </div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 gold-line" />
              <span className="section-label">The Storyteller</span>
            </div>

            <h2 className="font-display text-section leading-[1.05] mb-4">
              <span className="text-gradient-gold italic">Gagan Ganvir.</span>
            </h2>
            <p className="text-foreground/50 text-lg tracking-wide mb-10 font-medium uppercase text-sm">Founder · Cinematographer · Gondia, Maharashtra</p>

            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed mb-12 max-w-2xl">
              <p>
                Born and raised in Gondia, Maharashtra, Gagan Ganvir channeled his love for storytelling into a full-scale cinematic studio. From intimate wedding films to high-impact brand reels — every frame is a reflection of dedication and artistic precision.
              </p>
              <p>
                Gagan is currently <strong className="text-white">open for collaborations</strong> with brands, creators, and couples who believe their story deserves the Royal treatment. Whether it's a destination wedding, a commercial campaign, or a passion project — reach out and let's create together.
              </p>
            </div>

            {/* Collaboration badge */}
            <div className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-primary/20 bg-primary/5 mb-10 max-w-md group hover:border-primary/40 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Handshake className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-white font-black text-sm">Open for Collaborations & Orders</div>
                <div className="text-zinc-500 text-xs mt-0.5">Weddings · Brand Films · Reels · Docs</div>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
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

            <div className="flex flex-wrap gap-4">
              <Link to="/introduction" className="btn-premium group cursor-pointer inline-flex items-center gap-3">
                Meet Gagan
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <a href="#services" className="btn-ghost group inline-flex">
                Explore Services
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
