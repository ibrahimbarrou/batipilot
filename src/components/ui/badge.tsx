import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-line bg-ink-50 text-ink-600",
        brand: "border-brand-200 bg-brand-50 text-brand-800",
        ok: "border-ok-100 bg-ok-50 text-ok-700",
        warn: "border-warn-100 bg-warn-50 text-warn-700",
        risk: "border-risk-100 bg-risk-50 text-risk-700",
        signal: "border-signal-200 bg-signal-50 text-signal-700",
        info: "border-info-100 bg-info-50 text-info-600",
        dark: "border-ink-800 bg-ink-900 text-white",
        outline: "border-line bg-transparent text-ink-600",
      },
      size: {
        sm: "px-2 py-0.5 text-2xs",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? <span className="size-1.5 rounded-full bg-current opacity-70" /> : null}
      {children}
    </span>
  );
}

/* --------------------- Statuts métier normalisés -------------------- */

export const healthMeta: Record<
  HealthStatus,
  { label: string; variant: "ok" | "warn" | "risk" | "neutral"; dotClass: string; barClass: string }
> = {
  on_track: { label: "À l'heure", variant: "ok", dotClass: "bg-ok-500", barClass: "bg-ok-500" },
  at_risk: { label: "Vigilance", variant: "warn", dotClass: "bg-warn-500", barClass: "bg-warn-500" },
  critical: { label: "Critique", variant: "risk", dotClass: "bg-risk-500", barClass: "bg-risk-500" },
  not_started: { label: "Non démarré", variant: "neutral", dotClass: "bg-ink-300", barClass: "bg-ink-300" },
};

export function HealthBadge({ health, size = "sm" }: { health: HealthStatus; size?: "sm" | "md" }) {
  const meta = healthMeta[health];
  return (
    <Badge variant={meta.variant} size={size}>
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </Badge>
  );
}

export const stageMeta: Record<string, string> = {
  prospection: "Prospection",
  etude: "Étude",
  preparation: "Préparation",
  execution: "Exécution",
  reception: "Réception",
  garantie: "Garantie",
  cloture: "Clôturé",
};

export const typeMeta: Record<string, string> = {
  batiment: "Bâtiment",
  route: "Route",
  vrd: "VRD",
  renovation: "Rénovation",
  genie_civil: "Génie civil",
  industriel: "Industriel",
};

export const invoiceStatusMeta: Record<
  string,
  { label: string; variant: "ok" | "warn" | "risk" | "neutral" | "brand" | "info" }
> = {
  draft: { label: "Brouillon", variant: "neutral" },
  sent: { label: "Envoyée", variant: "info" },
  partial: { label: "Partielle", variant: "warn" },
  paid: { label: "Payée", variant: "ok" },
  overdue: { label: "En retard", variant: "risk" },
};

export const quoteStatusMeta: Record<
  string,
  { label: string; variant: "ok" | "warn" | "risk" | "neutral" | "brand" | "info" }
> = {
  draft: { label: "Brouillon", variant: "neutral" },
  internal_review: { label: "Validation interne", variant: "warn" },
  sent: { label: "Envoyé", variant: "info" },
  signed: { label: "Signé", variant: "ok" },
  refused: { label: "Refusé", variant: "risk" },
  expired: { label: "Expiré", variant: "neutral" },
};

export const poStatusMeta: Record<
  string,
  { label: string; variant: "ok" | "warn" | "risk" | "neutral" | "brand" | "info" }
> = {
  draft: { label: "Brouillon", variant: "neutral" },
  to_validate: { label: "À valider", variant: "warn" },
  validated: { label: "Validé", variant: "brand" },
  delivered: { label: "Livré", variant: "info" },
  invoiced: { label: "Facturé", variant: "ok" },
};

export const assetStatusMeta: Record<
  string,
  { label: string; variant: "ok" | "warn" | "risk" | "neutral" | "brand" | "info" }
> = {
  in_service: { label: "En service", variant: "ok" },
  maintenance: { label: "En maintenance", variant: "warn" },
  idle: { label: "Disponible", variant: "neutral" },
  rented_out: { label: "Loué", variant: "info" },
  broken: { label: "Immobilisé", variant: "risk" },
};
