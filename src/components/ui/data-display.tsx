"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn, clamp } from "@/lib/utils";

/* ------------------------------ Avatar ----------------------------- */

export function Avatar({
  initials,
  tone = "bg-brand-700",
  size = "md",
  className,
  ring,
  title,
}: {
  initials: string;
  tone?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
  title?: string;
}) {
  const sizes = {
    xs: "size-6 text-[10px]",
    sm: "size-7 text-[11px]",
    md: "size-8 text-xs",
    lg: "size-10 text-sm",
    xl: "size-14 text-lg",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-white select-none",
        sizes[size],
        tone,
        ring && "ring-2 ring-white",
        className,
      )}
      title={title}
    >
      {initials}
    </span>
  );
}

export function AvatarStack({
  people,
  max = 4,
  size = "sm",
}: {
  people: { initials: string; tone?: string; name?: string }[];
  max?: number;
  size?: "xs" | "sm" | "md";
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className="flex -space-x-1.5">
      {shown.map((p, i) => (
        <Avatar key={i} initials={p.initials} tone={p.tone} size={size} ring title={p.name} />
      ))}
      {rest > 0 ? (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-ink-100 font-semibold text-ink-500 ring-2 ring-white",
            size === "xs" ? "size-6 text-[10px]" : size === "sm" ? "size-7 text-[11px]" : "size-8 text-xs",
          )}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  );
}

export const AvatarImage = AvatarPrimitive.Image;

/* ----------------------------- Progress ---------------------------- */

export function Progress({
  value,
  className,
  barClassName,
  size = "md",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  size?: "xs" | "sm" | "md";
}) {
  const heights = { xs: "h-1", sm: "h-1.5", md: "h-2" };
  return (
    <ProgressPrimitive.Root
      value={clamp(value)}
      className={cn("w-full overflow-hidden rounded-full bg-ink-100", heights[size], className)}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full bg-brand-700 transition-[width] duration-700 ease-out", barClassName)}
        style={{ width: `${clamp(value)}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

/** Jauge circulaire — utilisée pour l'avancement global d'un chantier. */
export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  className,
  trackClass = "text-ink-100",
  barClass = "text-brand-700",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClass?: string;
  barClass?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamp(value) / 100) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={trackClass} stroke="currentColor" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", barClass)}
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------------------------- Separator ---------------------------- */

export const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-line", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
    {...props}
  />
));
Separator.displayName = "Separator";

/* ----------------------------- Skeleton ---------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

/* ---------------------------- État vide ---------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      {icon ? (
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-line bg-ink-50 text-ink-400 [&_svg]:size-5">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-ink-800">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[13px] text-ink-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* ------------------------- Ligne clé / valeur ----------------------- */

export function DataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2", className)}>
      <span className="text-[13px] text-ink-500">{label}</span>
      <span className="tnum text-[13px] font-medium text-ink-900">{value}</span>
    </div>
  );
}
