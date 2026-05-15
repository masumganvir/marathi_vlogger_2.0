import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, Zap, User, Loader2, Minimize2, Maximize2, Headphones } from "lucide-react";
import { SERVICES_DATA } from "@/data/services";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

const MODELS = [
  { 
    id: "google/gemini-2.0-flash-exp:free", 
    name: "Tiya (Primary)", 
    desc: "Studio Intelligence", 
    icon: Bot, 
    color: "#D4AF37",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_1
  },
  { 
    id: "anthropic/claude-3-haiku", 
    name: "Tiya (Reserve)", 
    desc: "Creative Specialist", 
    icon: Zap, 
    color: "#3B82F6",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_2
  },
  { 
    id: "openai/gpt-4o-mini", 
    name: "Tiya (Backup)", 
    desc: "Production Advisor", 
    icon: Sparkles, 
    color: "#8A4AF0",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY_3
  }
];

const SYSTEM_PROMPT = `
You are "Tiya", the Studio Manager and lead Creative Consultant for MarathiVlogger Studio. 
As the Manager, your goal is to oversee the client's experience, provide professional advice on investments, and ensure a seamless registration process.

MANAGERIAL DIRECTIVE:
1. Analyze the user's needs and recommend the most cost-effective path.
2. For LOW BUDGET clients, explicitly recommend our "BASIC" package (₹15,000) or "REEL CREATION" services. Explain that these offer high-impact cinematic quality without the full-scale production cost.
3. Break down your responses into clear, digestible paragraphs.
4. Always provide the registration steps and contact details when helpful.

STUDIO IDENTITY & STATS:
- Lead Artist: Masum Ganvir.
- Track Record: 8+ years, 500+ Shoots, 100+ Weddings, 12 Awards, 5M+ Social Views.
- Philosophy: "High-end cinema for every story, regardless of the scale."

THE 4-STEP REGISTRATION (BOOKING) PROCESS:
Explain this to users who want to book or register:
- STEP 1: Selection - Choose your cinematic tier (Basic, Essence, Signature, or Heirloom) on the /booking page.
- STEP 2: Details - Provide your event date and location. (You'll need to sign in with your account for secure syncing).
- STEP 3: Inquiry Sync - Complete our detailed Tally inquiry form, which automatically syncs with our Google Sheets CRM for priority processing.
- STEP 4: Finalize - Review your summary and complete the 20% booking deposit to lock in your dates.

BUDGET CONSULTANCY:
- If a client is budget-conscious: Suggest the "Basic Package" at ₹15,000. It includes a 60s high-end occasion reel and product ads optimized for social media.
- Mention that "Signature" (₹2,25,000) is our most popular for full weddings, but "Essence" (₹85,000) is a great middle-ground for quality on a tighter schedule.

CONTACT DETAILS:
- Managerial Support: +91 82629 71842 (WhatsApp Available)
- Official Email: marathivloggerstudios@gmail.com
- Social Hub: @marathi_vloggerr_2 (Instagram)
- Direct Link: marathivloggerstudios.com/booking

TIYA'S TONE:
- Authoritative yet warm, professional, and structured. 
- Use "Manager's Advice:" when giving budget tips.
- Always be helpful and predictive of the client's next concern.
`;

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! I'm Tiya, the Studio Manager at MarathiVlogger Studios. I've been reviewing our latest production schedules—how can I assist you in planning your next cinematic project or finding the perfect package for your budget?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const currentInput = input;
    const chatHistory = [...messages, userMsg];
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let success = false;
    let lastError = "";

    // Try each model in sequence
    for (const model of MODELS) {
      if (success) break;
      
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${model.apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "MarathiVlogger Studio Tiya AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model.id,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...chatHistory.map(m => ({ role: m.role, content: m.content }))
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Model ${model.name} failed:`, errText);
          lastError = `API returned ${response.status}`;
          continue; // Try next model
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (content) {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content,
            model: model.name 
          }]);
          success = true;
        }
      } catch (error) {
        console.error(`Attempt with ${model.name} failed:`, error);
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    if (!success) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, my creative circuits are experiencing a brief interference. Please reach out to our team directly at +91 82629 71842 so we can assist you personally!" 
      }]);
    }

    setIsLoading(false);
  };


  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "80px" : "min(700px, 85vh)"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[92vw] sm:w-[400px] glass-premium rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col mb-4 md:mb-6 transition-all duration-500"
          >
            {/* Header */}
            <div className="p-5 md:p-6 bg-gradient-to-r from-black/80 to-primary/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base md:text-lg text-white leading-none">Tiya</h3>
                  <p className="text-[9px] text-primary uppercase tracking-widest mt-1 font-bold">Studio Ambassador</p>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-black/40"
                >
                  {messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[88%] group`}>
                        <div className={`flex items-center gap-2 mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          {m.role === "assistant" && <Bot className="w-3 h-3 text-primary" />}
                          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                            {m.role === "user" ? "Client" : "Tiya AI"}
                          </span>
                          {m.role === "user" && <User className="w-3 h-3 text-zinc-500" />}
                        </div>
                        <div className={`p-4 md:p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${
                          m.role === "user" 
                            ? "bg-primary text-black font-medium rounded-tr-none" 
                            : "bg-white/5 text-zinc-200 border border-white/5 rounded-tl-none backdrop-blur-md"
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Tiya is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 md:p-6 bg-black/80 border-t border-white/5">
                  <div className="relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask Tiya anything..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-2 bottom-2 w-10 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Headphones className="w-3 h-3 text-zinc-700" />
                    <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
                      24/7 Cinematic Support · v2.0
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen && isMinimized) {
            setIsMinimized(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group relative ${
          isOpen ? "bg-white text-black" : "bg-primary text-black"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-40" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-primary text-[10px] font-black animate-bounce">
            1
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatBot;

