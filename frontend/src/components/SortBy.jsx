import { useState } from "react";

function SortBy({ onSortChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Newest");

  const options = [
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Name: A to Z",
  ];

  function handleSelect(option) {
    setSelected(option);
    setOpen(false);
    onSortChange?.(option);
  }
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-soft-white dark:bg-primary-soft-black border darkborder-white/10 border-pink-blush dark:text-soft-white text-pink-blush hover:border-(--luxury-gold-solid) transition hover:cursor-pointer"
      >
        <span className="text-sm">{selected}</span>
        {open ? (
          <span className="text-sm">▸</span>
        ) : (
          <span className="text-sm">▾</span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute mt-2 w-full z-50
            rounded-xl overflow-hidden
            
            bg-soft-white
            dark:bg-primary-charcoal-black
            border-pink-blush
            border dark:border-white/10
            shadow-[0_20px_60px_rgba(0,0,0,0.6)] 
          "
        >
          {options.map((option, index) => (
            <>
              <button
                onClick={() => handleSelect(option)}
                key={option}
                className="w-full text-left px-4 py-3 text-sm
                dark:text-soft-white
                text-pink-blush
                dark:hover:bg-white/5
                hover:bg-pink-blush/10
                dark:hover:text-(--luxury-gold-solid)
                hover:text-(--pinky)
                transition"
              >
                {option}
              </button>
              {index !== options.length - 1 && (
                <div className="h-px mx-4 bg-(--pinky) dark:bg-(--luxury-gold-gradient) opacity-30" />
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortBy;
