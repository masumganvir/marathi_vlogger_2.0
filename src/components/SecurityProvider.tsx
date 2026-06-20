import { useEffect } from "react";
import { useSecurity } from "@/hooks/useSecurity";
import { useUser } from "@clerk/clerk-react";

/**
 * SecurityProvider — must be rendered inside BrowserRouter & ClerkProvider.
 * It activates the security hook globally so that:
 *  - Session inactivity timeout runs on every page.
 *  - URL-param tampering is caught on every navigation.
 *  - Session UID mismatch is caught on mount.
 *  - Protected-route access attempts are logged.
 *
 * It renders no UI — purely a security side-effect layer.
 */
const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();
  // Activates all security effects
  useSecurity();

  // Console warnings in dev so devs know security is active
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(
        `[Security] Provider active. Signed in: ${isSignedIn}${
          user ? ` · UID: ${user.id.slice(0, 12)}…` : ""
        }`
      );
    }
  }, [isSignedIn, user]);

  return <>{children}</>;
};

export default SecurityProvider;
