import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Loader2 } from "lucide-react";

/** Single owner — only this email can access /admin */
const ADMIN_EMAILS = [
  "marathivloggerstudio@gmail.com",
];

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-primary/60 text-[10px] uppercase tracking-widest font-black">Validating Security Protocol...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);

  if (!isAdmin) {
    // Log unauthorized attempt if you have a logging system
    console.error(`Unauthorized admin access attempt by ${userEmail}`);
    
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-strong p-12 rounded-[3rem] border-red-500/20 max-w-md"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-3xl font-black text-white mb-4">Access Restricted</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            This terminal is restricted to authorized studio personnel only. Your access attempt has been logged for security audit.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-glow-red"
          >
            Return to Safety
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
