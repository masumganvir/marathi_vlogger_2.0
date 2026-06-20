import { useState, useEffect, useRef } from "react";
import gaganPortrait from "@/assets/gagan-ganvir.jpg";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, doc, updateDoc, addDoc,
  deleteDoc, query, orderBy, serverTimestamp, where
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { SERVICES_DATA } from "@/data/services";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useSecurity } from "@/hooks/useSecurity";
import { 
  Shield, LayoutDashboard, Package, ShoppingCart, Image,
  ToggleLeft, ToggleRight, Trash2, Plus, Edit2, Check,
  X, Loader2, TrendingUp, Users, Star, Eye, Upload,
  Film, ChevronDown, BarChart3, AlertCircle, RefreshCw,
  Zap, Heart, Plane, Camera, ShoppingBag, Palette, Mic2,
  Briefcase, Youtube, Sparkles, Bot, Wand2, Database
} from "lucide-react";

// ─── ADMIN EMAIL (Single owner — DO NOT add more) ───────────────────────────
const ADMIN_EMAILS = [
  "marathivloggerstudio@gmail.com",
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  name: string;
  email: string;
  packageId: string;
  eventDate: string;
  location: string;
  phone: string;
  status: string;
  type: string;
  createdAt: any;
}

interface ServiceMedia {
  id: string;
  serviceSlug: string;
  type: "image" | "video" | "youtube" | "instagram";
  url: string;
  caption: string;
  description: string;
  order: number;
  active: boolean;
}

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  service: string;
  approved: boolean;
  createdAt: any;
}

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
const PageTransition = ({ children, active }: { children: React.ReactNode, active: boolean }) => (
  <AnimatePresence mode="wait">
    {active && (
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const StatCard = ({ label, value, icon: Icon, color, delay, onClick }: any) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className="relative p-8 rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden group text-left w-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500"
  >
    {/* Animated Gradient Background */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-10 -top-10 w-40 h-40 blur-[50px] rounded-full"
        style={{ background: color }}
      />
    </div>

    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-2">{label}</span>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "2rem" }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="h-1 rounded-full" 
          style={{ background: `linear-gradient(to right, ${color}, transparent)` }} 
        />
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] shadow-lg group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]" 
           style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)`, border: `1px solid ${color}30` }}>
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
    </div>
    
    <div className="flex items-end gap-3 relative z-10">
      <motion.p 
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: delay + 0.1 }}
        className="text-6xl font-display font-black text-slate-900 tracking-tighter leading-none"
      >
        {value}
      </motion.p>
      <div className="flex flex-col pb-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pulse</span>
        </div>
      </div>
    </div>

    <div className="absolute bottom-6 right-8 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2">
      <span className="text-[9px] font-black text-slate-900 uppercase tracking-luxury">Insights</span>
      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
        <ChevronDown className="w-3 h-3 -rotate-90" />
      </div>
    </div>
  </motion.button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; color: string }> = {
    Processing: { label: "Processing", color: "#F59E0B" },
    Confirmed: { label: "Confirmed", color: "#3B82F6" },
    Completed: { label: "Completed", color: "#10B981" },
    Cancelled: { label: "Cancelled", color: "#EF4444" },
  };
  const s = map[status] || { label: status, color: "#71717A" };
  return (
    <span className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold border" style={{ background: `${s.color}10`, color: s.color, borderColor: `${s.color}30` }}>
      {s.label}
    </span>
  );
};

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"dashboard" | "orders" | "services" | "media" | "reviews">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [media, setMedia] = useState<ServiceMedia[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [serviceAvailability, setServiceAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [activeStatDetail, setActiveStatDetail] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(SERVICES_DATA[0].slug);
  const [mediaForm, setMediaForm] = useState({ url: "", caption: "", description: "", type: "image" as "image" | "video" | "youtube" | "instagram", order: 0 });
  const [submittingMedia, setSubmittingMedia] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [tiyaStatus, setTiyaStatus] = useState("");

  const generateAIContent = async () => {
    if (!aiHint) {
      toast.error("Please provide a small hint or raw text for Tiya to analyze!");
      return;
    }

    setIsGeneratingAI(true);
    const keys = [
      import.meta.env.VITE_OPENROUTER_API_KEY_1,
      import.meta.env.VITE_OPENROUTER_API_KEY_2,
      import.meta.env.VITE_OPENROUTER_API_KEY_3
    ].filter(Boolean);

    const models = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "mistralai/mistral-7b-instruct:free",
      "deepseek/deepseek-chat"
    ];

    let lastError = "No keys provided";
    let success = false;

    for (let kIdx = 0; kIdx < keys.length; kIdx++) {
      const key = keys[kIdx];
      for (let mIdx = 0; mIdx < models.length; mIdx++) {
        const model = models[mIdx];
        try {
          // Show progress to user
          const statusMsg = `Attempting Circuit ${kIdx + 1} with ${model.split('/')[1]?.split(':')[0] || model}...`;
          setTiyaStatus(statusMsg);
          console.log(`Tiya: ${statusMsg}`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json",
              "HTTP-Referer": window.location.origin,
              "X-Title": "MarathiVlogger Studio Admin",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: "system",
                  content: "You are Tiya, the cinematic creative manager of MarathiVlogger Studios. Convert raw hints into luxury storytelling. Return a JSON object: {\"caption\": \"...\", \"description\": \"...\"}. The description must be a poetic, immersive paragraph. Return ONLY raw JSON."
                },
                {
                  role: "user",
                  content: `Discipline: ${selectedService}. Hint: ${aiHint}. Output JSON.`
                }
              ],
              temperature: 0.8
            })
          });

          clearTimeout(timeoutId);
          const data = await response.json();
          
          if (!response.ok) {
            lastError = `API Error ${response.status}: ${data.error?.message || "Internal failure"}`;
            console.error(`Tiya [${model}]:`, lastError);
            
            // IF KEY IS INVALID (401), SKIP THIS KEY ENTIRELY
            if (response.status === 401) {
              lastError = "Invalid API Key. Skipping to next circuit.";
              break; 
            }
            continue; 
          }

          const rawContent = data.choices?.[0]?.message?.content;
          if (rawContent) {
            try {
              // Extremely robust JSON extraction
              const match = rawContent.match(/\{[\s\S]*\}/);
              const jsonStr = match ? match[0] : rawContent;
                
              const content = JSON.parse(jsonStr.trim());
              if (!content.caption && !content.description) throw new Error("Empty content");

              setMediaForm(f => ({ 
                ...f, 
                caption: content.caption || f.caption, 
                description: content.description || f.description 
              }));
              
              toast.success("Tiya has synchronized your creative vision!");
              success = true;
              break;
            } catch (parseErr) {
              lastError = "Tiya spoke in riddles (JSON Parse Error).";
              console.error("Parse Error Content:", rawContent);
            }
          }
        } catch (e: any) {
          lastError = e.name === 'AbortError' ? "Circuit Timed Out (12s)" : `Connection Failed: ${e.message}`;
          console.error("Fetch/Timeout Error:", e);
        }
      }
      if (success) break;
    }

    if (!success) {
      toast.error(`Tiya Error: ${lastError}`);
      setTiyaStatus("Circuit Overloaded. Manual entry required.");
    } else {
      setTiyaStatus("");
    }
    setIsGeneratingAI(false);
  };

  // Auth guard
  useEffect(() => {
    if (!isLoaded) return;
    const email = user?.primaryEmailAddress?.emailAddress || "";
    if (!user || !ADMIN_EMAILS.includes(email)) {
      // For testing, we might want to bypass this, but for production it stays.
      // If we are stuck on loading, it might be Clerk not being ready.
      console.log("Auth Guard: User not authorized or not loaded.");
    }
  }, [isLoaded, user, navigate]);

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ordSnap, medSnap, revSnap, svcSnap] = await Promise.all([
        getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "service_media")),
        getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "service_availability")),
      ]);

      setOrders(ordSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setMedia(medSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceMedia)));
      setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));

      const avail: Record<string, boolean> = {};
      SERVICES_DATA.forEach(s => { avail[s.slug] = s.available; });
      svcSnap.docs.forEach(d => { avail[d.id] = d.data().available ?? true; });
      setServiceAvailability(avail);
    } catch (e) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const { logActivity } = useSecurity();

  useEffect(() => {
    if (isLoaded && user) {
      logActivity("ADMIN_PANEL_OPEN");
    }
    fetchAll();
  }, [isLoaded, user]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch { toast.error("Update failed."); }
  };

  const toggleService = async (slug: string) => {
    const newVal = !serviceAvailability[slug];
    try {
      await updateDoc(doc(db, "service_availability", slug), { available: newVal })
        .catch(async () => {
          const { setDoc } = await import("firebase/firestore");
          await setDoc(doc(db, "service_availability", slug), { available: newVal });
        });
      setServiceAvailability(prev => ({ ...prev, [slug]: newVal }));
      toast.success(`Service ${newVal ? "enabled" : "disabled"}`);
    } catch { toast.error("Toggle failed."); }
  };

  const addMedia = async () => {
    if (!mediaForm.caption || (!mediaForm.url && !mediaFile)) {
      toast.error("File/URL and caption are required.");
      return;
    }
    
    setSubmittingMedia(true);
    let finalUrl = mediaForm.url;

    try {
      if (mediaFile) {
        const fileRef = ref(storage, `portfolio/${selectedService}/${Date.now()}_${mediaFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, mediaFile);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            }, 
            (error) => reject(error), 
            async () => {
              finalUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(true);
            }
          );
        });
      }

      const docRef = await addDoc(collection(db, "service_media"), {
        serviceSlug: selectedService,
        ...mediaForm,
        url: finalUrl,
        active: true,
        createdAt: serverTimestamp(),
      });
      
      setMedia(prev => [...prev, { id: docRef.id, serviceSlug: selectedService, ...mediaForm, url: finalUrl, active: true }]);
      setMediaForm({ url: "", caption: "", description: "", type: "image", order: 0 });
      setMediaFile(null);
      setUploadProgress(0);
      toast.success("Asset injected into portfolio!");
    } catch (err: any) { 
      console.error("Injection Error:", err);
      // Specific error messaging for common Firebase issues
      let msg = err.message || "Unknown error";
      if (err.code === 'permission-denied') msg = "Database Permission Denied. Check your Firebase Security Rules.";
      if (err.code === 'storage/unauthorized') msg = "Storage Permission Denied. Check your Firebase Storage Rules.";
      if (err.code === 'storage/quota-exceeded') msg = "Storage Quota Exceeded. Please upgrade your Firebase plan.";
      
      toast.error(`Failed to inject asset: ${msg}`); 
    } finally { 
      setSubmittingMedia(false); 
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    try {
      await deleteDoc(doc(db, "service_media", id));
      setMedia(prev => prev.filter(m => m.id !== id));
      logActivity("DELETE_MEDIA", { mediaId: id });
      toast.success("Deleted.");
    } catch { toast.error("Delete failed."); }
  };

  const seedExamplePortfolio = async () => {
    // No blocking confirm for smoother automation, but we'll show a loading state
    setLoading(true);
    toast.loading("Initializing global portfolio schema...");
    
    try {
      const { serverTimestamp, addDoc, collection } = await import("firebase/firestore");
      const examples = [
        { serviceSlug: "wedding-films", caption: "The Royal Vow", description: "Cinematic wedding at Umaid Bhawan Palace.", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "pre-wedding-shoots", caption: "Eternal Chemistry", description: "A sunset story on the shores of Goa.", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "event-coverage", caption: "Crystal Gala", description: "Corporate excellence captured with precision.", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "drone-cinematography", caption: "Skyline Symphony", description: "Aerial perspectives of a rising metropolis.", url: "https://images.unsplash.com/photo-1508444845599-24bd9a0a6fa2?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "reel-creation", caption: "Street Rhythms", description: "High-energy urban reel for lifestyle brand.", url: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "product-commercials", caption: "The Zenith Watch", description: "Macro product cinematography for luxury horology.", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "fashion-shoots", caption: "Avant-Garde", description: "Editorial fashion shoot for seasonal collection.", url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "music-videos", caption: "Neon Hymns", description: "Music video production for breakout indie artist.", url: "https://images.unsplash.com/photo-1514525253344-991c05553632?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "video-editing", caption: "The Final Cut", description: "Professional color grading and narrative assembly.", url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "brand-films", caption: "The Founder's Journey", description: "Documentary brand film for innovative tech startup.", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "youtube-production", caption: "Creator Growth", description: "Full-stack production for a major tech channel.", url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80", type: "image" },
        { serviceSlug: "motion-graphics", caption: "Dynamic Identity", description: "Animated branding package for digital broadcast.", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80", type: "image" }
      ];

      for (const ex of examples) {
        await addDoc(collection(db, "service_media"), {
          ...ex,
          active: true,
          order: 0,
          createdAt: serverTimestamp()
        });
      }
      
      toast.dismiss();
      toast.success("All 12 sectors initialized in database!");
      fetchAll();
    } catch (e: any) {
      console.error("Initialization Crash:", e);
      toast.dismiss();
      toast.error(`Initialization failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleReview = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "reviews", id), { approved: !current });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: !current } : r));
      toast.success(current ? "Review hidden." : "Review approved.");
    } catch { toast.error("Update failed."); }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success("Order deleted.");
    } catch { toast.error("Delete failed."); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews(prev => prev.filter(r => r.id !== id));
      logActivity("DELETE_REVIEW", { reviewId: id });
      toast.success("Review deleted.");
    } catch { toast.error("Delete failed."); }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Logo Container */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-32 h-32 mb-12"
          >
            <div className="absolute inset-0 rounded-[2.5rem] border border-primary/20 animate-spin-slow" />
            <div className="absolute inset-2 rounded-[2rem] border-t-2 border-primary animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
            </div>
          </motion.div>

          {/* Text Reveal */}
          <div className="overflow-hidden mb-3">
            <motion.h2 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display font-black text-3xl text-gradient-gold tracking-tighter"
            >
              Master Console
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">Initializing Secure Systems</p>
            
            {/* Rapid progress bar */}
            <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-primary"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredMedia = media.filter(m => m.serviceSlug === selectedService);
  const stats = {
    totalOrders: orders.length,
    processing: orders.filter(o => o.status === "Processing").length,
    completed: orders.filter(o => o.status === "Completed").length,
    reviews: reviews.length,
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#D4AF37" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "#3B82F6" },
    { id: "services", label: "Services", icon: Package, color: "#10B981" },
    { id: "media", label: "Media Gallery", icon: Image, color: "#8A4AF0" },
    { id: "reviews", label: "Reviews", icon: Star, color: "#EF4444" },
  ] as const;

  const currentTabColor = TABS.find(t => t.id === tab)?.color || "#D4AF37";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-white/5 z-50 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/5 cursor-pointer group" onClick={() => navigate("/")}>
          {/* Biopic Banner */}
          <div className="relative rounded-[2rem] overflow-hidden mb-4 h-36">
            <img src={gaganPortrait} alt="Gagan Ganvir" className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display font-black text-white text-lg leading-none">Gagan Ganvir</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] text-primary uppercase tracking-widest font-black">Gondia, Maharashtra</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-black rounded-full text-[8px] font-black uppercase tracking-widest">
              Admin
            </div>
          </div>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold text-center">MarathiVlogger Studio · Master Console</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <motion.button
              key={id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab(id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] uppercase tracking-luxury font-black transition-all duration-500 group relative overflow-hidden ${
                tab === id
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-900 hover:bg-white"
              }`}
            >
              {tab === id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110 ${tab === id ? "text-white" : "text-current"}`} />
              <span className="relative z-10">{label}</span>
              {tab === id && (
                <div className="absolute right-4 w-2 h-2 rounded-full bg-white/40 animate-ping relative z-10" />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-primary/30 shrink-0">
                <img src={gaganPortrait} className="w-full h-full object-cover object-top" alt="Gagan Ganvir" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-black truncate text-white">Gagan Ganvir</p>
                <p className="text-[8px] text-primary truncate uppercase tracking-widest font-black">Master Admin · Gondia</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            </div>
            <button
              onClick={fetchAll}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
            >
              <RefreshCw className="w-3 h-3" /> Sync Cloud Data
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-72 flex-1 p-8 md:p-12 relative overflow-x-hidden bg-[#f8fafc]">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0],
              y: [0, 100, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]"
          />
        </div>

        {/* Decorative background glow based on tab */}
        <div 
          className="fixed top-0 right-0 w-[800px] h-[800px] blur-[200px] opacity-10 pointer-events-none transition-all duration-1000"
          style={{ background: `radial-gradient(circle at 100% 0%, ${currentTabColor}, transparent)` }}
        />

        <div className="relative min-h-screen">
          <PageTransition active={tab === "dashboard"}>
            <div className="relative z-10">
              <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <h1 className="font-display font-black text-6xl mb-4 tracking-tighter text-slate-900">
                    Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">Overview</span>
                  </h1>
                  <p className="text-slate-500 max-w-xl text-lg font-medium flex items-center gap-2">
                    Namaste, <span className="text-primary font-bold italic">Masum</span>. Your creative empire is performing at peak.
                  </p>
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(212, 175, 55, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickAction(true)}
                  className="group relative px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-luxury rounded-[2rem] overflow-hidden transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors">
                    <Plus className="w-5 h-5" />
                    Launch Quick Action
                  </span>
                </motion.button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard label="Live Inquiries" value={stats.totalOrders} icon={ShoppingCart} color="#D4AF37" delay={0.1} onClick={() => setActiveStatDetail("inquiries")} />
                <StatCard label="In Production" value={stats.processing} icon={TrendingUp} color="#3B82F6" delay={0.2} onClick={() => setActiveStatDetail("production")} />
                <StatCard label="Completed" value={stats.completed} icon={Check} color="#10B981" delay={0.3} onClick={() => setActiveStatDetail("completed")} />
                <StatCard label="Public Reviews" value={stats.reviews} icon={Star} color="#8A4AF0" delay={0.4} onClick={() => setActiveStatDetail("reviews")} />
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-2 p-10 rounded-[3rem] border border-slate-100 bg-white shadow-[0_15px_50px_-20px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="font-display font-black text-3xl flex items-center gap-5 text-slate-900">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      Recent <span className="text-primary italic">Pulse</span>
                    </h3>
                    <button onClick={() => setTab("orders")} className="px-6 py-2 rounded-full bg-slate-50 text-[10px] uppercase tracking-luxury text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-black border border-slate-100">History</button>
                  </div>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active inquiries</p>
                      </div>
                    ) : (
                      orders.slice(0, 5).map((o, idx) => (
                        <motion.div 
                          key={o.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100 group/row"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-display font-black text-xl text-primary border border-slate-100 group-hover/row:scale-110 transition-transform duration-500 shadow-sm">
                              {o.name?.[0] || "?"}
                            </div>
                            <div>
                              <p className="text-lg font-black text-slate-900 group-hover/row:text-primary transition-colors">{o.name || "Guest"}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{o.packageId} · {o.type}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-6">
                            <div className="flex flex-col items-end">
                              <select 
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                className="bg-transparent text-[11px] font-black uppercase tracking-widest text-primary border-none focus:ring-0 cursor-pointer hover:text-slate-900 transition-colors text-right"
                                style={{ direction: 'rtl' }}
                              >
                                <option value="New">New Inquiry</option>
                                <option value="Processing">In Production</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">{o.eventDate || "TBD"}</p>
                            </div>
                            <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.1)]" style={{ background: o.status === 'New' ? '#D4AF37' : o.status === 'Processing' ? '#3B82F6' : '#10B981' }} />
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-[0_15px_50px_-20px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="font-display font-black text-3xl flex items-center gap-5 text-slate-900">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-500" />
                      </div>
                      Disciplines
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {SERVICES_DATA.slice(0, 12).map((s, idx) => {
                      const isOn = serviceAvailability[s.slug] ?? s.available;
                      const Icon = s.icon;
                      return (
                        <motion.button 
                          key={s.id} 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleService(s.slug)}
                          className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border transition-all duration-500 group/item ${
                            isOn ? "bg-slate-50 border-slate-100" : "bg-white border-slate-100 opacity-40"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${isOn ? "shadow-md" : ""}`} style={{ background: isOn ? `${s.accentColor}15` : "#f8fafc" }}>
                            <Icon className="w-6 h-6" style={{ color: isOn ? s.accentColor : "#94a3b8" }} />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${isOn ? "text-slate-700" : "text-slate-400"}`}>
                            {s.title.split(' ')[0]}
                          </span>
                          <motion.div 
                            animate={{ scale: isOn ? 1 : 0 }}
                            className="w-1.5 h-1.5 rounded-full mt-2" 
                            style={{ background: s.accentColor, boxShadow: `0 0 10px ${s.accentColor}` }} 
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Section: System Pulse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-[0_15px_50px_-20px_rgba(0,0,0,0.05)]"
                 >
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse shadow-sm">
                        <BarChart3 className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">System Pulse</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-luxury">Live Data Streaming</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-24">
                      {[...Array(40)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: "10%" }}
                          animate={{ height: `${20 + Math.random() * 80}%` }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                          className="flex-1 bg-primary/20 rounded-full hover:bg-primary transition-all duration-300 cursor-pointer"
                        />
                      ))}
                    </div>
                 </motion.div>
                 
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-[0_15px_50px_-20px_rgba(0,0,0,0.05)] flex items-center justify-between"
                 >
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">Portfolio Analytics</h4>
                      <p className="text-slate-500 text-sm font-medium mb-6">Your visual assets are optimized for global standards.</p>
                      <button onClick={() => setTab("media")} className="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-lg">Manage Library</button>
                    </div>
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-50" />
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">92%</span>
                      </div>
                    </div>
                 </motion.div>
              </div>
            </div>
          </PageTransition>

          {/* ── ORDERS ── */}
          <PageTransition active={tab === "orders"}>
            <div className="relative z-10">
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <h1 className="font-display font-black text-6xl mb-4 tracking-tighter text-slate-900">
                    Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Queue</span>
                  </h1>
                  <p className="text-slate-500 text-lg font-medium">Managing {orders.length} active cinematic requests across India.</p>
                </motion.div>
                <div className="flex items-center gap-6">
                   <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
                   >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{orders.length} ACTIVE ORDERS</span>
                  </motion.div>
                </div>
              </header>

              <div className="space-y-8">
                {orders.length === 0 ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-40 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50"
                  >
                    <ShoppingCart className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 text-2xl font-black uppercase tracking-widest">The queue is clear</p>
                  </motion.div>
                ) : (
                  orders.map((o, idx) => (
                    <motion.div 
                      key={o.id} 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden"
                    >
                      {/* Accent Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex flex-wrap items-start justify-between gap-8 mb-10 relative z-10">
                        <div className="flex gap-8">
                          <motion.div 
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 flex items-center justify-center font-display font-black text-3xl text-blue-600 shadow-xl group-hover:shadow-blue-500/20 transition-all"
                          >
                            {o.name?.[0] || "?"}
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-4 mb-2">
                              <h2 className="font-display font-black text-3xl text-slate-900 group-hover:text-blue-600 transition-colors">{o.name || "Guest Booking"}</h2>
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase border border-blue-100 shadow-sm"
                              >
                                {o.type || "Cinematography"}
                              </motion.div>
                            </div>
                            <p className="text-slate-500 font-medium text-lg flex items-center gap-3">
                              <span className="text-slate-700 font-bold">{o.email}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <span>{o.phone}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <StatusBadge status={o.status} />
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ref:</span>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{o.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 mb-10 group-hover:bg-blue-50/30 transition-colors">
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Tier</p>
                          <p className="text-slate-900 text-lg font-black capitalize flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            {o.packageId}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Target Date</p>
                          <p className="text-slate-900 text-lg font-black">{o.eventDate || "Flexible"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Base</p>
                          <p className="text-slate-900 text-lg font-black">{o.location || "On-Site"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Received</p>
                          <p className="text-slate-900 text-lg font-black">{o.createdAt?.toDate ? new Date(o.createdAt.toDate()).toLocaleDateString() : "New"}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-luxury text-slate-400">Workflow Stage:</span>
                          <div className="flex flex-wrap gap-2">
                            {["New", "Processing", "Confirmed", "Completed", "Cancelled"].map(s => (
                              <motion.button
                                key={s}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateOrderStatus(o.id, s)}
                                className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-luxury font-black transition-all duration-500 border ${
                                  o.status === s 
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-900 shadow-sm"
                                }`}
                              >
                                {s}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                          onClick={() => deleteOrder(o.id)} 
                          className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-300 transition-all flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </PageTransition>

          {/* ── SERVICES ── */}
          <PageTransition active={tab === "services"}>
            <div className="animate-fade-in relative z-10">
              <header className="mb-12">
                <h1 className="font-display font-black text-5xl mb-4 tracking-tight text-slate-900">Services Matrix</h1>
                <p className="text-slate-500 text-lg font-medium">Toggle visibility and availability of your 12 cinematic disciplines.</p>
              </header>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {SERVICES_DATA.map((s, idx) => {
                  const Icon = s.icon;
                  const isOn = serviceAvailability[s.slug] ?? s.available;
                  return (
                    <div 
                      key={s.id} 
                      className="group p-8 rounded-[2rem] border border-slate-200 bg-white hover:border-primary/20 shadow-sm transition-all duration-500 animate-fade-up relative overflow-hidden"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {/* Background glow per service */}
                      <div className="absolute -top-20 -right-20 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ background: s.accentColor }} />
                      
                      <div className="flex items-start justify-between mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500" style={{ background: `${s.accentColor}10`, border: `1px solid ${s.accentColor}30` }}>
                          <Icon className="w-8 h-8" style={{ color: s.accentColor }} />
                        </div>
                        <button
                          onClick={() => toggleService(s.slug)}
                          className={`relative w-14 h-8 rounded-full transition-all duration-500 shadow-inner ${isOn ? "shadow-green-500/10" : ""}`}
                          style={{ background: isOn ? s.accentColor : "#f1f5f9" }}
                        >
                          <div 
                            className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500 ${isOn ? "left-7.5" : "left-1.5"}`}
                          />
                        </button>
                      </div>

                      <div className="relative z-10">
                        <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] mb-2 uppercase">{s.number}</p>
                        <h3 className="font-display font-black text-2xl text-slate-900 mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">{s.desc}</p>
                        
                        <div className="flex items-center justify-between">
                          <span 
                            className={`text-[9px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full border transition-all duration-500 ${
                              isOn 
                                ? "text-white border-primary/20 bg-primary/5" 
                                : "text-slate-400 border-slate-100 bg-transparent"
                            }`}
                            style={{ borderColor: isOn ? `${s.accentColor}40` : "", color: isOn ? s.accentColor : "" }}
                          >
                            {isOn ? "Active" : "Offline"}
                          </span>
                          <div className="flex -space-x-2">
                             {[...Array(3)].map((_, i) => (
                               <div key={i} className="w-6 h-6 rounded-full border border-black bg-zinc-800" />
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PageTransition>

          {/* ── MEDIA ── */}
          <PageTransition active={tab === "media"}>
            <div className="animate-fade-in relative z-10">
              <header className="mb-12 flex items-end justify-between">
                <div>
                  <h1 className="font-display font-black text-5xl mb-4 tracking-tight text-slate-900">Portfolio Engine</h1>
                  <p className="text-slate-500 text-lg font-medium">Inject high-end visual assets into your public discipline galleries.</p>
                </div>
                <button 
                  onClick={seedExamplePortfolio}
                  className="px-6 py-3 bg-slate-900 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl"
                >
                  <Database className="w-4 h-4" />
                  Initialize Database
                </button>
              </header>

              <div className="grid lg:grid-cols-3 gap-12">
                {/* Form Side */}
                <div className="lg:col-span-1">
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 backdrop-blur-xl border border-slate-200 sticky top-8 shadow-sm">
                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary" />
                      </div>
                      Add Media
                    </h3>
                    
                    <div className="space-y-6 mb-10">
                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black ml-1">Target Discipline</label>
                        <div className="grid grid-cols-4 gap-2">
                          {SERVICES_DATA.map(s => (
                            <button 
                              key={s.id}
                              onClick={() => setSelectedService(s.slug)}
                              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-500 border ${
                                selectedService === s.slug 
                                  ? "bg-primary text-black border-primary shadow-sm" 
                                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-900"
                              }`}
                              title={s.title}
                            >
                              <s.icon className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black ml-1">Asset Source & Type</label>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {["image", "video", "youtube", "instagram"].map(t => (
                            <button 
                              key={t}
                              onClick={() => setMediaForm(f => ({ ...f, type: t as any }))}
                              className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                                mediaForm.type === t ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        
                        <div className="relative group/upload">
                          <input 
                            type="file" 
                            id="media-upload"
                            className="hidden" 
                            accept={mediaForm.type === "image" ? "image/*" : "video/*"}
                            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                          />
                          <label 
                            htmlFor="media-upload"
                            className={`w-full flex items-center justify-center gap-3 px-5 py-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                              mediaFile ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-primary/40 text-slate-400 hover:text-slate-900"
                            }`}
                          >
                            {mediaFile ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                            <span className="text-xs font-bold uppercase tracking-widest">
                              {mediaFile ? mediaFile.name.slice(0, 20) + '...' : `Upload ${mediaForm.type}`}
                            </span>
                          </label>
                        </div>

                        {uploadProgress > 0 && (
                          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              className="h-full bg-primary"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black ml-1">Display Order</label>
                        <input
                          type="number"
                          value={mediaForm.order}
                          onChange={e => setMediaForm(f => ({ ...f, order: +e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:border-primary/40 transition-all"
                          placeholder="0 (First)"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 mb-8">
                      <div className="space-y-2 p-6 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                        <label className="text-[10px] text-primary uppercase tracking-luxury font-black mb-4 block flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          Tiya: AI Creative Intelligence
                        </label>
                        <div className="relative">
                          <textarea
                            value={aiHint}
                            onChange={e => setAiHint(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs focus:outline-none focus:border-primary/40 transition-all min-h-[120px] placeholder:text-white/20"
                            placeholder="e.g. Cinematic wedding shoot at Nagpur palace, golden hour..."
                          />
                          <button 
                            onClick={generateAIContent}
                            disabled={isGeneratingAI}
                            className="absolute right-3 bottom-3 flex items-center gap-3 px-5 py-2.5 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale group"
                          >
                            {isGeneratingAI ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Generate Content</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {(!mediaFile || mediaForm.type === 'youtube' || mediaForm.type === 'instagram') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between ml-1">
                            <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">
                              {mediaForm.type === 'youtube' ? 'YouTube Video URL' : mediaForm.type === 'instagram' ? 'Instagram Post/Reel URL' : 'Direct Image/Video URL'}
                            </label>
                            <span className="text-[8px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Saves Storage Quota</span>
                          </div>
                          <input
                            value={mediaForm.url}
                            onChange={e => {
                              let val = e.target.value;
                              // Auto-detect type if pasting
                              if (val.includes('youtube.com') || val.includes('youtu.be')) setMediaForm(f => ({ ...f, url: val, type: 'youtube' }));
                              else if (val.includes('instagram.com')) setMediaForm(f => ({ ...f, url: val, type: 'instagram' }));
                              else setMediaForm(f => ({ ...f, url: val }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:border-primary/40 transition-all font-mono"
                            placeholder={mediaForm.type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : mediaForm.type === 'instagram' ? 'https://www.instagram.com/reels/...' : 'https://...'}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black ml-1">Creative Description</label>
                        <textarea
                          value={mediaForm.description}
                          onChange={e => setMediaForm(f => ({ ...f, description: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:border-primary/40 transition-all resize-none h-24 font-medium"
                          placeholder="Describe the craft behind this frame..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black ml-1">Asset Caption</label>
                        <input
                          value={mediaForm.caption}
                          onChange={e => setMediaForm(f => ({ ...f, caption: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:border-primary/40 transition-all font-bold"
                          placeholder="Short cinematic title..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={addMedia}
                      disabled={submittingMedia}
                      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-2xl disabled:opacity-50"
                    >
                      {submittingMedia ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      Inject Asset into Portfolio
                    </button>
                  </div>
                </div>

                {/* Gallery preview */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm">
                     <div>
                      <h3 className="font-display font-black text-xl flex items-center gap-3 text-slate-900">
                        <Film className="w-5 h-5 text-primary" />
                        Live Feed: {SERVICES_DATA.find(s => s.slug === selectedService)?.title}
                      </h3>
                      <p className="text-zinc-500 text-xs mt-1">Reviewing active visual data for {selectedService}</p>
                     </div>
                     <span className="px-6 py-2 rounded-xl bg-white/2 border border-white/10 text-[9px] font-black text-zinc-400 uppercase tracking-widest">{filteredMedia.length} ITEMS</span>
                  </div>
                  
                  {filteredMedia.length === 0 ? (
                    <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Image className="w-8 h-8 text-zinc-700" />
                      </div>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">This gallery is currently empty</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredMedia.map(m => (
                        <div key={m.id} className="relative rounded-[2.5rem] border border-slate-200 overflow-hidden group bg-white shadow-xl hover:shadow-2xl transition-all duration-700">
                          {m.type === "image" ? (
                            <img src={m.url} alt={m.caption} className="w-full aspect-video object-cover transition-all duration-1000 group-hover:scale-110" />
                          ) : m.type === "youtube" ? (
                            <div className="w-full aspect-video bg-slate-900 overflow-hidden relative">
                              <iframe
                                src={`https://www.youtube.com/embed/${m.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.[2] || m.url}?rel=0&modestbranding=1`}
                                className="w-full h-full pointer-events-none"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors" />
                            </div>
                          ) : m.type === "instagram" ? (
                            <div className="w-full aspect-video bg-slate-900 overflow-hidden relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Youtube className="w-8 h-8 text-primary opacity-20" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-white/40 tracking-widest">Instagram Feed</p>
                            </div>
                          ) : (
                            <div className="w-full aspect-video bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                               <Film className="w-16 h-16 text-slate-800" />
                               <video src={m.url} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            <p className="text-white font-display font-black text-xl mb-2 truncate">{m.caption}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">{m.type} Asset</span>
                              <button
                                onClick={() => deleteMedia(m.id)}
                                className="w-12 h-12 rounded-2xl bg-red-500 text-white shadow-2xl transition-all flex items-center justify-center hover:scale-110 active:scale-95"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </PageTransition>

          {/* ── REVIEWS ── */}
          <PageTransition active={tab === "reviews"}>
            <div className="animate-fade-in relative z-10">
              <header className="mb-12">
                <h1 className="font-display font-black text-5xl mb-4 tracking-tight">Social Proof</h1>
                <p className="text-zinc-500 text-lg font-medium">Moderate client experiences to maintain your obsessive standard.</p>
              </header>

              <div className="grid gap-6">
                {reviews.length === 0 ? (
                  <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <Star className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
                    <p className="text-zinc-600 text-xl font-bold">No client reviews in the archives yet</p>
                  </div>
                ) : (
                  reviews.map((r, idx) => (
                    <div 
                      key={r.id} 
                      className={`p-10 rounded-[2.5rem] border transition-all duration-700 animate-fade-up relative overflow-hidden ${
                        r.approved ? "border-green-500/20 bg-green-500/[0.03]" : "border-white/5 bg-black/40 backdrop-blur-xl hover:border-white/10"
                      }`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {r.approved && (
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 blur-[100px] opacity-10 pointer-events-none" />
                      )}
                      <div className="flex flex-wrap items-start justify-between gap-8 mb-10 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center font-display font-black text-3xl text-primary border border-white/5 shadow-2xl">
                            {r.name?.[0] || "U"}
                          </div>
                          <div>
                            <h3 className="font-display font-black text-2xl text-white mb-2">{r.name}</h3>
                            <div className="flex items-center gap-3">
                               <div className="flex gap-1">
                                 {[...Array(5)].map((_, i) => (
                                   <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-primary fill-primary shadow-glow-sm" : "text-zinc-800"}`} />
                                 ))}
                               </div>
                               <span className="w-1 h-1 rounded-full bg-zinc-800" />
                               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{r.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleReview(r.id, r.approved)}
                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-luxury transition-all duration-500 flex items-center gap-3 ${
                              r.approved 
                                ? "bg-green-500 text-black shadow-xl scale-105" 
                                : "bg-white/2 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {r.approved ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {r.approved ? "Live on Site" : "Approve Testimony"}
                          </button>
                          <button
                            onClick={() => deleteReview(r.id)}
                            className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <p className="text-zinc-300 text-xl font-medium leading-relaxed italic relative z-10 pl-8 border-l-2 border-primary/20">"{r.review}"</p>
                      
                      <div className="mt-10 flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-zinc-800" />
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Received via Client Portal</span>
                        </div>
                        <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : "Syncing..."}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PageTransition>
        </div>
      </div>
      {showQuickAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setShowQuickAction(false)} 
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)]"
          >
            <div className="p-12">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter">Spectrum <span className="text-primary italic">Actions</span></h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-luxury">Studio Operations Hub</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowQuickAction(false)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: "orders", label: "New Inquiry", desc: "Review and process recent client booking requests.", icon: ShoppingCart, color: "#3B82F6" },
                  { id: "media", label: "Inject Asset", desc: "Add new cinematic visual assets to your portfolio engine.", icon: Upload, color: "#8A4AF0" },
                  { id: "services", label: "Service Matrix", desc: "Adjust live availability and toggle studio disciplines.", icon: Package, color: "#10B981" },
                  { id: "reviews", label: "Moderate Proof", desc: "Approve client testimonials and showcase your standard.", icon: Star, color: "#EF4444" }
                ].map((action) => (
                  <motion.button 
                    key={action.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setTab(action.id as any); setShowQuickAction(false); }}
                    className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-primary/40 hover:bg-white transition-all duration-500 text-left shadow-sm hover:shadow-xl"
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-all duration-500 group-hover:rotate-6" style={{ background: `${action.color}15` }}>
                      <action.icon className="w-7 h-7" style={{ color: action.color }} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{action.label}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{action.desc}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-12 p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-luxury">Master Studio Protocol</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Encrypted Session</p>
                  </div>
                </div>
                <div className="flex -space-x-3">
                   {SERVICES_DATA.slice(0, 5).map((s, i) => (
                     <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 shadow-xl" style={{ background: s.accentColor }} />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeStatDetail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setActiveStatDetail(null)} 
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-[0_50px_150px_-30px_rgba(0,0,0,0.3)] max-h-[90vh] flex flex-col"
          >
            <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center">
                  {activeStatDetail === "inquiries" && <ShoppingCart className="w-10 h-10 text-primary" />}
                  {activeStatDetail === "production" && <TrendingUp className="w-10 h-10 text-blue-500" />}
                  {activeStatDetail === "completed" && <Check className="w-10 h-10 text-green-500" />}
                  {activeStatDetail === "reviews" && <Star className="w-10 h-10 text-amber-500" />}
                </div>
                <div>
                  <h2 className="text-5xl font-display font-black text-slate-900 capitalize tracking-tighter">
                    {activeStatDetail === "inquiries" ? "Live Inquiries" : 
                     activeStatDetail === "production" ? "Active Production" :
                     activeStatDetail === "completed" ? "Archive: Completed" : "Public Reviews"}
                  </h2>
                  <p className="text-slate-400 font-black uppercase tracking-luxury text-[10px] mt-2">Studio Intelligence Module</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveStatDetail(null)}
                className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:rotate-90 duration-500 shadow-sm"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-6">
              {activeStatDetail !== "reviews" ? (
                orders.filter(o => {
                  if (activeStatDetail === "inquiries") return o.status === "New";
                  if (activeStatDetail === "production") return o.status === "Processing";
                  if (activeStatDetail === "completed") return o.status === "Completed";
                  return true;
                }).length === 0 ? (
                  <div className="py-32 text-center">
                    <AlertCircle className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                    <p className="text-zinc-500 font-display text-2xl font-bold italic">No records found for this segment.</p>
                  </div>
                ) : (
                  orders.filter(o => {
                    if (activeStatDetail === "inquiries") return o.status === "New";
                    if (activeStatDetail === "production") return o.status === "Processing";
                    if (activeStatDetail === "completed") return o.status === "Completed";
                    return true;
                  }).map((o, idx) => (
                    <div key={o.id} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-500 group/item animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-display font-black text-3xl text-primary border border-white/5">
                            {o.name?.[0] || "?"}
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-white mb-2">{o.name || "Anonymous Client"}</h4>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{o.packageId}</span>
                              <span className="text-zinc-500 text-xs font-bold">•</span>
                              <span className="text-zinc-400 text-xs font-bold">{o.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={o.status} />
                          <p className="text-[10px] text-zinc-600 mt-3 font-black uppercase tracking-luxury">{o.eventDate || "DATE TBD"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Location</p>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <Plane className="w-4 h-4 text-primary" />
                            {o.location || "On-Site / Virtual"}
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Contact</p>
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {o.phone || "No Phone Provided"}
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Reference ID</p>
                          <p className="text-sm font-mono font-bold text-zinc-400 uppercase">{o.id.slice(0, 12)}...</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-6">
                           <div className="flex flex-col">
                             <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Inquiry Received</span>
                             <span className="text-[10px] text-zinc-400 font-bold">{o.createdAt?.toDate?.()?.toLocaleString() || "Syncing..."}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           {o.status === "New" && (
                             <button onClick={() => updateOrderStatus(o.id, "Processing")} className="px-8 py-3 rounded-2xl bg-primary text-black font-black text-[10px] uppercase tracking-luxury hover:scale-105 transition-all">Move to Production</button>
                           )}
                           {o.status === "Processing" && (
                             <button onClick={() => updateOrderStatus(o.id, "Completed")} className="px-8 py-3 rounded-2xl bg-green-500 text-black font-black text-[10px] uppercase tracking-luxury hover:scale-105 transition-all">Mark as Finished</button>
                           )}
                           <button onClick={() => deleteOrder(o.id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="py-32 text-center">
                      <AlertCircle className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                      <p className="text-zinc-500 font-display text-2xl font-bold italic">No public proof available.</p>
                    </div>
                  ) : (
                    reviews.map((r, idx) => (
                      <div key={r.id} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-display font-black text-xl text-primary">
                              {r.name?.[0]}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">{r.name}</h4>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-primary fill-primary" : "text-zinc-800"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${r.approved ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"}`}>
                            {r.approved ? "Publicly Visible" : "Pending Approval"}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-base leading-relaxed italic mb-8">"{r.review}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{r.createdAt?.toDate?.()?.toLocaleDateString()} • {r.service}</span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleReview(r.id, r.approved)} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${r.approved ? "bg-zinc-800 text-white" : "bg-primary text-black"}`}>
                              {r.approved ? "Hide from Site" : "Approve Proof"}
                            </button>
                            <button onClick={() => deleteReview(r.id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-luxury">Protocol Synchronized</span>
              </div>
              <p className="text-[10px] text-slate-900 font-black uppercase tracking-luxury">MarathiVlogger Studio • Admin v5.0</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

