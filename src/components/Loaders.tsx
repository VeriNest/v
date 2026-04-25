import React from "react";

/** ── ORBIT RING LOADER ── */
export function OrbitLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <style>{`
        @keyframes spin-arc {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes icon-breathe {
          0%, 100% { box-shadow: 0 4px 20px rgba(196, 113, 74, 0.35); transform: scale(1); }
          50%       { box-shadow: 0 6px 28px rgba(196, 113, 74, 0.55); transform: scale(1.04); }
        }
        .orbit-track-${size} {
          animation: spin-arc 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .orbit-icon-${size} {
          animation: icon-breathe 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* Static track ring */}
      <div className="absolute inset-0 border-2 border-amber-600/15 rounded-full" />

      {/* Rotating arc */}
      <svg
        className={`absolute inset-0 orbit-track-${size}`}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          stroke="url(#arcGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="80 220"
          fill="none"
        />
        <circle cx="97" cy="50" r="4" fill="#C4714A" />
        <defs>
          <linearGradient
            id="arcGrad"
            gradientUnits="userSpaceOnUse"
            x1="50"
            y1="3"
            x2="97"
            y2="50"
          >
            <stop offset="0%" stopColor="#C4714A" stopOpacity="0" />
            <stop offset="100%" stopColor="#C4714A" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center icon */}
      <div className={`orbit-icon-${size} relative z-10 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11L12 3l9 8"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="9" y="13" width="6" height="8" rx="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}

/** ── MORPH RING LOADER ── */
export function MorphLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes morph-pulse {
          0%, 100% { border-radius: 14px; transform: rotate(0deg); }
          25%       { border-radius: 20px; transform: rotate(3deg); }
          50%       { border-radius: 14px; transform: rotate(0deg); }
          75%       { border-radius: 20px; transform: rotate(-3deg); }
        }
        .morph-ring-${size} {
          animation: spin-reverse 2s linear infinite;
        }
        .morph-icon-${size} {
          animation: morph-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <svg
        className={`absolute inset-0 morph-ring-${size}`}
        viewBox="0 0 110 110"
        fill="none"
      >
        <circle
          cx="55"
          cy="55"
          r="50"
          stroke="rgba(196,113,74,0.1)"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="55"
          cy="55"
          r="50"
          stroke="#C4714A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="30 284"
          strokeDashoffset="0"
          fill="none"
          opacity="1"
        />
        <circle
          cx="55"
          cy="55"
          r="50"
          stroke="#C4714A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="22 284"
          strokeDashoffset="-38"
          fill="none"
          opacity="0.55"
        />
        <circle
          cx="55"
          cy="55"
          r="50"
          stroke="#C4714A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="14 284"
          strokeDashoffset="-68"
          fill="none"
          opacity="0.25"
        />
      </svg>

      <div
        className={`morph-icon-${size} relative z-10 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11L12 3l9 8"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="9" y="13" width="6" height="8" rx="3" fill="white" />
        </svg>
      </div>
    </div>
  );
}

/** ── FULLSCREEN PAGE LOAD LOADER ── */
export function FullscreenLoader({
  status = "Verifying your identity",
}: {
  status?: string;
}) {
  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center z-50">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.7; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        @keyframes spin-arc {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes icon-breathe {
          0%, 100% { box-shadow: 0 0 0 1px rgba(196,113,74,0.3), 0 8px 32px rgba(196,113,74,0.45); transform: scale(1); }
          50%       { box-shadow: 0 0 0 1px rgba(196,113,74,0.5), 0 12px 48px rgba(196,113,74,0.65); transform: scale(1.05); }
        }
        @keyframes text-fade {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes dot-wave {
          0%, 100% { transform: translateY(0);  opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes progress-slide {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 70%;  margin-left: 0; }
          100% { width: 0%;   margin-left: 100%; }
        }
        .glow-orb { animation: glow-pulse 2s ease-in-out infinite; }
        .fs-ring { animation: spin-arc 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .fs-icon { animation: icon-breathe 1.8s ease-in-out infinite; }
        .fs-status { animation: text-fade 1.8s ease-in-out infinite; }
        .trio-dot { animation: dot-wave 1.4s ease-in-out infinite; }
        .trio-dot:nth-child(2) { animation-delay: 0.18s; }
        .trio-dot:nth-child(3) { animation-delay: 0.36s; }
        .fs-progress { animation: progress-slide 2.4s ease-in-out infinite; }
      `}</style>

      <div className="w-80 rounded-3xl bg-neutral-900 flex flex-col items-center justify-center gap-0 relative overflow-hidden shadow-2xl">
        {/* Ambient glow */}
        <div className="glow-orb absolute w-52 h-52 bg-gradient-radial from-amber-600/18 to-transparent rounded-full" />

        {/* Icon wrap */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-7 z-10">
          {/* Rotating arc ring */}
          <svg
            className="fs-ring absolute inset-0"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="rgba(196,113,74,0.12)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="url(#fsArcGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100 252"
              fill="none"
            />
            <circle cx="116" cy="60" r="5" fill="#C4714A" />
            <defs>
              <linearGradient
                id="fsArcGrad"
                gradientUnits="userSpaceOnUse"
                x1="60"
                y1="4"
                x2="116"
                y2="60"
              >
                <stop offset="0%" stopColor="#C4714A" stopOpacity="0" />
                <stop offset="100%" stopColor="#C4714A" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          <div className="fs-icon relative z-10 w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 11L12 3l9 8"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="9" y="13" width="6" height="8" rx="3" fill="white" />
            </svg>
          </div>
        </div>

        <div className="font-cormorant text-2xl font-semibold text-cream tracking-wide mb-2 z-10">
          Veri<span className="italic text-amber-600">nest</span>
        </div>
        <div className="fs-status text-xs font-dm-sans letter-spacing tracking-widest text-amber-600/70 mb-6 z-10">
          {status}
        </div>

        {/* Dot trio */}
        <div className="flex gap-2 z-10 mb-6">
          <div className="trio-dot w-1.5 h-1.5 bg-amber-600 rounded-full" />
          <div className="trio-dot w-1.5 h-1.5 bg-amber-600 rounded-full" />
          <div className="trio-dot w-1.5 h-1.5 bg-amber-600 rounded-full" />
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600/15 rounded-b-3xl overflow-hidden">
          <div className="fs-progress h-full bg-amber-600 rounded-b-3xl" />
        </div>
      </div>
    </div>
  );
}

/** ── INLINE BUTTON LOADER ── */
export function InlineSpinner({ variant = "solid" }: { variant?: "solid" | "ghost" }) {
  return (
    <svg
      className="w-5 h-5 flex-shrink-0 animate-spin"
      viewBox="0 0 18 18"
      fill="none"
    >
      <circle
        cx="9"
        cy="9"
        r="7.5"
        stroke={variant === "solid" ? "rgba(255,255,255,0.25)" : "rgba(196,113,74,0.25)"}
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="9"
        cy="9"
        r="7.5"
        stroke={variant === "solid" ? "white" : "#C4714A"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="20 27"
        fill="none"
      />
      <circle
        cx="16.5"
        cy="9"
        r="2"
        fill={variant === "solid" ? "white" : "#C4714A"}
      />
    </svg>
  );
}
