function GoldDividerDot() {
  return (
    <div className="relative w-full my-4">
      <div
        class="h-px w-full bg-linear-to-r
from-transparent via-solid-gold to-transparent"
      ></div>
      <div
        className="
      absolute left-1/2 top-1/2
      -translate-x-1/2 -translate-y-1/2
      w-2 h-2 rounded-full
      bg-(--luxury-gold-solid)
      shadow-[0_0_10px_rgba(230,199,106,0.8)]
    "
      />
    </div>
  );
}

export default GoldDividerDot;
