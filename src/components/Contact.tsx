import { Mail, Phone, MapPin, Instagram, Youtube, Linkedin, CalendarDays, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <section id="contact" className="relative py-36 lg:py-48 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-background to-charcoal/60" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-radial opacity-25 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Left: copy + contacts */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 gold-line" />
              <span className="section-label">Let's Create</span>
            </div>

            <h2 className="font-display text-section leading-[1.05] mb-10">
              Tell me about<br />
              <span className="italic text-gradient-gold">your story.</span>
            </h2>

            <p className="text-foreground/65 text-xl mb-14 max-w-md leading-relaxed">
              I take on a limited number of projects each year to ensure every
              frame receives the obsession it deserves. Reach out — let's see if
              we're a fit.
            </p>

            <div className="space-y-6 mb-14">
              <a href="mailto:marathivloggerstudios@gmail.com" className="flex items-center gap-5 group">
                <div className="w-13 h-13 border-[1.5px] border-primary/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-btn transition-all duration-500"
                  style={{ width: 52, height: 52 }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">EMAIL</div>
                  <div className="text-base font-medium">marathivloggerstudios@gmail.com</div>
                </div>
              </a>
              <a href="tel:+918262971842" className="flex items-center gap-5 group">
                <div className="w-13 h-13 border-[1.5px] border-primary/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-btn transition-all duration-500"
                  style={{ width: 52, height: 52 }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">WHATSAPP · CALL</div>
                  <div className="text-base font-medium">+91 82629 71842</div>
                </div>
              </a>
              <a href="tel:+919370703933" className="flex items-center gap-5 group">
                <div className="w-13 h-13 border-[1.5px] border-primary/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-btn transition-all duration-500"
                  style={{ width: 52, height: 52 }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">ALTERNATIVE</div>
                  <div className="text-base font-medium">+91 93707 03933</div>
                </div>
              </a>
              <div className="flex items-center gap-5">
                <div className="border-[1.5px] border-primary/30 rounded-full flex items-center justify-center"
                  style={{ width: 52, height: 52 }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] tracking-luxury text-muted-foreground font-medium">BASED IN</div>
                  <div className="text-base font-medium">Gondia, Maharashtra · Available worldwide</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/marathi_vloggerr_2?igsh=Z21haXV2ODFtbHF4" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 border-[1.5px] border-border/60 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-btn flex items-center justify-center transition-all duration-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@daily_vloger_gagan?si=N7ycjHKC6b9uaWUp" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-12 h-12 border-[1.5px] border-border/60 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-btn flex items-center justify-center transition-all duration-500">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/masum-ganvir-358b9b337" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-12 h-12 border-[1.5px] border-border/60 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-btn flex items-center justify-center transition-all duration-500">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="glass-premium p-8 sm:p-12 space-y-8 rounded-sm flex flex-col justify-center items-center text-center relative overflow-hidden group/panel border-[1.5px] border-primary/20 hover:border-primary/40 transition-colors duration-700">
            {/* Ambient background animations */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 group-hover/panel:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full animate-breathe" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full animate-breathe" style={{ animationDelay: "2s" }} />

            <div className="relative z-10 w-full space-y-10">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-luxury text-primary font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Now Booking 2026/2027
              </div>

              <h3 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
                Secure Your <br />
                <span className="italic text-gradient-gold">Dates</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-left w-full max-w-md mx-auto">
                <div className="bg-background/60 backdrop-blur-md border-[1.5px] border-border/50 p-6 rounded-sm hover:border-primary/40 transition-colors duration-500">
                  <CalendarDays className="w-6 h-6 text-primary mb-4 opacity-80" />
                  <div className="text-[10px] tracking-luxury text-muted-foreground mb-1">AVAILABILITY</div>
                  <div className="font-medium text-foreground/90 text-[13px] leading-relaxed">Limited slots remaining for peak wedding season</div>
                </div>
                <div className="bg-background/60 backdrop-blur-md border-[1.5px] border-border/50 p-6 rounded-sm hover:border-primary/40 transition-colors duration-500">
                  <Globe className="w-6 h-6 text-primary mb-4 opacity-80" />
                  <div className="text-[10px] tracking-luxury text-muted-foreground mb-1">DESTINATION</div>
                  <div className="font-medium text-foreground/90 text-[13px] leading-relaxed">Available worldwide for destination projects</div>
                </div>
              </div>

              <div className="pt-4 w-full max-w-md mx-auto">
                <Link 
                  to="/booking"
                  className="relative w-full group overflow-hidden rounded-sm cursor-pointer block shadow-btn hover:shadow-glow transition-all duration-700 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-gold" />
                  <div className="relative px-8 py-6 flex items-center justify-center gap-4 bg-obsidian m-[2px] rounded-[2px] transition-colors duration-500 group-hover:bg-transparent">
                    <span className="font-display font-bold text-2xl sm:text-3xl text-gradient-gold group-hover:text-primary-foreground tracking-wide transition-colors duration-500">
                      Book Now
                    </span>
                    <ArrowRight className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:translate-x-2" />
                  </div>
                </Link>
              </div>
              
              <p className="text-[11px] text-muted-foreground tracking-wide font-medium">
                I respond within 24 hours. All inquiries kept confidential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
