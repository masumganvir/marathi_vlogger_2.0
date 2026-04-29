interface MenuToggleProps {
  open: boolean;
  onToggle: () => void;
}

const MenuToggle = ({ open, onToggle }: MenuToggleProps) => {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative w-11 h-11 flex items-center justify-center group transition-all duration-500 border-[1.5px] border-primary/40 hover:border-primary hover:shadow-gold bg-obsidian/50 backdrop-blur-xl rounded-sm overflow-hidden"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />

      {/* Corner ticks */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-primary opacity-60 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-500" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-primary opacity-60 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-500" />

      {/* Hamburger → X morph */}
      <div className="relative w-5 h-4 flex flex-col justify-between z-10">
        <span
          className={`block h-[2px] bg-primary origin-center transition-all duration-500 ${
            open ? "translate-y-[7px] rotate-45 w-full" : "w-full"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <span
          className={`block h-[2px] bg-primary transition-all duration-300 ${
            open ? "opacity-0 -translate-x-4 scale-0" : "opacity-100 w-3/4"
          }`}
        />
        <span
          className={`block h-[2px] bg-primary origin-center transition-all duration-500 ${
            open ? "-translate-y-[7px] -rotate-45 w-full" : "w-1/2 ml-auto"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>
    </button>
  );
};

export default MenuToggle;
