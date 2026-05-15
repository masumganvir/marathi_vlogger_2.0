import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getServiceBySlug } from "@/data/services";
import { BackButton } from "@/components/BackButton";
import { TechBackground } from "@/components/TechBackground";
import {
  ArrowRight, Check, ChevronRight, Play, Image as ImageIcon,
  Loader2, Star
} from "lucide-react";

interface ServiceMedia {
  id: string;
  type: "image" | "video" | "youtube" | "instagram";
  url: string;
  caption: string;
  description: string;
  order: number;
}

const animationClasses: Record<string, string> = {
  "fade-left": "animate-fade-in",
  "fade-right": "animate-fade-in",
  "scale-in": "animate-scale-in",
  "slide-up": "animate-fade-up",
  "rotate-in": "animate-scale-in",
  "blur-in": "animate-fade-in",
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug || "");
  const [media, setMedia] = useState<ServiceMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [activeMedia, setActiveMedia] = useState<ServiceMedia | null>(null);

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[2]}&rel=0&modestbranding=1`;
      }
    }
    if (type === 'instagram') {
      const id = url.split('/p/')?.[1]?.split('/')?.[0] || url.split('/reels/')?.[1]?.split('/')?.[0] || url.split('/reel/')?.[1]?.split('/')?.[0];
      if (id) return `https://www.instagram.com/p/${id}/embed`;
    }
    return url;
  };

  useEffect(() => {
    if (!service) {
      navigate("/", { replace: true });
      return;
    }
    window.scrollTo(0, 0);

    const fetchMedia = async () => {
      try {
        const q = query(
          collection(db, "service_media"),
          where("serviceSlug", "==", slug),
          where("active", "==", true)
        );
        const snap = await getDocs(q);
        const items: ServiceMedia[] = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceMedia, "id">) }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setMedia(items);
      } catch (e) {
        console.error("Media fetch failed:", e);
      } finally {
        setLoadingMedia(false);
      }
    };
    fetchMedia();
  }, [slug, service, navigate]);

  if (!service) return null;

  const Icon = service.icon;
  const animClass = animationClasses[service.animationVariant] || "animate-fade-in";

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <TechBackground />
      <BackButton />

      {/* ── Hero ── */}
      <div className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden">
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${service.accentColor}20 0%, transparent 60%),
                         radial-gradient(ellipse at 80% 20%, ${service.accentColor}10 0%, transparent 50%),
                         linear-gradient(180deg, #050505 0%, #0a0a0a 100%)`,
          }}
        />
        {/* Animated number watermark */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none"
          style={{
            fontSize: "clamp(180px, 30vw, 400px)",
            color: `${service.accentColor}08`,
            lineHeight: 1,
          }}
        >
          {service.number}
        </div>

        <div className="container relative z-10 pt-40">
          <div className={`max-w-4xl ${animClass}`} style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-16 h-px"
                style={{ background: service.accentColor }}
              />
              <span
                className="text-[11px] uppercase tracking-luxury font-bold"
                style={{ color: service.accentColor }}
              >
                Service {service.number}
              </span>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-luxury font-bold border"
                style={{
                  color: service.accentColor,
                  borderColor: `${service.accentColor}40`,
                  background: `${service.accentColor}10`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: service.accentColor }} />
                {service.available ? "Available" : "Coming Soon"}
              </div>
            </div>

            <h1
              className="font-display font-black mb-6 leading-[0.9]"
              style={{ fontSize: "clamp(52px, 8vw, 110px)" }}
            >
              {service.title}
            </h1>

            <p
              className="font-display italic text-2xl md:text-3xl mb-8 opacity-80"
              style={{ color: service.accentColor }}
            >
              {service.tagline}
            </p>

            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
              {service.fullDesc}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/booking"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-luxury text-black transition-all duration-500 hover:scale-105 hover:shadow-glow"
                style={{ background: `linear-gradient(135deg, ${service.accentColor}, ${service.accentColor}CC)` }}
              >
                Book This Service <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[11px] uppercase tracking-luxury border transition-all duration-500 hover:scale-105"
                style={{ borderColor: `${service.accentColor}40`, color: service.accentColor }}
              >
                See Our Process <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ── Icon floating badge ── */}
      <div className="container -mt-8 mb-20">
        <div
          className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl"
          style={{
            borderColor: `${service.accentColor}30`,
            background: `${service.accentColor}08`,
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: `${service.accentColor}20` }}
          >
            <Icon className="w-7 h-7" style={{ color: service.accentColor }} />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-luxury font-bold">What you get</p>
            <p className="text-white font-bold text-lg">{service.whatWeDeliver.length} premium deliverables</p>
          </div>
        </div>
      </div>

      {/* ── What We Deliver ── */}
      <section className="container mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px" style={{ background: service.accentColor }} />
              <span className="text-[11px] uppercase tracking-luxury font-bold" style={{ color: service.accentColor }}>
                Deliverables
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-10 leading-tight">
              Everything included.<br />
              <span className="italic" style={{ color: service.accentColor }}>Nothing omitted.</span>
            </h2>
            <div className="space-y-4">
              {service.whatWeDeliver.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-all duration-300 group"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                    style={{ background: `${service.accentColor}20` }}
                  >
                    <Check className="w-3.5 h-3.5" style={{ color: service.accentColor }} />
                  </div>
                  <span className="text-zinc-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div id="process">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px" style={{ background: service.accentColor }} />
              <span className="text-[11px] uppercase tracking-luxury font-bold" style={{ color: service.accentColor }}>
                Our Process
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-10 leading-tight">
              Obsessive.<br />
              <span className="italic" style={{ color: service.accentColor }}>By design.</span>
            </h2>
            <div className="space-y-6">
              {service.process.map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${service.accentColor}30, ${service.accentColor}10)`,
                        border: `1px solid ${service.accentColor}40`,
                        color: service.accentColor,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < service.process.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: `${service.accentColor}20` }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-white mb-1 group-hover:text-opacity-90 transition-colors">
                      {step.step}
                    </h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Creations (Static for all templates) ── */}
      <section className="container mb-32">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px" style={{ background: service.accentColor }} />
          <span className="text-[11px] uppercase tracking-luxury font-bold" style={{ color: service.accentColor }}>
            Featured Creations
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-12">
          Cinematic <span className="italic" style={{ color: service.accentColor }}>Shorts.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "qEK4sw9yFNk",
            "fkTg3Fp7Y6U",
            "aDqgUuWaAkg",
            "3Kdu86ybDXE"
          ].map((id, index) => (
            <div 
              key={id} 
              className="group relative aspect-[9/16] bg-charcoal/40 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl"
            >
              <iframe
                className="w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autohide=1&controls=1`}
                title={`YouTube Short ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Media Gallery ── */}
      <section className="container mb-32">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px" style={{ background: service.accentColor }} />
          <span className="text-[11px] uppercase tracking-luxury font-bold" style={{ color: service.accentColor }}>
            Our Work
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Proof in every pixel.
        </h2>
        <p className="text-zinc-500 mb-12 text-lg">
          {service.captionHero}
        </p>

        {loadingMedia ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: service.accentColor }} />
          </div>
        ) : media.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed"
            style={{ borderColor: `${service.accentColor}30` }}
          >
            <ImageIcon className="w-12 h-12 mb-4 opacity-30" style={{ color: service.accentColor }} />
            <p className="text-zinc-600 text-sm uppercase tracking-luxury font-bold">
              Portfolio Coming Soon
            </p>
            <p className="text-zinc-700 text-xs mt-2">
              Our team is curating the best examples for this service.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/15 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => setActiveMedia(item)}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : item.type === "youtube" ? (
                    <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
                      <iframe
                        src={getEmbedUrl(item.url, 'youtube')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        allow="autoplay; encrypted-media"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                  ) : item.type === "instagram" ? (
                    <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
                      <iframe
                        src={getEmbedUrl(item.url, 'instagram')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] bg-zinc-900">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                          style={{ background: `${service.accentColor}30`, border: `1px solid ${service.accentColor}60` }}
                        >
                          <Play className="w-6 h-6 ml-1" style={{ color: service.accentColor }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm mb-1">{item.caption}</p>
                    {item.description && (
                      <p className="text-zinc-400 text-xs line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="container mb-32">
        <div
          className="relative p-12 md:p-20 rounded-3xl overflow-hidden text-center"
          style={{ background: `linear-gradient(135deg, ${service.accentColor}10, ${service.accentColor}05)`, border: `1px solid ${service.accentColor}20` }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none"
            style={{ background: `${service.accentColor}15` }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-luxury font-bold border mb-6"
              style={{ color: service.accentColor, borderColor: `${service.accentColor}40`, background: `${service.accentColor}10` }}
            >
              <Star className="w-3 h-3" /> Premium Service
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Ready to create<br />
              <span className="italic" style={{ color: service.accentColor }}>something iconic?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Let's talk about your vision. Every great project starts with a conversation.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-luxury text-black transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${service.accentColor}, ${service.accentColor}BB)` }}
            >
              Book {service.title} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Media Lightbox */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
          onClick={() => setActiveMedia(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {activeMedia.type === "image" ? (
              <img src={activeMedia.url} alt={activeMedia.caption} className="w-full max-h-[75vh] object-contain rounded-2xl" />
            ) : activeMedia.type === "youtube" ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  src={getEmbedUrl(activeMedia.url, 'youtube')}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : activeMedia.type === "instagram" ? (
              <div className="w-full aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white">
                <iframe
                  src={getEmbedUrl(activeMedia.url, 'instagram')}
                  className="w-full h-full"
                  allowTransparency
                />
              </div>
            ) : (
              <video src={activeMedia.url} controls autoPlay className="w-full max-h-[75vh] rounded-2xl" />
            )}
            <div className="mt-6 text-center">
              <p className="text-white font-bold text-xl mb-2">{activeMedia.caption}</p>
              <p className="text-zinc-400">{activeMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
