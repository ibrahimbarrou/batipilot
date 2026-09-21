"use client";

import * as React from "react";
import { cn, formatMoneyCompact, formatNumber } from "@/lib/utils";

/* ============================================================
   Kit de visualisation PILOTIS
   Palette catégorielle validée (écart CVD suffisant sur toutes
   les paires adjacentes). L'ordre est fixe : la série 1 garde
   toujours la même couleur, quel que soit le filtre appliqué.
   ============================================================ */

export const SERIES = ["#2148db", "#ff6f1a", "#10b981", "#7c3aed", "#0891b2"] as const;

/** Couleurs de statut — réservées, jamais réutilisées comme « série 4 ». */
export const STATUS = {
  good: "#10b981",
  warning: "#f59e0b",
  serious: "#ff6f1a",
  critical: "#ef4444",
  idle: "#cbd1dc",
} as const;

export const AXIS = {
  stroke: "#e5e8ee",
  tick: { fill: "#6b7488", fontSize: 11 },
};

export const GRID_PROPS = {
  stroke: "#eef0f4",
  strokeWidth: 1,
  vertical: false,
} as const;

/* ---------------------------- Tooltip ----------------------------- */

type TooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

export function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
  money = false,
  currency = "XAF",
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  unit?: string;
  money?: boolean;
  currency?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="pointer-events-none min-w-[9rem] rounded-lg border border-line bg-white/98 px-3 py-2 shadow-lg backdrop-blur">
      {label !== undefined ? (
        <p className="mb-1.5 text-2xs font-semibold tracking-wide text-ink-400 uppercase">{label}</p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-xs text-ink-600">
              <span className="size-2 shrink-0 rounded-[3px]" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="tnum text-xs font-semibold text-ink-900">
              {typeof entry.value === "number"
                ? money
                  ? formatMoneyCompact(entry.value, currency)
                  : `${formatNumber(entry.value, Number.isInteger(entry.value) ? 0 : 1)}${unit}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Légende ---------------------------- */

export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string; shape?: "dot" | "line" | "dash" }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs text-ink-500">
          {item.shape === "line" ? (
            <span className="h-0.5 w-3.5 rounded-full" style={{ background: item.color }} />
          ) : item.shape === "dash" ? (
            <span
              className="h-0.5 w-3.5 rounded-full opacity-80"
              style={{ backgroundImage: `repeating-linear-gradient(90deg, ${item.color} 0 4px, transparent 4px 7px)` }}
            />
          ) : (
            <span className="size-2 rounded-[3px]" style={{ background: item.color }} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------- Cadre de graphique ---------------------- */

export function ChartFrame({
  title,
  subtitle,
  legend,
  action,
  height = 260,
  children,
  className,
  footnote,
}: {
  title: string;
  subtitle?: string;
  legend?: React.ReactNode;
  action?: React.ReactNode;
  height?: number;
  children: React.ReactNode;
  className?: string;
  footnote?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface shadow-sm", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4 pb-2">
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-[13px] text-ink-500">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {legend}
          {action}
        </div>
      </div>
      <div className="px-2 pb-3" style={{ height }}>
        {children}
      </div>
      {footnote ? <p className="border-t border-line px-5 py-2 text-xs text-ink-400">{footnote}</p> : null}
    </div>
  );
}
