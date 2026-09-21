"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Sparkline } from "@/components/charts/charts";
import { SERIES } from "@/components/charts/kit";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Tuile de statistique — contrat : libellé, valeur, delta signé
   rapporté à une période nommée, courbe de tendance optionnelle.
------------------------------------------------------------------- */

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  /** true si une hausse est une bonne nouvelle (défaut) */
  upIsGood?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  trend?: number[];
  trendColor?: string;
  accent?: "brand" | "ok" | "warn" | "risk" | "signal";
  className?: string;
}

const accentRing: Record<string, string> = {
  brand: "bg-brand-50 text-brand-700",
  ok: "bg-ok-50 text-ok-600",
  warn: "bg-warn-50 text-warn-600",
  risk: "bg-risk-50 text-risk-600",
  signal: "bg-signal-50 text-signal-600",
};

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel = "vs mois dernier",
  upIsGood = true,
  hint,
  icon,
  trend,
  trendColor = SERIES[0],
  accent = "brand",
  className,
}: KpiCardProps) {
  const positive = delta !== undefined && delta > 0;
  const negative = delta !== undefined && delta < 0;
  const good = positive ? upIsGood : negative ? !upIsGood : undefined;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:border-line-strong hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
        {icon ? (
          <span className={cn("flex size-8 items-center justify-center rounded-lg [&_svg]:size-4", accentRing[accent])}>
            {icon}
          </span>
        ) : null}
      </div>

      <p className="tnum mt-2.5 text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink-900">{value}</p>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {delta !== undefined ? (
            <span
              className={cn(
                "tnum inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                good === undefined
                  ? "bg-ink-100 text-ink-500"
                  : good
                    ? "bg-ok-50 text-ok-700"
                    : "bg-risk-50 text-risk-700",
              )}
            >
              {positive ? <ArrowUpRight className="size-3" /> : negative ? <ArrowDownRight className="size-3" /> : <Minus className="size-3" />}
              {Math.abs(delta)} %
            </span>
          ) : null}
          <span className="truncate text-xs text-ink-400">{hint ?? deltaLabel}</span>
        </div>

        {trend ? (
          <div className="w-20 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
            <Sparkline data={trend} color={trendColor} height={28} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Variante mise en avant : le chiffre que la page raconte. */
export function HeroKpi({
  label,
  value,
  caption,
  delta,
  children,
  className,
}: {
  label: string;
  value: string;
  caption?: string;
  delta?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-brand-900/40 bg-ink-950 p-6 text-white shadow-lg",
        className,
      )}
    >
      <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,111,26,0.22), transparent 70%)" }}
      />
      <div className="relative">
        <p className="text-[12px] font-medium tracking-[0.08em] text-white/45 uppercase">{label}</p>
        <p className="tnum mt-3 text-[44px] leading-none font-semibold tracking-[-0.04em]">{value}</p>
        {caption || delta ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {delta ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-ok-500/15 px-2 py-0.5 text-xs font-semibold text-ok-500">
                <ArrowUpRight className="size-3" />
                {delta}
              </span>
            ) : null}
            {caption ? <span className="text-[13px] text-white/55">{caption}</span> : null}
          </div>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </div>
  );
}
