import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// =========================================================================
// ⚠️ EMAILJS CONFIGURATION REQUIRED ⚠️
// You must create 2 templates in EmailJS and enter their IDs here:
// =========================================================================
const SERVICE_ID = "service_2mn7ay9"; // ✅ Updated
const TEMPLATE_USER = "template_7h27vhv"; // ✅ Updated
const TEMPLATE_ADMIN = "template_pfthjao"; // ✅ Updated
const PUBLIC_KEY = "hMikfIKXEVIBIESMP";

import { BackButton } from "@/components/BackButton";
import { TechBackground } from "@/components/TechBackground";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const hasFired = useRef(false);

  useEffect(() => {
    // 1. Prevent duplicate firing in React Strict Mode
    if (hasFired.current) return;
    hasFired.current = true;

    // 2. Extract variables passed from Tally Redirect URL
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const budget = searchParams.get("budget");
    const event_type = searchParams.get("event_type");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");
    const event_details = searchParams.get("event_details");
    const expectations = searchParams.get("expectations");

    // If no email or name is found in URL, it means the user just visited /thank-you manually
    if (!name || !email) {
      setStatus("success"); // Just show success without sending email
      return;
    }

    // 3. Prepare parameters mapped to your EmailJS templates
    const templateParams = {
      user_name: name,
      user_email: email,
      user_phone: phone || "Not Provided",
      budget: budget || "Not Provided",
      event_type: event_type || "Not Provided",
      destination: destination || "Not Provided",
      event_date: date || "Not Provided",
      event_details: event_details || "Not Provided",
      expectations: expectations || "Not Provided",
      admin_email: "marathivloggerstudio@gmail.com",
    };

    // 4. Initialize EmailJS with your Public Key
    emailjs.init(PUBLIC_KEY);

    // 5. Send both emails (User Welcome & Admin Alert)
    const sendEmails = async () => {
      try {
        await Promise.all([
          emailjs.send(SERVICE_ID, TEMPLATE_ADMIN, templateParams),
          emailjs.send(SERVICE_ID, TEMPLATE_USER, templateParams),
        ]);

        // Clean up the URL to prevent refresh from re-triggering
        navigate("/thank-you", { replace: true });
        setStatus("success");
      } catch (error: any) {
        console.error("EmailJS Error:", error);
        setStatus("error");
        
        // Extract the specific EmailJS error message
        const errorMessage = error?.text || error?.message || "Unknown error occurred";
        
        toast.error(`Email Failed: ${errorMessage}`, {
          duration: 10000, // keep toast open longer to read it
        });
      }
    };

    sendEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden text-white p-6">
      <TechBackground />
      <BackButton />
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-premium p-10 md:p-16 rounded-sm text-center relative z-10 max-w-2xl w-full border border-primary/20 shadow-glow">
        
        {status === "processing" ? (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <h2 className="text-2xl font-display text-gradient-gold">Finalizing your request...</h2>
            <p className="text-zinc-400">Please wait a moment.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-up">
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-breathe">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] uppercase tracking-luxury text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Successfully Received
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Thank You!
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-md mx-auto">
              Your inquiry has been stored in our system and a confirmation email has been sent to you. 
              Our team will review your details and be in touch within 24 hours.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-sm hover:shadow-btn transition-all duration-300"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
