import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSecurity } from "@/hooks/useSecurity";
import { Star, ArrowRight, CheckCircle2, Camera, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";

const services = [
  "Wedding Cinematography",
  "Pre-Wedding Film",
  "Commercial / Brand Film",
  "Corporate Event",
  "Social Media Reels",
  "Destination Wedding",
  "Other",
];

import { BackButton } from "@/components/BackButton";
import { TechBackground } from "@/components/TechBackground";

const Review = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { assertOwnership, logActivity } = useSecurity();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    service: "",
    review: "",
  });

  // Auto-fill user info if signed in
  useEffect(() => {
    if (isSignedIn && user) {
      setForm(prev => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
      }));
    }
  }, [isSignedIn, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!rating) {
      toast.error("Please select a star rating before submitting.");
      return;
    }
    if (!form.name || !form.review || !form.service) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Verify session ownership before writing
    const owned = await assertOwnership(user.id, "Review submit");
    if (!owned) {
      toast.error("Security validation failed. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "reviews"), {
        // userId is ALWAYS from the Clerk session — never from form input
        userId: user.id,
        name: form.name,
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl || "",
        location: form.location || form.service,
        service: form.service,
        review: form.review,
        rating,
        approved: true,
        createdAt: serverTimestamp(),
      });
      await logActivity("REVIEW_SUBMITTED", { service: form.service, rating });
      setSubmitted(true);
    } catch (error: any) {
      console.error("Firebase write error:", error);
      if (error?.code === "permission-denied") {
        toast.error(
          "Database permission error. Please update Firestore Rules in Firebase Console to allow writes.",
          { duration: 8000 }
        );
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <TechBackground />
        <BackButton />
        <div className="glass-premium p-10 md:p-16 rounded-sm text-center max-w-xl w-full border border-primary/20 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full" />
          <div className="relative z-10 space-y-6">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto animate-breathe">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-luxury text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Review Submitted
            </div>
            <h1 className="text-4xl font-display font-bold text-white">Thank You!</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Your review has been successfully saved. It will appear on our website shortly and help future clients trust us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-sm hover:shadow-btn transition-all duration-300"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <TechBackground />
      <BackButton />
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-black to-obsidian opacity-60" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 container max-w-2xl py-24 px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="w-16 h-16 bg-gradient-gold flex items-center justify-center shadow-gold rounded-sm mx-auto mb-8"
            style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
          >
            <Camera className="w-7 h-7 text-obsidian" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-luxury text-primary mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Client Testimonial
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
            Share Your <br />
            <span className="italic text-gradient-gold">Experience</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-md mx-auto">
            Your story inspires others. Tell the world about your experience with MarathiVlogger Studios.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-premium rounded-sm p-8 md:p-12 border border-primary/20 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 blur-[60px] rounded-full pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            {/* Signed In State Indicator */}
            <SignedIn>
              <div className="flex items-center gap-3 p-4 rounded-sm bg-primary/5 border border-primary/20 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} className="w-full h-full rounded-full object-cover" alt="User" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-luxury">Posting as</p>
                  <p className="text-sm text-foreground font-medium">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="p-6 rounded-sm bg-obsidian/40 border border-primary/20 text-center mb-4">
                <p className="text-sm text-muted-foreground mb-4 font-medium italic">
                  "Please sign in to share your experience with the studio."
                </p>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary text-[11px] uppercase tracking-luxury font-bold hover:bg-primary/20 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Review
                </button>
              </div>
            </SignedOut>

            {/* Star Rating */}
            <div className="text-center">
              <label className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium block mb-5">
                How would you rate us? *
              </label>
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-all duration-200 hover:scale-125"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= (hovered || rating)
                          ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                          : "text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-primary text-sm mt-3 tracking-wide font-medium">
                  {["", "Needs Improvement", "Fair", "Good", "Very Good", "Outstanding!"][rating]}
                </p>
              )}
            </div>

            <div className="h-px bg-primary/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="review-name" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium">
                  Your Name *
                </label>
                <input
                  id="review-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Riya & Arnav Sharma"
                  className="w-full bg-background/40 border border-primary/20 rounded-sm px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 focus:bg-background/60 transition-all duration-300 text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="review-email" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium">
                  Email Address
                </label>
                <input
                  id="review-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full bg-background/40 border border-primary/20 rounded-sm px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 focus:bg-background/60 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="review-location" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium">
                  Location / Event City
                </label>
                <input
                  id="review-location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Wedding · Udaipur"
                  className="w-full bg-background/40 border border-primary/20 rounded-sm px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 focus:bg-background/60 transition-all duration-300 text-sm"
                />
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label htmlFor="review-service" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium">
                  Service Availed *
                </label>
                <select
                  id="review-service"
                  name="service"
                  required
                  value={form.service}
                  onChange={handleChange}
                  className="w-full bg-background/40 border border-primary/20 rounded-sm px-5 py-4 text-white focus:outline-none focus:border-primary/60 transition-all duration-300 text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-900">Select a service...</option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-zinc-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label htmlFor="review-text" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-medium">
                Your Review *
              </label>
              <textarea
                id="review-text"
                name="review"
                required
                value={form.review}
                onChange={handleChange}
                rows={5}
                maxLength={500}
                placeholder="Tell others about your experience — the emotions, the quality, the team..."
                className="w-full bg-background/40 border border-primary/20 rounded-sm px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 focus:bg-background/60 transition-all duration-300 text-sm resize-none"
              />
              <div className="text-right text-xs text-zinc-600">{form.review.length} / 500</div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-sm cursor-pointer shadow-btn hover:shadow-glow transition-all duration-700 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-gold" />
              <div className="relative px-8 py-5 flex items-center justify-center gap-3 bg-obsidian m-[2px] rounded-[2px] transition-colors duration-500 group-hover:bg-transparent">
                <span className="font-display font-bold text-xl text-gradient-gold group-hover:text-primary-foreground tracking-wide transition-colors duration-500">
                  {loading ? "Submitting..." : (isSignedIn ? "Submit My Review" : "Sign In to Submit")}
                </span>
                {!loading && (
                  <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:translate-x-1" />
                )}
              </div>
            </button>

            <p className="text-center text-[11px] text-zinc-600 tracking-wide">
              Your review will appear on our homepage to help future clients.
            </p>
          </form>
        </div>
      </div>
      
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Review;
