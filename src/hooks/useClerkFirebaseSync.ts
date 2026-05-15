import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

/**
 * Syncs authenticated Clerk user data into Firestore.
 * Called once on auth state change. Uses `merge: true` so
 * existing data (e.g. reviews, bookings) is never overwritten.
 */
export function useClerkFirebaseSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUser = async () => {
      const userRef = doc(db, "users", user.id);
      
      try {
        await setDoc(userRef, {
          clerkId: user.id,
          fullName: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          imageUrl: user.imageUrl || "",
          username: user.username || "",
          phoneNumbers: user.phoneNumbers?.map((p) => p.phoneNumber) ?? [],
          lastSignInAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        
        console.log("[Sync] User data persisted to Firestore");

        // Show success toast only once per session/login
        if (!sessionStorage.getItem(`synced_${user.id}`)) {
          toast.success(`Welcome back, ${user.firstName || "Studio Member"}!`, {
            description: "Your session is secured and synchronized.",
          });
          sessionStorage.setItem(`synced_${user.id}`, "true");
        }
      } catch (err) {
        console.error("[Sync] Failed:", err);
      }
    };

    syncUser();
  }, [isSignedIn, user]);
}
