import gaganPortrait from "@/assets/gagan-ganvir.jpg";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Instagram, Youtube, Mail, MapPin, Handshake, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Showcase = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px]"
        />
      </div>

      <Navigation />
      
      <main className="relative z-10 pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-4xl mb-24">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-widest mb-16 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-white transition-all group-hover:scale-110">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Home
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-9xl font-black mb-12 tracking-tighter leading-[0.9]"
            >
              The Artist <br />
              <span className="italic text-gradient-gold">Introduction.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl font-light border-l border-primary/20 pl-8"
            >
              Welcome to the inner world of MarathiVlogger Studio. We don't just record events; we weave cinematic legacies for those who value emotion over pixels.
            </motion.p>
          </div>

          {/* Featured Intro Video */}
          <section className="mb-40">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-px bg-primary/40" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-primary font-black">Featured Masterpiece</span>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Biopic Card */}
                  <div className="flex items-center gap-6 mb-10 p-6 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 shadow-2xl">
                    <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 shadow-xl border border-primary/20">
                      <img src={gaganPortrait} alt="Gagan Ganvir" className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-black text-white tracking-tight">Gagan Ganvir</div>
                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Gondia, Maharashtra</span>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/30 rounded-full"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Available for Orders</span>
                      </motion.div>
                    </div>
                  </div>

                  <h2 className="font-display text-5xl font-black mb-8 tracking-tight leading-tight">Crafting <br /><span className="text-gradient-gold italic">Marathi Legacies.</span></h2>
                  <div className="space-y-6 text-zinc-400 text-lg leading-relaxed font-medium">
                    <p>
                      My journey as a MarathiVlogger is a pursuit of "Royal" cinematic excellence. From Gondia to the global stage, every project is a testament to our rich heritage and modern storytelling.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      {[["500+","Films Created"],["100%","Client Love"],["12+","Awards"],["∞","Passion"]].map(([num, label]) => (
                        <div key={label} className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5">
                          <div className="text-2xl font-black text-white">{num}</div>
                          <div className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaboration Banner */}
                  <div className="mt-10 flex items-center gap-4 p-5 rounded-[1.5rem] border border-primary/20 bg-primary/5">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Handshake className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-black text-sm">Open for Collaborations & Orders</div>
                      <div className="text-zinc-500 text-xs mt-0.5">Weddings · Brand Films · Reels · Docs · Events</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                  </div>

                  <div className="mt-10 flex flex-wrap gap-5">
                    <a href="https://www.instagram.com/marathi_vloggerr_2?igsh=Z21haXV2ODFtbHF4" target="_blank" className="p-5 rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-primary transition-all group shadow-xl">
                      <Instagram className="w-6 h-6 text-zinc-500 group-hover:text-primary transition-colors" />
                    </a>
                    <a href="https://youtube.com/@marathivloggerr" target="_blank" className="p-5 rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-primary transition-all group shadow-xl">
                      <Youtube className="w-6 h-6 text-zinc-500 group-hover:text-primary transition-colors" />
                    </a>
                    <Link to="/booking" className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-glow">
                      Book Now
                      <CheckCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[9/16] max-w-[450px] mx-auto rounded-[4rem] overflow-hidden border-[1px] border-white/10 shadow-[0_40px_80px_-20px_rgba(212,175,55,0.2)] group"
                >
                  <iframe
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://www.youtube.com/embed/IGZ1gpn1l-o?autoplay=1&mute=1&loop=1&playlist=IGZ1gpn1l-o&rel=0&modestbranding=1"
                    title="Detailed Introduction Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Subtle glass overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md">
                      <Play className="w-5 h-5 fill-white" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-white font-black drop-shadow-xl">Work Ethic</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-zinc-900/60 rounded-[5rem] p-20 text-center border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <h2 className="font-display text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none">Ready to create your <br /><span className="italic text-gradient-gold">Cinematic Legacy?</span></h2>
            <Link 
              to="/booking"
              className="inline-flex items-center gap-6 px-14 py-7 bg-primary text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-700 shadow-glow hover:scale-105"
            >
              Start Your Project
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <Play className="w-4 h-4 fill-black" />
              </div>
            </Link>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Showcase;
