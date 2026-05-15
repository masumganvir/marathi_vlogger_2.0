import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_EMAILS = [
  "masumganvir2006@gmail.com",
  "marathivloggerstudio@gmail.com",
  "masumganvir18@gmail.com"
];

export const useSecurity = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Audit Log Helper
  const logActivity = async (action: string, metadata: any = {}) => {
    if (!isSignedIn || !user) return;
    
    try {
      await addDoc(collection(db, "audit_logs"), {
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress,
        action,
        metadata,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        path: window.location.pathname
      });
    } catch (e) {
      console.error("Audit log failed:", e);
    }
  };

  // Session Timeout (Inactivity check)
  useEffect(() => {
    let timeout: any;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isSignedIn) {
          console.warn("Session timeout due to inactivity");
          signOut();
        }
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearTimeout(timeout);
    };
  }, [isSignedIn, signOut]);

  return { logActivity };
};
