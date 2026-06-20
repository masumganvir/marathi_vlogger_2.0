import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useRef, useCallback } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const ADMIN_EMAILS = [
  "marathivloggerstudio@gmail.com",
];

/** Routes that require authentication */
const PROTECTED_ROUTES = ["/profile", "/booking", "/review", "/thank-you"];

/** Inactivity timeout: 30 minutes */
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

/** Rate-limit: max suspicious actions before forced sign-out */
const MAX_SUSPICIOUS_ACTIONS = 5;

export const useSecurity = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const suspiciousCountRef = useRef(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Audit Log ─────────────────────────────────────────────────────────────
  const logActivity = useCallback(
    async (action: string, metadata: Record<string, unknown> = {}) => {
      if (!isSignedIn || !user) return;
      try {
        await addDoc(collection(db, "audit_logs"), {
          userId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress ?? "unknown",
          action,
          metadata,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          path: window.location.pathname,
          ip: "client-side", // real IP is only available server-side
        });
      } catch (e) {
        // Fail silently — audit log should never break the app
        console.error("[Security] Audit log write failed:", e);
      }
    },
    [isSignedIn, user]
  );

  // ── Forced Sign-out on Suspicious Activity ────────────────────────────────
  const flagSuspicious = useCallback(
    async (reason: string) => {
      suspiciousCountRef.current += 1;
      console.warn(`[Security] Suspicious activity: ${reason} (count: ${suspiciousCountRef.current})`);
      await logActivity("SUSPICIOUS_ACTIVITY", { reason, count: suspiciousCountRef.current });

      if (suspiciousCountRef.current >= MAX_SUSPICIOUS_ACTIONS) {
        toast.error("Security alert: Unusual activity detected. You have been signed out.", {
          duration: 6000,
        });
        await signOut();
        navigate("/", { replace: true });
      }
    },
    [logActivity, signOut, navigate]
  );

  // ── Inactivity Session Timeout ────────────────────────────────────────────
  useEffect(() => {
    if (!isSignedIn) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(async () => {
        toast.info("Your session has expired due to inactivity. Please sign in again.");
        await logActivity("SESSION_TIMEOUT");
        await signOut();
        navigate("/", { replace: true });
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "pointerdown", "scroll", "touchstart", "message"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isSignedIn, signOut, logActivity, navigate]);

  // ── Route Access Control ──────────────────────────────────────────────────
  useEffect(() => {
    const isProtected = PROTECTED_ROUTES.some((r) =>
      location.pathname.startsWith(r)
    );

    if (isProtected && !isSignedIn) {
      // This is a UI-level backup — ProtectedRoute handles the redirect,
      // but we log the attempt here for auditing.
      logActivity("UNAUTHORIZED_ROUTE_ACCESS", { path: location.pathname });
    }
  }, [location.pathname, isSignedIn, logActivity]);

  // ── URL Parameter Tampering Detection ────────────────────────────────────
  useEffect(() => {
    const url = new URL(window.location.href);
    const dangerousParams = ["userId", "uid", "user_id", "clerkId"];
    let tampered = false;

    dangerousParams.forEach((p) => {
      if (url.searchParams.has(p)) {
        const val = url.searchParams.get(p);
        // Only flag if the param doesn't match the current user's id
        if (val !== user?.id) {
          url.searchParams.delete(p);
          tampered = true;
        }
      }
    });

    if (tampered) {
      window.history.replaceState({}, "", url.pathname);
      flagSuspicious(`URL param tampering on ${url.pathname}`);
    }
  }, [location, user?.id, flagSuspicious]);

  // ── Token Mismatch Detection (Clerk session integrity) ───────────────────
  useEffect(() => {
    if (!isSignedIn || !user) return;

    // Detect if the stored session user ID doesn't match Clerk's current user
    const storedId = sessionStorage.getItem("mv_session_uid");
    if (storedId && storedId !== user.id) {
      // Different user signed in during the same browser session
      flagSuspicious(`Session UID mismatch: stored=${storedId}, current=${user.id}`);
      sessionStorage.removeItem("mv_session_uid");
    } else {
      sessionStorage.setItem("mv_session_uid", user.id);
    }
  }, [isSignedIn, user, flagSuspicious]);

  // ── Prevent Access to Other Users' Data ──────────────────────────────────
  /**
   * Validates that a Firestore document belongs to the current user.
   * Use this before rendering any user-specific data.
   */
  const assertOwnership = useCallback(
    async (documentUserId: string, context: string): Promise<boolean> => {
      if (!isSignedIn || !user) return false;
      if (documentUserId !== user.id) {
        await flagSuspicious(`Ownership mismatch in ${context}: expected ${user.id}, got ${documentUserId}`);
        return false;
      }
      return true;
    },
    [isSignedIn, user, flagSuspicious]
  );

  return {
    logActivity,
    assertOwnership,
    flagSuspicious,
    isAdmin: ADMIN_EMAILS.includes(
      user?.primaryEmailAddress?.emailAddress ?? ""
    ),
  };
};
