import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

type Mode = "signin" | "signup" | "verify";

interface AuthModalProps {
  onClose: () => void;
}

/* ─────────── helpers ─────────── */
const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  rightEl,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  rightEl?: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[10px] uppercase tracking-luxury text-muted-foreground font-semibold">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-obsidian/60 border border-primary/20 rounded-sm pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
      />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  </div>
);

/* ─────────── main component ─────────── */
const AuthModal = ({ onClose }: AuthModalProps) => {
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();

  const [mode, setMode] = useState<Mode>("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [otp, setOtp]             = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [resendCooldown, setResendCooldown] = useState(false);

  /* ── sync user to Firestore ── */
  const syncToFirestore = async (userId: string, data: {
    email: string; firstName: string; lastName: string;
    fullName: string; imageUrl: string;
  }) => {
    try {
      await setDoc(
        doc(db, "users", userId),
        {
          clerkId: userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: data.fullName,
          imageUrl: data.imageUrl,
          syncedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("[Firestore sync]", e);
    }
  };

  /* ── sign in ── */
  const handleSignIn = async () => {
    if (!signIn) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        onClose();
      } else {
        setError("Sign-in incomplete. Please try again.");
      }
    } catch (e: unknown) {
      const err = e as { errors?: { message: string }[] };
      setError(err?.errors?.[0]?.message ?? "Sign-in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ── sign up (step 1 — submit form) ── */
  const handleSignUp = async () => {
    if (!signUp) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });
      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setMode("verify");
    } catch (e: any) {
      console.error("[Clerk SignUp Error]", e);
      // Handle the common "Error loading CAPTCHA" or Turnstile block
      if (e.errors?.[0]?.code === "captcha_invalid" || e.message?.includes("CAPTCHA")) {
        setError("Bot protection (CAPTCHA) blocked the request. Please refresh the page or disable 'Bot Protection' in your Clerk Dashboard.");
      } else {
        setError(e.errors?.[0]?.message ?? "Sign-up failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── verify OTP (step 2) ── */
  const handleVerify = async () => {
    if (!signUp) return;
    setLoading(true);
    setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otp });
      if (result.status === "complete") {
        // Sync user to Firestore
        const userId = result.createdUserId!;
        console.log("[AuthModal] Syncing user to Firestore:", userId);
        
        await syncToFirestore(userId, {
          email,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          imageUrl: userId
            ? `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`
            : "",
        });

        await setSignUpActive({ session: result.createdSessionId });
        onClose();
        window.location.href = "/profile"; // Force redirect to profile to see data
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (e: any) {
      console.error("[Clerk Verify Error]", e);
      setError(e.errors?.[0]?.message ?? "Invalid code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };


  /* ── resend OTP ── */
  const handleResend = async () => {
    if (!signUp || resendCooldown) return;
    setResendCooldown(true);
    setError("");
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (e: unknown) {
      const err = e as { errors?: { message: string }[] };
      setError(err?.errors?.[0]?.message ?? "Failed to resend. Try again.");
    }
    setTimeout(() => setResendCooldown(false), 30000);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setOtp("");
  };

  /* ─────────── UI ─────────── */
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-charcoal via-obsidian to-charcoal border border-primary/20 rounded-sm shadow-elegant overflow-hidden">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary-deep/10 blur-[80px]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 bg-gradient-gold flex items-center justify-center shadow-gold"
              style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)" }}
            >
              <span className="font-display font-black text-obsidian text-xl leading-none">M</span>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-foreground">MarathiVlogger</div>
              <div className="text-[9px] tracking-luxury text-primary font-semibold">STUDIO · MEMBER PORTAL</div>
            </div>
          </div>

          {/* ── Sign In ── */}
          {mode === "signin" && (
            <>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Welcome Back</h2>
              <p className="text-sm text-muted-foreground mb-7">Sign in to your studio account</p>

              <div className="space-y-4">
                <InputField id="si-email" label="Email Address" type="email" value={email}
                  onChange={setEmail} placeholder="you@example.com" icon={Mail} />
                <InputField id="si-password" label="Password" type={showPw ? "text" : "password"}
                  value={password} onChange={setPassword} placeholder="••••••••" icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="text-muted-foreground hover:text-primary transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">
                  {error}
                </p>
              )}

              <button
                id="auth-signin-submit"
                onClick={handleSignIn}
                disabled={loading || !email || !password}
                className="mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-gold text-obsidian font-semibold text-[11px] uppercase tracking-luxury rounded-sm hover:shadow-gold hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/10"></div>
                </div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold">
                  <span className="bg-obsidian px-4 text-muted-foreground/50">Or Continue With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signIn?.authenticateWithRedirect({ 
                    strategy: "oauth_google", 
                    redirectUrl: "/sso-callback", 
                    redirectUrlComplete: window.location.pathname 
                  })}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-primary/20 bg-primary/5 rounded-sm hover:bg-primary/10 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold tracking-luxury">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => signIn?.authenticateWithRedirect({ 
                    strategy: "oauth_facebook", 
                    redirectUrl: "/sso-callback", 
                    redirectUrlComplete: window.location.pathname 
                  })}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-primary/20 bg-primary/5 rounded-sm hover:bg-primary/10 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold tracking-luxury">Facebook</span>
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                No account?{" "}
                <button onClick={() => switchMode("signup")}
                  className="text-primary hover:underline font-semibold">
                  Create one
                </button>
              </p>
            </>
          )}

          {/* ── Sign Up ── */}
          {mode === "signup" && (
            <>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Create Account</h2>
              <p className="text-sm text-muted-foreground mb-7">Join the MarathiVlogger Studio family</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField id="su-fname" label="First Name" value={firstName}
                    onChange={setFirstName} placeholder="Masum" icon={User} />
                  <InputField id="su-lname" label="Last Name" value={lastName}
                    onChange={setLastName} placeholder="Ganvir" icon={User} />
                </div>
                <InputField id="su-email" label="Email Address" type="email" value={email}
                  onChange={setEmail} placeholder="you@example.com" icon={Mail} />
                <InputField id="su-password" label="Password" type={showPw ? "text" : "password"}
                  value={password} onChange={setPassword} placeholder="Min. 8 characters" icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="text-muted-foreground hover:text-primary transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">
                  {error}
                </p>
              )}

              <button
                id="auth-signup-submit"
                onClick={handleSignUp}
                disabled={loading || !email || !password || !firstName}
                className="mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-gold text-obsidian font-semibold text-[11px] uppercase tracking-luxury rounded-sm hover:shadow-gold hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/10"></div>
                </div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold">
                  <span className="bg-obsidian px-4 text-muted-foreground/50">Or Register With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => signUp?.authenticateWithRedirect({ 
                    strategy: "oauth_google", 
                    redirectUrl: "/sso-callback", 
                    redirectUrlComplete: window.location.pathname 
                  })}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-primary/20 bg-primary/5 rounded-sm hover:bg-primary/10 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold tracking-luxury">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => signUp?.authenticateWithRedirect({ 
                    strategy: "oauth_facebook", 
                    redirectUrl: "/sso-callback", 
                    redirectUrlComplete: window.location.pathname 
                  })}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-primary/20 bg-primary/5 rounded-sm hover:bg-primary/10 transition-all duration-300 group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold tracking-luxury">Facebook</span>
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already a member?{" "}
                <button onClick={() => switchMode("signin")}
                  className="text-primary hover:underline font-semibold">
                  Sign In
                </button>
              </p>
            </>
          )}

          {/* ── Email Verification (OTP) ── */}
          {mode === "verify" && (
            <>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1">Check Your Email</h2>
              <p className="text-sm text-muted-foreground mb-2">
                We sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-primary mb-7 break-all">{email}</p>

              <div className="space-y-2">
                <label htmlFor="otp" className="text-[10px] uppercase tracking-luxury text-muted-foreground font-semibold">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full bg-obsidian/60 border border-primary/20 rounded-sm px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              {error && (
                <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">
                  {error}
                </p>
              )}

              <button
                id="auth-verify-submit"
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-gold text-obsidian font-semibold text-[11px] uppercase tracking-luxury rounded-sm hover:shadow-gold hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                Didn't get the code?
                <button
                  onClick={handleResend}
                  disabled={resendCooldown}
                  className="flex items-center gap-1 text-primary hover:underline font-semibold disabled:opacity-40 disabled:no-underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendCooldown ? "Resent!" : "Resend"}
                </button>
              </div>

              <button
                onClick={() => switchMode("signup")}
                className="mt-3 w-full text-center text-xs text-muted-foreground/60 hover:text-primary transition-colors"
              >
                ← Use a different email
              </button>
            </>
          )}

          {/* Security badge */}
          <div className="mt-8 pt-5 border-t border-primary/10 flex items-center justify-center gap-2 text-[9px] tracking-luxury text-muted-foreground/50 uppercase font-medium">
            <ShieldCheck className="w-3 h-3 text-primary/40" />
            Secured by Clerk · Data encrypted in Firestore
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
