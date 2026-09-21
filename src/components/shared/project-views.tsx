"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CircleDot,
  MapPin,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge, HealthBadge, healthMeta, stageMeta, typeMeta } from "@/components/ui/badge";
import { AvatarStack, Progress } from "@/components/ui/data-display";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { Hint } from "@/components/ui/overlay";
import { clientById } from "@/data/clients";
import { employees, people } from "@/data/org";
import {
  budgetUsage,
  cn,
  daysBetween,
  formatDate,
  formatMoneyCompact,
  formatPercent,
  parseDate,
  scheduleGap,
  TODAY,
} from "@/lib/utils";
import type { Project } from "@/types";

/* ------------------------------------------------------------------
   Utilitaires partagés
------------------------------------------------------------------- */

function teamOf(project: Project) {
  return project.teamIds
    .map((id) => {
      const emp = employees.find((e) => e.id === id);
      if (emp) return { initials: emp.initials, tone: emp.tone, name: emp.name };
      const person = people.find((p) => p.id === id);
      return person ? { initials: person.initials, tone: person.avatarTone, name: person.name } : null;
    })
    .filter(Boolean) as { initials: string; tone: string; name: string }[];
}

export function ScheduleGap({ project }: { project: Project }) {
  const gap = scheduleGap(project.progress, project.plannedProgress);
  if (gap === 0) return <span className="text-xs text-ink-400">conforme au planning</span>;
  const late = gap < 0;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", late ? "text-risk-600" : "text-ok-600")}>
      {late ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
      {late ? `${Math.abs(gap)} pts de retard` : `${gap} pts d'avance`}
    </span>
  );
}

/* ------------------------------ Carte ----------------------------- */

