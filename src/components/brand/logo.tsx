"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   PILOTIS — marque
   Le symbole reprend trois pilotis (pieux de fondation) qui
   montent depuis une semelle commune : la fondation invisible
   qui porte l'ouvrage. Le pilotis le plus haut est en orange
   chantier — le signal, l'action, le pilotage.
   ============================================================ */

export function LogoMark({
  className,
  size = 32,
  inverted = false,
}: {
  className?: string;
  size?: number;
  inverted?: boolean;
}) {
  // Un identifiant unique par instance : deux logos sur la même page ne
  // peuvent pas se voler leur dégradé.
  const gradientId = `pilotis-tile-${React.useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14428e" />
          <stop offset="1" stopColor="#071a3d" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8.5" fill={inverted ? "#ffffff" : `url(#${gradientId})`} />
      {/* semelle */}
      <rect x="7" y="23" width="18" height="2.6" rx="1.3" fill={inverted ? "#14428e" : "#ffffff"} opacity={0.92} />
      {/* pilotis */}
      <rect x="8.4" y="15.5" width="3.2" height="7" rx="1.6" fill={inverted ? "#14428e" : "#ffffff"} opacity={0.6} />
      <rect x="14.4" y="11" width="3.2" height="11.5" rx="1.6" fill={inverted ? "#14428e" : "#ffffff"} opacity={0.8} />
      <rect x="20.4" y="6.2" width="3.2" height="16.3" rx="1.6" fill="#ff6f1a" />
    </svg>
  );
}

export function Wordmark({
  className,
  size = "md",
  inverted = false,
  tagline,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  tagline?: boolean;
}) {
  const marks = { sm: 24, md: 30, lg: 40 };
  const text = { sm: "text-[15px]", md: "text-[17px]", lg: "text-[22px]" };
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={marks[size]} inverted={inverted} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-semibold tracking-[-0.03em]",
            text[size],
            inverted ? "text-white" : "text-ink-900",
          )}
        >
          PILOTIS
        </span>
        {tagline ? (
          <span
            className={cn(
              "mt-1 text-[10px] font-medium tracking-[0.14em] uppercase",
              inverted ? "text-white/45" : "text-ink-400",
            )}
          >
            Construction OS
          </span>
        ) : null}
      </span>
    </span>
  );
}
