import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * ProtectedRoute — enforces authentication for any wrapped route.
 * - Redirects unauthenticated users to home with `redirectTo` state so
 *   they can be sent back after sign-in.
 * - Detects and blocks suspicious route-tampering attempts (e.g. manually
 *   changing /profile?userId=xxx).
 * - Works in tandem with strict Firestore rules so even if someone bypasses
 *   the UI guard, the backend will reject the request.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();
  const attemptCountRef = useRef(0);

  // Detect URL parameter tampering — strip any userId/uid params from URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const suspiciousParams = ["userId", "uid", "user_id", "id", "clerkId"];
    let tampered = false;

    suspiciousParams.forEach((p) => {
      if (url.searchParams.has(p)) {
        url.searchParams.delete(p);
        tampered = true;
      }
    });

    if (tampered) {
      // Silently clean the URL and log the attempt
      window.history.replaceState({}, "", url.pathname);
      attemptCountRef.current += 1;
      console.warn(
        `[Security] Suspicious URL param detected and stripped. Attempt #${attemptCountRef.current}`
      );
    }
  }, [location]);

  // Still loading Clerk session
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-1">
            Verifying Identity
          </p>
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest">
            Secure session validation in progress
          </p>
        </div>
      </div>
    );
  }

  // Not signed in — redirect to home and remember intended destination
  if (!isSignedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ redirectTo: location.pathname, reason: "auth_required" }}
      />
    );
  }

  // Signed in — render children. Firestore rules enforce the actual data isolation.
  return (
    <motion.div
      key={user.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * SecurityBadge — small visual indicator showing the current user's
 * identity is verified. Can be placed in any protected page header.
 */
export const SecurityBadge = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] uppercase tracking-widest text-green-400 font-black">
      <ShieldCheck className="w-3 h-3" />
      Verified · {user.id.slice(0, 8)}…
    </div>
  );
};

export default ProtectedRoute;
