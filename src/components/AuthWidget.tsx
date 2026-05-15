import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useClerkFirebaseSync } from "@/hooks/useClerkFirebaseSync";
import { LogIn } from "lucide-react";
import AuthModal from "./AuthModal";

/**
 * Floating auth widget — shows a compact sign-in button when logged
 * out, or the Clerk UserButton avatar when signed in.
 * Uses a custom AuthModal for sign-in/sign-up/verification.
 */
const AuthWidget = () => {
  // Sync user data to Firestore on every sign-in
  useClerkFirebaseSync();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <SignedOut>
        <button
          id="clerk-signin-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxury font-semibold border-[1.5px] border-primary/30 px-5 py-3 rounded-full hover:bg-primary/10 hover:border-primary/60 text-primary transition-all duration-500 group cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </button>

        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-[10px] tracking-luxury text-primary/80 font-semibold uppercase truncate max-w-[120px]">
              {user.firstName ?? user.primaryEmailAddress?.emailAddress}
            </span>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-10 h-10 ring-2 ring-primary/40 hover:ring-primary transition-all duration-500 shadow-glow",
                userButtonPopoverActionButtonText: "text-[#D4AF37] font-bold uppercase tracking-widest text-[11px]",
                userButtonPopoverActionButtonIcon: "text-[#D4AF37]",
                userButtonPopoverMainIdentifier: "text-white font-bold",
                userButtonPopoverSecondaryIdentifier: "text-zinc-400",
                userButtonPopoverCard: "bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl"
              },
            }}
          />
        </div>
      </SignedIn>
    </>
  );
};

export default AuthWidget;

