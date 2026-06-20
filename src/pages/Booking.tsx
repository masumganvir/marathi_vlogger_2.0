import { useState, useEffect } from "react";
import { useClerkFirebaseSync } from "@/hooks/useClerkFirebaseSync";
import { useSecurity } from "@/hooks/useSecurity";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AuthModal from "@/components/AuthModal";
import { 
  ChevronRight, 
  Check, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Camera, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Loader2,
  Clock,
  User as UserIcon,
  Phone,
  Mail,
  Zap,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_2mn7ay9";
const TEMPLATE_USER = "template_7h27vhv";
const TEMPLATE_ADMIN = "template_pfthjao";
const PUBLIC_KEY = "hMikfIKXEVIBIESMP";

const packages = [
  { id: "starter", name: "Starter / Short Video Shoots", price: "Custom Price", description: "Customized for short shoots, reels, and mini projects. Price decided by admin." },
  { id: "basic", name: "Basic", price: "₹15,000", description: "Short-form coverage & social reels" },
  { id: "essence", name: "Essence", price: "₹85,000", description: "6 hours of coverage, 1 cinematographer" },
  { id: "signature", name: "Signature", price: "₹2,25,000", description: "Full day, 2 cinematographers, Drone" },
  { id: "heirloom", name: "Heirloom", price: "Custom", description: "3-day destination, 4-person crew" },
];

const steps = [
  { id: 1, label: "Selection", icon: Zap },
  { id: 2, label: "Details", icon: UserIcon },
  { id: 3, label: "Inquiry", icon: FileText },
  { id: 4, label: "Payment", icon: CreditCard },
];

import { BackButton } from "@/components/BackButton";
import { TechBackground } from "@/components/TechBackground";

const Booking = () => {
  useClerkFirebaseSync();
  const { user, isSignedIn } = useUser();
  const { assertOwnership, logActivity } = useSecurity();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [bookingData, setBookingData] = useState({
    packageId: "signature",
    eventDate: "",
    location: "",
    name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [user]);

  // Ensure Tally script re-scans when step 3 is active
  useEffect(() => {
    if (step === 3 && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, [step]);

  // Listen for Tally Submission and auto-advance to step 4
  useEffect(() => {
    const handleTallyMessage = (e: MessageEvent) => {
      if (typeof e.data === 'string' && e.data.includes('Tally.FormSubmitted')) {
        setStep(4);
        toast.success("Inquiry synced to CRM! Finalizing payment details...");
      }
    };
    window.addEventListener('message', handleTallyMessage);
    return () => window.removeEventListener('message', handleTallyMessage);
  }, []);

  // Load Tally script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleNext = () => {
    if (step === 2) {
      if (!isSignedIn) {
        setShowAuth(true);
        toast.info("Please sign in to save your booking details.");
        return;
      }

      if (bookingData.eventDate) {
        const selectedDate = new Date(bookingData.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          toast.error("Please enter a correct and valid future date.");
          return;
        }
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!isSignedIn || !user) {
      setShowAuth(true);
      return;
    }
    // Verify the session is still valid and belongs to the current user
    const owned = await assertOwnership(user.id, "Booking submit");
    if (!owned) {
      toast.error("Security validation failed. Please sign in again.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        // userId is ALWAYS taken from the Clerk session — never from form input
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress ?? "",
        packageId: bookingData.packageId,
        eventDate: bookingData.eventDate,
        location: bookingData.location,
        phone: bookingData.phone,
        notes: bookingData.notes,
        status: "Processing",
        type: "Direct Booking",
        createdAt: serverTimestamp(),
      });

      // Send automated emails via EmailJS
      const templateParams = {
        user_name: bookingData.name || "Client",
        user_email: user.primaryEmailAddress?.emailAddress || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        to_email: user.primaryEmailAddress?.emailAddress || "",
        reply_to: user.primaryEmailAddress?.emailAddress || "",
        user_phone: bookingData.phone || "Not Provided",
        budget: bookingData.packageId,
        event_type: "Direct Booking",
        destination: bookingData.location || "Not Provided",
        event_date: bookingData.eventDate || "Not Provided",
        event_details: bookingData.notes || "No additional notes",
        expectations: "N/A",
        admin_email: "marathivloggerstudio@gmail.com",
      };

      try {
        await Promise.all([
          emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, templateParams, { publicKey: PUBLIC_KEY }),
          emailjs.send(SERVICE_ID, TEMPLATE_USER, templateParams, { publicKey: PUBLIC_KEY }),
        ]);
        console.log("Automated emails sent successfully.");
      } catch (emailErr) {
        console.error("EmailJS Error:", emailErr);
        // We don't block the booking success if email fails, but we log it.
      }

      await logActivity("BOOKING_SUBMITTED", { packageId: bookingData.packageId });
      toast.success("Booking inquiry submitted! A confirmation email has been sent to you.");
      navigate("/thank-you");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = packages.find(p => p.id === bookingData.packageId);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 relative overflow-hidden">
      <TechBackground />
      <BackButton />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="container h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-gradient-gold flex items-center justify-center rounded-sm" style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}>
               <span className="text-obsidian font-black text-lg">M</span>
             </div>
             <span className="font-display font-bold tracking-luxury text-lg group-hover:text-primary transition-colors">CINEMATIC CHECKOUT</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
               <ShieldCheck className="w-4 h-4 text-primary" />
               Secure Booking Channel
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 container max-w-5xl">
        <div className="relative mb-16 px-4">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-800 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-700" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
          <div className="relative z-10 flex justify-between">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCurrent ? "bg-primary border-primary text-obsidian scale-110 shadow-glow" : isActive ? "bg-zinc-900 border-primary text-primary" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                    {isActive && !isCurrent ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`mt-3 text-[10px] uppercase tracking-widest font-bold ${isActive ? "text-primary" : "text-zinc-600"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold">1. Select Your Cinematic Tier</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {packages.map((p) => (
                    <button key={p.id} onClick={() => setBookingData({ ...bookingData, packageId: p.id })} className={`text-left p-6 rounded-sm border transition-all duration-500 relative overflow-hidden group ${bookingData.packageId === p.id ? "bg-primary/10 border-primary shadow-glow" : "bg-white/5 border-white/10 hover:border-primary/40"}`}>
                      {bookingData.packageId === p.id && <div className="absolute top-0 right-0 p-2"><Check className="w-4 h-4 text-primary" /></div>}
                      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{p.name}</h4>
                      <p className="text-xs text-zinc-500 mb-4 line-clamp-1">{p.description}</p>
                      <div className="text-xl font-display font-bold text-gradient-gold">{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold">2. Personal & Event Details</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Event Date</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={bookingData.eventDate} onChange={(e) => setBookingData({...bookingData, eventDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-sm focus:border-primary/60 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Event Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input type="text" placeholder="e.g. Nagpur or Gondia" value={bookingData.location} onChange={(e) => setBookingData({...bookingData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-4 text-sm focus:border-primary/60 focus:outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">WhatsApp / Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="tel" placeholder="+91 00000 00000" value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-4 text-sm focus:border-primary/60 focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold">3. Detailed Inquiry Sync</h2>
                </div>
                <div className="p-6 bg-primary/5 rounded-sm border border-primary/20 mb-4">
                   <p className="text-xs text-zinc-400 leading-relaxed mb-6">Please complete the detailed inquiry below. This form is synced with our **Google Sheets** for immediate processing.</p>
                   <div className="w-full min-h-[700px] bg-white/5 rounded-sm border border-white/10 relative overflow-visible">
                      <iframe src="https://tally.so/embed/9q6YJQ?alignLeft=1&hideTitle=1&transparentBackground=1" loading="lazy" width="100%" height="700" frameBorder="0" marginHeight={0} marginWidth={0} title="Cinematography Inquiry" className="rounded-sm" style={{ border: "none" }} />
                   </div>
                   <div className="mt-4 text-center">
                      <p className="text-[10px] text-zinc-600 mb-2">Can't see the form?</p>
                      <a href="https://tally.so/r/9q6YJQ" target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Open form in new window</a>
                   </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-display font-bold">4. Final Review & Payment</h2>
                </div>
                <div className="glass-premium p-8 rounded-sm border border-primary/20 space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] pointer-events-none" />
                   <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">Service Selected</span><span className="font-bold text-primary">{selectedPackage?.name} Tier</span></div>
                   <div className="flex items-center justify-between text-sm"><span className="text-zinc-500">Full Investment</span><span className="font-bold">{selectedPackage?.price}</span></div>
                   <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                      <span className="text-white font-bold uppercase tracking-widest text-[10px]">Booking Deposit (20%)</span>
                      <span className="text-2xl font-display font-bold text-gradient-gold">{selectedPackage?.id === "heirloom" ? "Custom" : `₹${(parseInt(selectedPackage?.price.replace(/[^\d]/g, "") || "0") * 0.2).toLocaleString()}`}</span>
                   </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                   <div className="p-4 border border-white/10 bg-white/5 rounded-sm"><h5 className="text-[10px] uppercase tracking-luxury text-primary font-bold mb-2">Google Sheets</h5><p className="text-[11px] text-zinc-500">Your details are now synced with our studio CRM for fast processing.</p></div>
                   <div className="p-4 border border-white/10 bg-white/5 rounded-sm"><h5 className="text-[10px] uppercase tracking-luxury text-primary font-bold mb-2">Confirmation</h5><p className="text-[11px] text-zinc-500">An automated confirmation email has been dispatched to {bookingData.email}.</p></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <button onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white transition-colors disabled:opacity-0"><ArrowLeft className="w-4 h-4" />Back</button>
              <button onClick={step === 4 ? handleSubmit : handleNext} disabled={loading || (step === 2 && (!bookingData.eventDate || !bookingData.location || !bookingData.phone))} className="flex items-center gap-3 px-10 py-5 bg-gradient-gold text-obsidian font-bold text-[11px] uppercase tracking-luxury rounded-full shadow-btn hover:shadow-gold hover:scale-[1.02] transition-all">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 4 ? "Complete Payment & Book" : "Next Step"}{!loading && <ChevronRight className="w-4 h-4" />}</button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-premium p-8 rounded-sm border border-white/10 sticky top-32">
               <h3 className="text-[10px] uppercase tracking-luxury text-primary font-bold mb-6">Booking Summary</h3>
               <div className="space-y-6">
                  <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><UserIcon className="w-4 h-4 text-zinc-400" /></div><div><p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Client</p><p className="text-sm font-medium text-white truncate max-w-[140px]">{bookingData.name || "Guest Account"}</p></div></div>
                  {bookingData.eventDate && (<div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-zinc-400" /></div><div><p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Event Date</p><p className="text-sm font-medium text-white">{bookingData.eventDate}</p></div></div>)}
                  <div className="pt-6 border-t border-white/10"><div className="flex justify-between items-center mb-2"><span className="text-xs text-zinc-500">Service</span><span className="text-xs font-bold text-white">{selectedPackage?.name}</span></div><div className="flex justify-between items-center"><span className="text-xs text-zinc-500">Investment</span><span className="text-xs font-bold text-primary">{selectedPackage?.price}</span></div></div>
                  <div className="pt-6 border-t border-white/10 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-primary" /></div><p className="text-[9px] text-zinc-500 font-medium">Automatic sync enabled with Google Sheets CRM.</p></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
