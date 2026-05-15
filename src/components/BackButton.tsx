import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-8 left-8 z-[100] group flex items-center gap-3 px-6 py-3 rounded-full border border-primary/20 bg-black/40 backdrop-blur-xl text-[10px] uppercase tracking-luxury text-primary font-bold hover:bg-primary hover:text-obsidian hover:border-primary transition-all duration-500 shadow-glow"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
      Back to Previous
    </button>
  );
};
