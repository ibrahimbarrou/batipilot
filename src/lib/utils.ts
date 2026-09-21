import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------
   Formatage monétaire — FCFA par défaut, jamais de décimales inutiles.
   Les montants sont stockés en unité entière (franc CFA).
------------------------------------------------------------------- */

const CURRENCY_LABEL: Record<string, string> = {
  XAF: "FCFA",
  XOF: "FCFA",
  EUR: "€",
  NGN: "₦",
  KES: "KSh",
};

export function formatMoney(value: number, currency = "XAF"): string {
  const suffix = CURRENCY_LABEL[currency] ?? currency;
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return currency === "EUR" ? `${formatted} ${suffix}` : `${formatted} ${suffix}`;
}

/** Version compacte pour les KPI : 128 M FCFA, 4,2 Md FCFA */
export function formatMoneyCompact(value: number, currency = "XAF"): string {
  const suffix = CURRENCY_LABEL[currency] ?? currency;
  const abs = Math.abs(value);
  const fmt = (v: number, d = 1) =>
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: d }).format(v);

  if (abs >= 1_000_000_000) return `${fmt(value / 1_000_000_000, 2)} Md ${suffix}`;
  if (abs >= 1_000_000) return `${fmt(value / 1_000_000)} M ${suffix}`;
  if (abs >= 1_000) return `${fmt(value / 1_000)} k ${suffix}`;
  return `${fmt(value, 0)} ${suffix}`;
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: digits,
  }).format(value)} %`;
}

/* ------------------------------------------------------------------
   Dates — toujours en français, sans dépendance au fuseau du client.
------------------------------------------------------------------- */

export function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function formatDate(value: string, style: "short" | "long" | "medium" = "medium"): string {
  const d = parseDate(value);
  if (Number.isNaN(d.getTime())) return value;
  if (style === "short") {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
  }
  if (style === "long") {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

/** "il y a 3 j" — la date de référence du jeu de démonstration est figée. */
export const TODAY = "2026-09-21";

export function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86_400_000);
}

export function relativeFromToday(value: string): string {
  const diff = daysBetween(TODAY, value);
  if (diff === 0) return "aujourd'hui";
  if (diff === 1) return "demain";
  if (diff === -1) return "hier";
  if (diff < 0) return `il y a ${Math.abs(diff)} j`;
  return `dans ${diff} j`;
}

export function relativeTime(at: string): string {
  // at au format "2026-09-21 14:32"
  const [date, time] = at.split(" ");
  const diff = daysBetween(TODAY, date);
  if (diff === 0) return time ?? "aujourd'hui";
  if (diff === -1) return `hier ${time ?? ""}`.trim();
  if (diff < -6) return formatDate(date, "short");
  return `il y a ${Math.abs(diff)} j`;
}

/* ------------------------------------------------------------------
   Divers
------------------------------------------------------------------- */

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Écart d'avancement réel vs prévu, exprimé en points. */
export function scheduleGap(progress: number, planned: number): number {
  return Math.round(progress - planned);
}

export function budgetUsage(spent: number, budget: number): number {
  if (!budget) return 0;
  return Math.round((spent / budget) * 100);
}

export function margin(contract: number, cost: number): number {
  if (!contract) return 0;
  return Math.round(((contract - cost) / contract) * 1000) / 10;
}
