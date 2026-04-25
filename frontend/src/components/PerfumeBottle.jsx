function PerfumeBottle({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 680 700"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a0a10" stopOpacity="0.85" />
          <stop offset="25%" stopColor="#3d1a27" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.18" />
          <stop offset="75%" stopColor="#3d1a27" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a0a10" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6a8" />
          <stop offset="40%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#7a5c1e" />
        </linearGradient>
        <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a5c1e" />
          <stop offset="50%" stopColor="#f5e6a8" />
          <stop offset="100%" stopColor="#7a5c1e" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce4ec" stopOpacity="0.55" />
          <stop offset="30%" stopColor="#f8bbd0" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1a0a10" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c2185b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7a0035" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a5c1e" />
          <stop offset="50%" stopColor="#f5e6a8" />
          <stop offset="100%" stopColor="#7a5c1e" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* glow behind bottle */}
      <ellipse
        cx="340"
        cy="580"
        rx="130"
        ry="30"
        fill="url(#glowGrad)"
        opacity="0.6"
      />
      <ellipse
        cx="340"
        cy="420"
        rx="110"
        ry="220"
        fill="#c9a84c"
        opacity="0.04"
      />

      {/* CAP */}
      <ellipse cx="340" cy="138" rx="38" ry="10" fill="url(#capGrad)" />
      <rect
        x="302"
        y="138"
        width="76"
        height="56"
        rx="4"
        fill="url(#capGrad)"
      />
      <rect x="298" y="190" width="84" height="8" rx="2" fill="#7a5c1e" />
      <rect
        x="316"
        y="142"
        width="12"
        height="48"
        rx="3"
        fill="#f5e6a8"
        opacity="0.35"
      />
      <line
        x1="310"
        y1="155"
        x2="370"
        y2="155"
        stroke="#7a5c1e"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <line
        x1="310"
        y1="165"
        x2="370"
        y2="165"
        stroke="#7a5c1e"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <line
        x1="310"
        y1="175"
        x2="370"
        y2="175"
        stroke="#7a5c1e"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* NECK */}
      <rect
        x="322"
        y="198"
        width="36"
        height="52"
        rx="2"
        fill="url(#neckGrad)"
      />
      <rect
        x="330"
        y="200"
        width="8"
        height="48"
        rx="1"
        fill="#ffffff"
        opacity="0.2"
      />

      {/* SHOULDER */}
      <path
        d="M290 250 Q290 268 270 275 L270 285 L410 285 L410 275 Q390 268 390 250 Z"
        fill="url(#glassGrad)"
        stroke="#c9a84c"
        strokeWidth="0.8"
        opacity="0.9"
      />

      {/* BODY */}
      <rect
        x="258"
        y="283"
        width="164"
        height="280"
        rx="6"
        fill="url(#glassGrad)"
        stroke="#c9a84c"
        strokeWidth="0.8"
      />
      <rect
        x="262"
        y="320"
        width="156"
        height="240"
        rx="4"
        fill="url(#liquidGrad)"
      />
      <rect
        x="258"
        y="283"
        width="164"
        height="280"
        rx="6"
        fill="url(#bodyGrad)"
        opacity="0.55"
      />
      <rect
        x="268"
        y="290"
        width="18"
        height="268"
        rx="4"
        fill="url(#shineGrad)"
        opacity="0.6"
      />
      <rect
        x="390"
        y="295"
        width="8"
        height="260"
        rx="2"
        fill="#ffffff"
        opacity="0.06"
      />

      {/* LABEL */}
      <rect
        x="278"
        y="340"
        width="124"
        height="130"
        rx="3"
        fill="#0a0f1a"
        opacity="0.55"
        stroke="#c9a84c"
        strokeWidth="0.7"
      />
      <line
        x1="285"
        y1="352"
        x2="396"
        y2="352"
        stroke="#c9a84c"
        strokeWidth="0.8"
      />
      <text
        x="340"
        y="380"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="5"
        fill="#c9a84c"
      >
        SUSAN
      </text>
      <rect
        x="336"
        y="386"
        width="8"
        height="8"
        rx="1"
        fill="#c9a84c"
        opacity="0.8"
        transform="rotate(45 340 390)"
      />
      <text
        x="340"
        y="412"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="8"
        letterSpacing="3.5"
        fill="#c9a84c"
        opacity="0.7"
      >
        LUXURY
      </text>
      <text
        x="340"
        y="426"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="8"
        letterSpacing="3.5"
        fill="#c9a84c"
        opacity="0.7"
      >
        PERFUME
      </text>
      <line
        x1="285"
        y1="455"
        x2="396"
        y2="455"
        stroke="#c9a84c"
        strokeWidth="0.8"
      />

      {/* BASE */}
      <rect
        x="254"
        y="561"
        width="172"
        height="10"
        rx="3"
        fill="url(#baseGrad)"
      />
      <rect
        x="260"
        y="569"
        width="160"
        height="6"
        rx="2"
        fill="#7a5c1e"
        opacity="0.6"
      />

      {/* SHADOW */}
      <ellipse
        cx="340"
        cy="582"
        rx="90"
        ry="10"
        fill="#1a0a10"
        opacity="0.18"
      />

      {/* BOKEH DOTS */}
      <circle cx="210" cy="310" r="3" fill="#c9a84c" opacity="0.35" />
      <circle cx="190" cy="380" r="5" fill="#c9a84c" opacity="0.18" />
      <circle cx="200" cy="450" r="2" fill="#c9a84c" opacity="0.28" />
      <circle cx="175" cy="500" r="4" fill="#c2185b" opacity="0.20" />
      <circle cx="225" cy="530" r="2" fill="#c9a84c" opacity="0.22" />
      <circle cx="470" cy="320" r="4" fill="#c9a84c" opacity="0.30" />
      <circle cx="490" cy="390" r="2" fill="#c9a84c" opacity="0.20" />
      <circle cx="480" cy="460" r="5" fill="#c2185b" opacity="0.15" />
      <circle cx="500" cy="510" r="2" fill="#c9a84c" opacity="0.25" />
      <circle cx="460" cy="540" r="3" fill="#c9a84c" opacity="0.20" />

      {/* SPARKLES */}
      <g opacity="0.55" fill="#c9a84c">
        <polygon points="218,260 220,255 222,260 220,265" />
        <polygon points="462,270 464,265 466,270 464,275" />
        <polygon points="185,340 187,335 189,340 187,345" />
        <polygon points="495,440 497,435 499,440 497,445" />
      </g>
    </svg>
  );
}

export default PerfumeBottle;