export function ProjectCard({ project }: { project: Project }) {
  const client = clientById(project.clientId);
  const usage = budgetUsage(project.spent, project.budget);
  const meta = healthMeta[project.health];
  const team = teamOf(project);

  return (
    <Link
      href={`/projets/${project.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <span className={cn("absolute inset-x-0 top-0 h-[3px]", meta.barClass)} />

      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="tnum text-[11px] font-semibold tracking-wide text-ink-400">{project.code}</span>
            <Badge variant="outline" size="sm">
              {typeMeta[project.type]}
            </Badge>
          </div>
          <h3 className="line-clamp-2 min-h-[2.6em] text-[14px] leading-snug font-semibold text-ink-900 group-hover:text-brand-800">
            {project.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-ink-500">{client?.name}</p>
        </div>
        <HealthBadge health={project.health} />
      </div>

      <div className="px-4 pb-3">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs text-ink-500">Avancement</span>
          <span className="tnum text-[13px] font-semibold text-ink-900">{project.progress} %</span>
        </div>
        <div className="relative">
          <Progress value={project.progress} barClassName={meta.barClass} />
          <Hint label={`Planning de référence : ${project.plannedProgress} %`}>
            <span
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ink-900/40"
              style={{ left: `${project.plannedProgress}%` }}
            />
          </Hint>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <ScheduleGap project={project} />
          <span className="text-xs text-ink-400">{stageMeta[project.stage]}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
        <div className="bg-surface px-4 py-2.5">
          <p className="text-[11px] text-ink-400">Marché</p>
          <p className="tnum text-[13px] font-semibold text-ink-900">
            {formatMoneyCompact(project.contractAmount, project.currency)}
          </p>
        </div>
        <div className="bg-surface px-4 py-2.5">
          <p className="text-[11px] text-ink-400">Budget consommé</p>
          <p
            className={cn(
              "tnum text-[13px] font-semibold",
              usage > 100 ? "text-risk-600" : usage > 85 ? "text-warn-600" : "text-ink-900",
            )}
          >
            {usage} %
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line bg-surface-2 px-4 py-2.5">
        <span className="flex items-center gap-1.5 truncate text-xs text-ink-500">
          <MapPin className="size-3.5 shrink-0 text-ink-400" />
          {project.city}
        </span>
        <AvatarStack people={team} max={3} size="xs" />
      </div>
    </Link>
  );
}

/* ------------------------------ Liste ----------------------------- */

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <TableWrap>
      <Table>
        <THead>
          <TR>
            <TH>Projet</TH>
            <TH>Client</TH>
            <TH>Santé</TH>
            <TH align="right">Marché</TH>
            <TH align="right">Consommé</TH>
            <TH>Avancement</TH>
            <TH align="right">Fin prévue</TH>
            <TH>Équipe</TH>
            <TH align="right"></TH>
          </TR>
        </THead>
        <TBody>
          {projects.map((project) => {
            const client = clientById(project.clientId);
            const usage = budgetUsage(project.spent, project.budget);
            const late = daysBetween(project.endDate, project.forecastEndDate);
            return (
              <TR key={project.id} interactive>
                <TD>
                  <Link href={`/projets/${project.id}`} className="block min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink-900">{project.name}</span>
                    <span className="tnum block text-[11px] text-ink-400">
                      {project.code} · {project.city}
                    </span>
                  </Link>
                </TD>
                <TD className="max-w-[10rem] truncate">{client?.name}</TD>
                <TD>
                  <HealthBadge health={project.health} />
                </TD>
                <TD align="right" className="tnum font-medium text-ink-900">
                  {formatMoneyCompact(project.contractAmount, project.currency)}
                </TD>
                <TD align="right">
                  <span className={cn("tnum font-medium", usage > 100 ? "text-risk-600" : usage > 85 ? "text-warn-600" : "text-ink-700")}>
                    {usage} %
                  </span>
                </TD>
                <TD className="w-44">
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} size="xs" barClassName={healthMeta[project.health].barClass} />
                    <span className="tnum w-9 text-right text-xs font-medium text-ink-700">{project.progress} %</span>
                  </div>
                </TD>
                <TD align="right">
                  <span className="block text-[13px] text-ink-700">{formatDate(project.forecastEndDate, "short")}</span>
                  {late > 0 ? (
                    <span className="text-[11px] font-medium text-risk-600">+{late} j</span>
                  ) : (
                    <span className="text-[11px] text-ok-600">à l&apos;heure</span>
                  )}
                </TD>
                <TD>
                  <AvatarStack people={teamOf(project)} max={3} size="xs" />
                </TD>
                <TD align="right">
                  <Link href={`/projets/${project.id}`} className="inline-flex rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                    <ArrowUpRight className="size-4" />
                  </Link>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </TableWrap>
  );
}

/* ------------------------------ Kanban ---------------------------- */

const KANBAN_COLUMNS = [
  { id: "etude", label: "Étude" },
  { id: "preparation", label: "Préparation" },
  { id: "execution", label: "Exécution" },
  { id: "reception", label: "Réception" },
  { id: "cloture", label: "Clôturé" },
] as const;

export function ProjectKanban({ projects }: { projects: Project[] }) {
  return (
    <div className="scrollbar-slim -mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
      {KANBAN_COLUMNS.map((col) => {
        const items = projects.filter((p) => p.stage === col.id);
        const total = items.reduce((s, p) => s + p.contractAmount, 0);
        return (
          <div key={col.id} className="flex w-[290px] shrink-0 flex-col rounded-lg border border-line bg-ink-50/60">
            <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-ink-800">{col.label}</span>
                <span className="tnum rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium text-ink-500 ring-1 ring-line">
                  {items.length}
                </span>
              </div>
              <span className="tnum text-[11px] text-ink-400">{formatMoneyCompact(total)}</span>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {items.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-ink-400">Aucun projet</p>
              ) : (
                items.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projets/${project.id}`}
                    className="block rounded-lg border border-line bg-white p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="tnum text-[10px] font-semibold tracking-wide text-ink-400">{project.code}</span>
                      <span className={cn("size-2 rounded-full", healthMeta[project.health].dotClass)} />
                    </div>
                    <p className="line-clamp-2 text-[13px] leading-snug font-medium text-ink-900">{project.name}</p>
                    <p className="mt-1 truncate text-[11px] text-ink-400">{clientById(project.clientId)?.name}</p>
                    <div className="mt-2.5">
                      <Progress value={project.progress} size="xs" barClassName={healthMeta[project.health].barClass} />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="tnum text-[11px] font-medium text-ink-600">
                        {formatMoneyCompact(project.contractAmount, project.currency)}
                      </span>
                      <AvatarStack people={teamOf(project)} max={2} size="xs" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- Timeline --------------------------- */

export function ProjectTimeline({ projects }: { projects: Project[] }) {
  const events = projects
    .flatMap((p) =>
      p.milestones.map((m) => ({
        ...m,
        projectId: p.id,
        projectName: p.name,
        code: p.code,
        health: p.health,
        days: daysBetween(TODAY, m.date),
      })),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
    const key = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(parseDate(e.date));
    (acc[key] ||= []).push(e);
    return acc;
  }, {});

  return (
    <div className="relative">
      <span className="absolute top-2 bottom-2 left-[7.5rem] w-px bg-line" aria-hidden />
      <div className="space-y-8">
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month}>
            <p className="mb-3 ml-[8.5rem] text-[11px] font-semibold tracking-[0.1em] text-ink-400 uppercase">{month}</p>
            <div className="space-y-2.5">
              {items.map((event) => {
                const past = event.days < 0;
                const late = event.status === "late";
                return (
                  <div key={event.id} className="flex items-start gap-4">
                    <span className="tnum w-[7rem] shrink-0 pt-2 text-right text-[12px] text-ink-500">
                      {formatDate(event.date, "medium")}
                    </span>
                    <span className="relative flex w-[1rem] shrink-0 justify-center pt-2.5">
                      <span
                        className={cn(
                          "size-2.5 rounded-full ring-4 ring-canvas",
                          late ? "bg-risk-500" : event.status === "done" ? "bg-ok-500" : event.status === "current" ? "bg-brand-600" : "bg-ink-300",
                        )}
                      />
                    </span>
                    <Link
                      href={`/projets/${event.projectId}`}
                      className={cn(
                        "flex-1 rounded-lg border border-line bg-surface px-4 py-2.5 shadow-xs transition-all hover:border-brand-200 hover:shadow-sm",
                        past && event.status !== "late" && "opacity-70",
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink-900">{event.label}</p>
                          <p className="truncate text-[11px] text-ink-400">
                            {event.code} · {event.projectName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.amount ? (
                            <span className="tnum text-[13px] font-semibold text-ink-800">
                              {formatMoneyCompact(event.amount)}
                            </span>
                          ) : null}
                          {late ? (
                            <Badge variant="risk" size="sm">
                              <AlertTriangle className="size-3" />
                              en retard
                            </Badge>
                          ) : event.status === "current" ? (
                            <Badge variant="brand" size="sm">
                              <CircleDot className="size-3" />
                              en cours
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Gantt ---------------------------- */

export function GanttChart({ project }: { project: Project }) {
  const tasks = project.tasks;
  const min = Math.min(...tasks.map((t) => parseDate(t.start).getTime()));
  const max = Math.max(...tasks.map((t) => parseDate(t.end).getTime()));
  const span = max - min || 1;
  const pos = (d: string) => ((parseDate(d).getTime() - min) / span) * 100;
  const todayPos = ((parseDate(TODAY).getTime() - min) / span) * 100;

  // En-têtes de mois
  const months: { label: string; left: number }[] = [];
  const cursor = new Date(min);
  cursor.setDate(1);
  while (cursor.getTime() <= max) {
    months.push({
      label: new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit" }).format(cursor),
      left: ((cursor.getTime() - min) / span) * 100,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className="scrollbar-slim overflow-x-auto rounded-lg border border-line bg-surface">
      <div className="min-w-[860px]">
        {/* En-tête */}
        <div className="flex border-b border-line bg-surface-2">
          <div className="w-64 shrink-0 border-r border-line px-4 py-2.5 text-2xs font-semibold tracking-wide text-ink-500 uppercase">
            Tâche
          </div>
          <div className="relative h-10 flex-1">
            {months.map((m) => (
              <span
                key={m.label + m.left}
                className="absolute top-1/2 -translate-y-1/2 border-l border-line pl-1.5 text-[10px] font-medium text-ink-400"
                style={{ left: `${m.left}%`, height: "100%", display: "flex", alignItems: "center" }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* Lignes */}
        <div className="relative divide-y divide-line">
          <div className="pointer-events-none absolute inset-y-0 right-0 left-64 z-10">
            <span className="absolute top-0 bottom-0 w-px bg-signal-500" style={{ left: `${todayPos}%` }}>
              <span className="absolute top-0 -left-3.5 rounded-sm bg-signal-500 px-1 py-0.5 text-[9px] font-semibold text-white">
                auj.
              </span>
            </span>
          </div>

          {tasks.map((task) => {
            const lot = project.lots.find((l) => l.id === task.lotId);
            const left = pos(task.start);
            const width = Math.max(pos(task.end) - left, 1.2);
            return (
              <div key={task.id} className="group flex hover:bg-brand-50/30">
                <div className="w-64 shrink-0 border-r border-line px-4 py-2.5">
                  <p className="truncate text-[13px] font-medium text-ink-800">{task.name}</p>
                  <p className="truncate text-[11px] text-ink-400">{lot?.name}</p>
                </div>
                <div className="relative flex-1 py-2.5">
                  <div className="relative h-6">
                    <div
                      className={cn(
                        "absolute top-1/2 h-5 -translate-y-1/2 overflow-hidden rounded-[4px] shadow-xs transition-all",
                        task.critical ? "bg-brand-100 ring-1 ring-brand-300" : "bg-ink-100",
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div
                        className={cn(
                          "h-full rounded-[4px]",
                          task.progress === 100
                            ? "bg-ok-500"
                            : task.critical
                              ? "bg-brand-700"
                              : "bg-brand-500",
                        )}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span
                      className="absolute top-1/2 -translate-y-1/2 pl-2 text-[11px] font-medium text-ink-500 opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ left: `calc(${left}% + ${width}%)` }}
                    >
                      {task.progress} % · {task.assignee}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-line bg-surface-2 px-4 py-2.5 text-[11px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-[3px] bg-brand-700" /> chemin critique
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-[3px] bg-brand-500" /> tâche courante
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-[3px] bg-ok-500" /> terminée
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-px bg-signal-500" /> aujourd&apos;hui
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Carte ---------------------------- */

export function PortfolioMap({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState<string | null>(null);
  const selected = projects.find((p) => p.id === active);

  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-ink-950 shadow-sm">
      <div className="grid-blueprint absolute inset-0 opacity-60" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-[0.18]">
        <path
          d="M6,38 C14,32 20,36 26,44 C31,51 30,58 34,64 C38,70 44,72 48,78 C52,84 50,92 56,95 L2,95 Z"
          fill="#3665f0"
        />
        <path
          d="M26,44 C34,40 42,42 50,46 C58,50 66,48 74,52 C82,56 88,62 94,60 L94,95 L56,95 C50,92 52,84 48,78 C44,72 38,70 34,64 C30,58 31,51 26,44 Z"
          fill="#2148db"
        />
      </svg>

      <div className="relative h-[460px]">
        {projects.map((project) => {
          const meta = healthMeta[project.health];
          const isActive = active === project.id;
          return (
            <button
              key={project.id}
              onMouseEnter={() => setActive(project.id)}
              onFocus={() => setActive(project.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${project.map.x}%`, top: `${project.map.y}%` }}
              aria-label={project.name}
            >
              <span
                className={cn(
                  "relative flex size-3.5 items-center justify-center rounded-full ring-4 transition-all",
                  meta.dotClass,
                  isActive ? "scale-125 ring-white/25" : "ring-white/10",
                )}
              >
                {project.health === "critical" ? (
                  <span className="absolute inline-flex size-3.5 animate-ping rounded-full bg-risk-500 opacity-60" />
                ) : null}
              </span>
              <span
                className={cn(
                  "absolute top-1/2 left-5 -translate-y-1/2 rounded-md bg-ink-900/90 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-lg backdrop-blur transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                {project.city} · {project.code}
              </span>
            </button>
          );
        })}

        {/* Panneau d'information */}
        <div className="absolute right-4 bottom-4 left-4 sm:left-auto sm:w-80">
          {selected ? (
            <Link
              href={`/projets/${selected.id}`}
              className="block rounded-xl border border-white/10 bg-white/95 p-4 shadow-xl backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="tnum text-[11px] font-semibold text-ink-400">{selected.code}</p>
                  <p className="truncate text-[14px] font-semibold text-ink-900">{selected.name}</p>
                  <p className="truncate text-xs text-ink-500">
                    {clientById(selected.clientId)?.name} · {selected.city}
                  </p>
                </div>
                <HealthBadge health={selected.health} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-ink-400 uppercase">Marché</p>
                  <p className="tnum text-[13px] font-semibold text-ink-900">
                    {formatMoneyCompact(selected.contractAmount, selected.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-400 uppercase">Avancement</p>
                  <p className="tnum text-[13px] font-semibold text-ink-900">{formatPercent(selected.progress)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-ink-400 uppercase">Fin</p>
                  <p className="text-[13px] font-semibold text-ink-900">{formatDate(selected.forecastEndDate, "short")}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur">
              <p className="text-[13px] text-white/70">Survolez un chantier pour afficher son état</p>
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 rounded-lg border border-white/10 bg-ink-900/70 px-3 py-2.5 backdrop-blur">
          <p className="mb-0.5 text-[10px] font-semibold tracking-[0.1em] text-white/40 uppercase">Santé</p>
          {(["on_track", "at_risk", "critical", "not_started"] as const).map((h) => (
            <span key={h} className="flex items-center gap-2 text-[11px] text-white/70">
              <span className={cn("size-2 rounded-full", healthMeta[h].dotClass)} />
              {healthMeta[h].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Bandeau de contrôle des vues ---------------- */

export function ViewSwitch<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-ink-50 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-all",
            value === opt.id ? "bg-white text-ink-900 shadow-xs" : "text-ink-500 hover:text-ink-800",
          )}
        >
          <opt.icon className="size-4" />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export { CalendarDays, MoreHorizontal };
