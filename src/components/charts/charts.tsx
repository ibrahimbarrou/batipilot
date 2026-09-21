"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS, ChartTooltip, GRID_PROPS, SERIES } from "./kit";
import { formatMoneyCompact } from "@/lib/utils";

const compactAxis = (v: number) => {
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000)}k`;
  return `${v}`;
};

/* ------------------- Tendance chiffre d'affaires ------------------ */

export function RevenueTrend({
  data,
}: {
  data: { month: string; facture: number; encaisse: number; depense: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="g-facture" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES[0]} stopOpacity={0.16} />
            <stop offset="100%" stopColor={SERIES[0]} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g-encaisse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES[2]} stopOpacity={0.14} />
            <stop offset="100%" stopColor={SERIES[2]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: AXIS.stroke }} tick={AXIS.tick} dy={4} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS.tick}
          width={44}
          tickFormatter={(v: number) => `${v}M`}
        />
        <Tooltip content={<ChartTooltip unit=" M FCFA" />} cursor={{ stroke: "#cbd1dc", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="facture"
          name="Facturé"
          stroke={SERIES[0]}
          strokeWidth={2}
          fill="url(#g-facture)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="encaisse"
          name="Encaissé"
          stroke={SERIES[2]}
          strokeWidth={2}
          fill="url(#g-encaisse)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="depense"
          name="Dépensé"
          stroke={SERIES[1]}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ------------------------- Trésorerie 13 s ------------------------ */

export function CashflowChart({
  data,
}: {
  data: { week: string; encaissements: number; decaissements: number; solde: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }} barGap={2}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="week" tickLine={false} axisLine={{ stroke: AXIS.stroke }} tick={AXIS.tick} dy={4} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS.tick} width={44} tickFormatter={(v: number) => `${v}M`} />
        <Tooltip content={<ChartTooltip unit=" M FCFA" />} cursor={{ fill: "rgba(33,72,219,0.04)" }} />
        <Bar dataKey="encaissements" name="Encaissements" fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="decaissements" name="Décaissements" fill={SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Line
          type="monotone"
          dataKey="solde"
          name="Solde projeté"
          stroke={SERIES[3]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* --------------------------- Marge suivie ------------------------- */

export function MarginChart({
  data,
}: {
  data: { month: string; previsionnelle: number; reelle: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 24, left: 4, bottom: 0 }}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: AXIS.stroke }} tick={AXIS.tick} dy={4} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS.tick}
          width={40}
          domain={[15, 25]}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip content={<ChartTooltip unit=" %" />} cursor={{ stroke: "#cbd1dc", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="previsionnelle"
          name="Marge prévisionnelle"
          stroke={SERIES[4]}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="reelle"
          name="Marge réelle"
          stroke={SERIES[0]}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, stroke: "#fff", fill: SERIES[0] }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* --------------------- Répartition des dépenses ------------------- */

export function CategoryDonut({
  data,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip money />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SERIES[i % SERIES.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerValue ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum text-lg font-semibold tracking-[-0.02em] text-ink-900">{centerValue}</span>
          {centerLabel ? <span className="text-xs text-ink-400">{centerLabel}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------- Santé du portefeuille (statut) --------------- */

export function HealthDonut({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltip unit=" chantiers" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="58%"
          outerRadius="90%"
          paddingAngle={2}
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/* --------------------- Budget consommé par projet ----------------- */

export function BudgetUsageChart({
  data,
}: {
  data: { name: string; budget: number; engage: number; realise: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barGap={2}>
        <CartesianGrid stroke="#eef0f4" strokeWidth={1} horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tick={AXIS.tick} tickFormatter={compactAxis} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ ...AXIS.tick, fontSize: 11 }}
          width={132}
        />
        <Tooltip content={<ChartTooltip unit=" M FCFA" />} cursor={{ fill: "rgba(33,72,219,0.04)" }} />
        <Bar dataKey="budget" name="Budget" fill="#e2e5ec" radius={[0, 4, 4, 0]} maxBarSize={10} />
        <Bar dataKey="engage" name="Engagé" fill={SERIES[4]} radius={[0, 4, 4, 0]} maxBarSize={10} />
        <Bar dataKey="realise" name="Réalisé" fill={SERIES[0]} radius={[0, 4, 4, 0]} maxBarSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------------------------- Sparkline --------------------------- */

export function Sparkline({
  data,
  color = SERIES[0],
  height = 36,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const shaped = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={shaped} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* -------------------- Entonnoir de conversion --------------------- */

export function FunnelBars({ data }: { data: { stage: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2.5 px-3 py-1">
      {data.map((d, i) => (
        <div key={d.stage} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-ink-500">{d.stage}</span>
          <div className="h-6 flex-1 overflow-hidden rounded-r-md bg-ink-50">
            <div
              className="flex h-full items-center justify-end rounded-r-md pr-2 transition-[width] duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: SERIES[0],
                opacity: 1 - i * 0.12,
              }}
            >
              <span className="tnum text-xs font-semibold text-white">{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------- Jauge radiale (taux global) ------------------ */

export function GaugeRadial({ value, color = SERIES[0] }: { value: number; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        innerRadius="72%"
        outerRadius="100%"
        data={[{ name: "valeur", value }]}
        startAngle={210}
        endAngle={-30}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background={{ fill: "#eef0f4" }} dataKey="value" cornerRadius={8} fill={color} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export { formatMoneyCompact };
