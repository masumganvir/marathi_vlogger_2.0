import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key — add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} 
    afterSignOutUrl="/"
    appearance={{
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#0F0F0F',
        colorText: '#FFFFFF',
        colorTextSecondary: '#A1A1AA',
        colorInputBackground: '#1A1A1A',
        colorInputText: '#FFFFFF',
        borderRadius: '0.25rem',
      },
      elements: {
        card: 'bg-obsidian border border-primary/20 shadow-elegant backdrop-blur-xl',
        userButtonPopoverCard: 'bg-obsidian border border-primary/40 shadow-glow backdrop-blur-xl animate-fade-up',
        userButtonPopoverActionButton: 'hover:bg-primary/10 transition-all duration-300 py-3',
        userButtonPopoverActionButtonText: 'text-white font-bold tracking-wide text-sm !opacity-100',
        userButtonPopoverActionButtonIcon: 'text-primary scale-110',
        userButtonPopoverFooter: 'hidden',
        userButtonBox: 'hover:scale-105 transition-transform duration-300',
        userButtonTrigger: 'focus:shadow-none outline-none ring-2 ring-primary/20 ring-offset-2 ring-offset-obsidian rounded-full transition-all',
        headerTitle: 'font-display text-white font-bold text-lg',
        headerSubtitle: 'text-zinc-400 font-medium',
        socialButtonsBlockButton: 'bg-white/5 border border-white/10 hover:bg-primary/5 hover:border-primary/30 transition-all',
        formButtonPrimary: 'bg-gradient-gold text-obsidian font-bold uppercase tracking-luxury shadow-btn hover:shadow-gold transition-all',
        footerActionLink: 'text-primary hover:text-primary/80',
        identityPreviewText: 'text-white font-bold',
        identityPreviewEditButtonIcon: 'text-primary',
      }
    }}
  >
    <App />
  </ClerkProvider>
);
