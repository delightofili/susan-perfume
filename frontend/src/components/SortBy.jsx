import { useState } from "react";

function SortBy({ onSortChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Newest");

  const options = [
    { label: "Newest", value: "" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-asc" },
  ];

  function handleSelect(option) {
    setSelected(option.label);
    setOpen(false);
    onSortChange?.(option.value);
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-soft-white dark:bg-primary-soft-black border dark:border-white/10 border-pink-blush dark:text-soft-white text-pink-blush hover:border-(--luxury-gold-solid) transition hover:cursor-pointer"
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
            shadow-xl
          "
        >
          {options.map((option, index) => (
            <div key={option.value}>
              <button
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 text-sm
                dark:text-soft-white
                text-pink-blush
                dark:hover:bg-white/5
                hover:bg-pink-blush/10
                dark:hover:text-(--luxury-gold-solid)
                hover:text-[#e91e8c]
                transition"
              >
                {option.label}
              </button>
              {index !== options.length - 1 && (
                <div className="h-px mx-4 bg-[#e91e8c] dark:bg-(--luxury-gold-gradient) opacity-30" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortBy;
