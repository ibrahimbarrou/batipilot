import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Vignette de photo de chantier.
   Aucune image réelle n'est embarquée dans cette démonstration : la
   vignette rend une scène de chantier vectorielle déterministe,
   dérivée de l'identifiant de la photo, pour que la galerie reste
   crédible et cohérente d'un rendu à l'autre.
------------------------------------------------------------------- */

function seedOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function PhotoScene({
  id,
  tone,
  className,
}: {
  id: string;
  tone: string;
  className?: string;
}) {
  const seed = seedOf(id);
  const variant = seed % 4;
  const skyline = [
    [38, 26, 58, 44],
    [30, 34, 46, 30],
    [52, 20, 34, 52],
    [24, 40, 62, 26],
  ][variant] as [number, number, number, number];

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", tone, className)}>
      {/* voile de lumière */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.26),transparent_62%)]" />

      <svg viewBox="0 0 120 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* horizon */}
        <rect x="0" y="58" width="120" height="22" fill="rgba(0,0,0,0.22)" />

        {/* volumes construits */}
        <rect x="8" y={80 - skyline[0]} width="26" height={skyline[0]} fill="rgba(255,255,255,0.13)" />
        <rect x="36" y={80 - skyline[1]} width="20" height={skyline[1]} fill="rgba(0,0,0,0.16)" />
        <rect x="58" y={80 - skyline[2]} width="30" height={skyline[2]} fill="rgba(255,255,255,0.1)" />
        <rect x="90" y={80 - skyline[3]} width="22" height={skyline[3]} fill="rgba(0,0,0,0.13)" />

        {/* trame d'échafaudage sur le volume principal */}
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="0.6">
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={`h${i}`} x1="58" x2="88" y1={80 - skyline[2] + (i + 1) * (skyline[2] / 5)} y2={80 - skyline[2] + (i + 1) * (skyline[2] / 5)} />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <line key={`v${i}`} x1={58 + (i + 1) * 7.5} x2={58 + (i + 1) * 7.5} y1={80 - skyline[2]} y2="80" />
          ))}
        </g>

        {/* grue à tour */}
        {variant % 2 === 0 ? (
          <g stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none">
            <line x1="100" y1="10" x2="100" y2="62" />
            <line x1="68" y1="12" x2="116" y2="12" />
            <line x1="100" y1="4" x2="68" y2="12" />
            <line x1="100" y1="4" x2="116" y2="12" />
            <line x1="80" y1="12" x2="80" y2="26" strokeDasharray="2 2" />
          </g>
        ) : null}
      </svg>

      {/* grain discret */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.28),transparent_45%)]" />
    </div>
  );
}
