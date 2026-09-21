"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Camera,
  CircleAlert,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  Flag,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Pencil,
  Share2,
  ShieldAlert,
  Truck,
  Users,
} from "lucide-react";
import { Badge, HealthBadge, healthMeta, stageMeta, typeMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarStack, DataRow, Progress, ProgressRing } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { GanttChart, ScheduleGap } from "@/components/shared/project-views";
import { clientById } from "@/data/clients";
import { documents, employees, expenses, incidents, invoices, people, sitePhotos, siteReports, suppliers } from "@/data";
import {
  budgetUsage,
  cn,
  daysBetween,
  formatDate,
  formatMoney,
  formatMoneyCompact,
  formatNumber,
  formatPercent,
  relativeTime,
  TODAY,
} from "@/lib/utils";
import type { Project } from "@/types";
import { PhotoScene } from "@/components/shared/photo-tile";

export function ProjectDetail({ project }: { project: Project }) {
  const client = clientById(project.clientId);
  const manager = people.find((p) => p.id === project.managerId);
  const usage = budgetUsage(project.spent, project.budget);
  const drift = daysBetween(project.endDate, project.forecastEndDate);
  const team = project.teamIds
    .map((id) => {
      const emp = employees.find((e) => e.id === id);
      if (emp) return { initials: emp.initials, tone: emp.tone, name: emp.name, job: emp.job };
      const person = people.find((p) => p.id === id);
      return person ? { initials: person.initials, tone: person.avatarTone, name: person.name, job: person.role } : null;
    })
    .filter(Boolean) as { initials: string; tone: string; name: string; job: string }[];

  const projectReports = siteReports.filter((r) => r.projectId === project.id);
  const projectIncidents = incidents.filter((i) => i.projectId === project.id);
  const projectExpenses = expenses.filter((e) => e.projectId === project.id);
  const projectInvoices = invoices.filter((i) => i.projectId === project.id);
  const projectDocs = documents.filter((d) => d.projectId === project.id);
  const projectPhotos = sitePhotos.filter((p) => p.projectId === project.id);
  const projectSuppliers = suppliers.filter((s) => project.supplierIds.includes(s.id));

  return (
    <>
      {/* ------------------------- En-tête ------------------------- */}
      <div className="mb-5">
        <Link
          href="/projets"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-800"
        >
          <ArrowLeft className="size-4" />
          Portefeuille
        </Link>

        <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
          <span className={cn("absolute inset-x-0 top-0 h-1", healthMeta[project.health].barClass)} />
          <div className="flex flex-wrap items-start justify-between gap-5 px-6 pt-6 pb-5">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="tnum text-[12px] font-semibold tracking-wide text-ink-400">{project.code}</span>
                <Badge variant="outline">{typeMeta[project.type]}</Badge>
                <Badge variant="brand">{stageMeta[project.stage]}</Badge>
                <HealthBadge health={project.health} size="md" />
              </div>
              <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.03em] text-ink-900">
                {project.name}
              </h1>
              <p className="text-balance-pretty mt-2 max-w-3xl text-[14px] leading-relaxed text-ink-500">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ink-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-ink-400" />
                  {project.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-ink-400" />
                  {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 text-ink-400" />
                  {client?.name}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <Share2 />
                  Partager
                </Button>
                <Button variant="secondary" size="sm">
                  <Download />
                  Rapport PDF
                </Button>
                <Button size="sm">
                  <Pencil />
                  Modifier
                </Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-2 px-3 py-2">
                <Avatar initials={manager?.initials ?? "??"} tone={manager?.avatarTone} size="md" />
                <div className="text-right">
                  <p className="text-[12px] leading-tight text-ink-400">Chef de projet</p>
                  <p className="text-[13px] leading-tight font-medium text-ink-900">{manager?.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bandeau de chiffres clés */}
          <div className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-6">
            <div className="flex items-center gap-4 bg-surface px-6 py-4">
              <ProgressRing
                value={project.progress}
                size={64}
                stroke={6}
                barClass={
                  project.health === "critical"
                    ? "text-risk-500"
                    : project.health === "at_risk"
                      ? "text-warn-500"
                      : "text-brand-700"
                }
              >
                <span className="tnum text-[14px] font-semibold text-ink-900">{project.progress}%</span>
              </ProgressRing>
              <div>
                <p className="text-[11px] tracking-wide text-ink-400 uppercase">Avancement</p>
                <p className="tnum text-[13px] font-medium text-ink-700">prévu {project.plannedProgress} %</p>
                <ScheduleGap project={project} />
              </div>
            </div>

            <StatCell label="Montant du marché" value={formatMoneyCompact(project.contractAmount, project.currency)} sub={`${formatNumber(project.surface)} m²`} />
            <StatCell
              label="Budget consommé"
              value={`${usage} %`}
              sub={`${formatMoneyCompact(project.spent)} / ${formatMoneyCompact(project.budget)}`}
              tone={usage > 100 ? "risk" : usage > 85 ? "warn" : "default"}
            />
            <StatCell label="Engagé" value={formatMoneyCompact(project.committed)} sub={`reste ${formatMoneyCompact(project.budget - project.committed)}`} />
            <StatCell
              label="Encaissé"
              value={formatMoneyCompact(project.collected)}
              sub={`facturé ${formatMoneyCompact(project.invoiced)}`}
            />
            <StatCell
              label="Fin projetée"
              value={formatDate(project.forecastEndDate, "short")}
              sub={drift > 0 ? `${drift} jours de dérive` : "conforme au contrat"}
              tone={drift > 30 ? "risk" : drift > 0 ? "warn" : "ok"}
            />
          </div>
        </div>
      </div>

      {/* --------------------------- Onglets ----------------------- */}
      <Tabs defaultValue="synthese">
        <TabsList variant="underline" className="mb-5 w-full overflow-x-auto">
          <TabsTrigger variant="underline" value="synthese">
            <ClipboardList />
            Synthèse
          </TabsTrigger>
          <TabsTrigger variant="underline" value="planning">
            <CalendarDays />
            Planning
          </TabsTrigger>
          <TabsTrigger variant="underline" value="chantier">
            <Camera />
            Chantier
          </TabsTrigger>
          <TabsTrigger variant="underline" value="budget">
            <Banknote />
            Budget
          </TabsTrigger>
          <TabsTrigger variant="underline" value="achats">
            <Truck />
            Fournisseurs
          </TabsTrigger>
          <TabsTrigger variant="underline" value="documents">
            <FileText />
            Documents
          </TabsTrigger>
          <TabsTrigger variant="underline" value="risques">
            <ShieldAlert />
            Risques
          </TabsTrigger>
        </TabsList>

        {/* ---------------------- Synthèse ------------------------ */}
        <TabsContent value="synthese">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="space-y-4 xl:col-span-8">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Avancement par lot</CardTitle>
                    <p className="mt-0.5 text-[13px] text-ink-500">
                      L&apos;avancement global est pondéré par le poids budgétaire de chaque lot
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <TableWrap className="rounded-none border-0 border-t border-line">
                    <Table>
                      <THead>
                        <TR>
                          <TH>Lot</TH>
                          <TH>Responsable</TH>
                          <TH align="right">Budget</TH>
                          <TH align="right">Engagé</TH>
                          <TH align="right">Réalisé</TH>
                          <TH>Avancement</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {project.lots.map((lot) => {
                          const lotUsage = budgetUsage(lot.spent, lot.budget);
                          return (
                            <TR key={lot.id}>
                              <TD>
                                <span className="flex items-center gap-2">
                                  <span className={cn("size-2 rounded-full", healthMeta[lot.status].dotClass)} />
                                  <span className="font-medium text-ink-900">{lot.name}</span>
                                </span>
                              </TD>
                              <TD>{lot.lead}</TD>
                              <TD align="right" className="tnum">{formatMoneyCompact(lot.budget)}</TD>
                              <TD align="right" className="tnum">{formatMoneyCompact(lot.committed)}</TD>
                              <TD align="right">
                                <span className={cn("tnum font-medium", lotUsage > 95 ? "text-risk-600" : "text-ink-800")}>
                                  {formatMoneyCompact(lot.spent)}
                                </span>
                              </TD>
                              <TD className="w-40">
                                <div className="flex items-center gap-2">
                                  <Progress value={lot.progress} size="xs" barClassName={healthMeta[lot.status].barClass} />
                                  <span className="tnum w-9 text-right text-xs font-medium">{lot.progress} %</span>
                                </div>
                              </TD>
                            </TR>
                          );
                        })}
                      </TBody>
                    </Table>
                  </TableWrap>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Derniers rapports de chantier</CardTitle>
                  <Button variant="ghost" size="xs" asChild>
                    <Link href="/chantiers">Tout voir</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projectReports.length === 0 ? (
                    <p className="py-6 text-center text-[13px] text-ink-400">Aucun rapport enregistré.</p>
                  ) : (
                    projectReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="rounded-lg border border-line bg-surface-2 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="brand" size="sm">
                              {formatDate(report.date)}
                            </Badge>
                            <span className="text-[13px] font-medium text-ink-900">{report.author}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[12px] text-ink-500">
                            <span>{report.weather} · {report.temperature} °C</span>
                            <span>{report.headcount} présents</span>
                            <span className="flex items-center gap-1">
                              <ImageIcon className="size-3.5" />
                              {report.photos}
                            </span>
                          </div>
                        </div>
                        <ul className="mt-2.5 space-y-1">
                          {report.tasksDone.map((task) => (
                            <li key={task} className="flex items-start gap-2 text-[13px] text-ink-700">
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-500" />
                              {task}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2.5 border-t border-line pt-2.5 text-[13px] leading-relaxed text-ink-500">
                          {report.observations}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Jalons contractuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="relative space-y-4">
                    <span className="absolute top-1 bottom-1 left-[7px] w-px bg-line" aria-hidden />
                    {project.milestones.map((m) => (
                      <li key={m.id} className="relative flex gap-3.5">
                        <span
                          className={cn(
                            "relative z-10 mt-1 size-3.5 shrink-0 rounded-full ring-4 ring-surface",
                            m.status === "done"
                              ? "bg-ok-500"
                              : m.status === "current"
                                ? "bg-brand-600"
                                : m.status === "late"
                                  ? "bg-risk-500"
                                  : "bg-ink-300",
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-medium text-ink-900">{m.label}</span>
                            {m.status === "late" ? (
                              <Badge variant="risk" size="sm">
                                en retard
                              </Badge>
                            ) : null}
                          </span>
                          <span className="mt-0.5 flex items-center justify-between gap-2">
                            <span className="text-[12px] text-ink-400">{formatDate(m.date)}</span>
                            {m.amount ? (
                              <span className="tnum text-[12px] font-semibold text-ink-700">
                                {formatMoneyCompact(m.amount)}
                              </span>
                            ) : null}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Équipe affectée</CardTitle>
                  <AvatarStack people={team} max={4} size="xs" />
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {team.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <Avatar initials={member.initials} tone={member.tone} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink-900">{member.name}</p>
                        <p className="truncate text-[11px] text-ink-400">{member.job}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client</CardTitle>
                  <Button variant="ghost" size="icon-xs" asChild>
                    <Link href="/portail">
                      <ExternalLink />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar initials={client?.name.slice(0, 2).toUpperCase() ?? "CL"} tone={client?.tone} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink-900">{client?.name}</p>
                      <p className="truncate text-[12px] text-ink-400">
                        {client?.contact} · {client?.city}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 divide-y divide-line border-t border-line">
                    <DataRow label="Type" value={client?.type} />
                    <DataRow label="Facturé" value={formatMoneyCompact(project.invoiced)} />
                    <DataRow label="Encaissé" value={formatMoneyCompact(project.collected)} />
                    <DataRow
                      label="Reste à encaisser"
                      value={
                        <span className={project.invoiced - project.collected > 0 ? "text-risk-600" : ""}>
                          {formatMoneyCompact(project.invoiced - project.collected)}
                        </span>
                      }
                    />
                  </div>
                  <Button variant="secondary" size="sm" className="mt-3 w-full">
                    <MessageSquare />
                    Écrire au client
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------- Planning ------------------------ */}
        <TabsContent value="planning">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="neutral">{project.tasks.length} tâches</Badge>
              <Badge variant="brand">{project.tasks.filter((t) => t.critical).length} sur le chemin critique</Badge>
              <Badge variant={drift > 0 ? "risk" : "ok"}>
                {drift > 0 ? `${drift} jours de dérive projetée` : "Planning tenu"}
              </Badge>
            </div>
            <GanttChart project={project} />
          </div>
        </TabsContent>

        {/* ---------------------- Chantier ------------------------ */}
        <TabsContent value="chantier">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-7">
              <CardHeader>
                <CardTitle>Journal de chantier</CardTitle>
                <Badge variant="neutral">{projectReports.length} rapports</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectReports.map((report) => (
                  <div key={report.id} className="rounded-lg border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink-900">{formatDate(report.date, "long")}</span>
                      <Badge variant={report.status === "published" ? "ok" : "warn"} size="sm">
                        {report.status === "published" ? "Publié" : "Synchronisé hors ligne"}
                      </Badge>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <MiniStat label="Effectif" value={`${report.headcount}`} />
                      <MiniStat label="Heures" value={`${report.hoursWorked}`} />
                      <MiniStat label="Photos" value={`${report.photos}`} />
                      <MiniStat label="Avancement" value={`+${report.progressDelta} pt`} />
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-600">{report.observations}</p>
                    {report.materialsUsed.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                        {report.materialsUsed.map((m) => (
                          <Badge key={m.label} variant="neutral" size="sm">
                            {m.label} · {m.qty} {m.unit}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Photos certifiées</CardTitle>
                  <Badge variant="brand" size="sm">
                    horodatées · géolocalisées
                  </Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2.5">
                  {projectPhotos.map((photo) => (
                    <figure key={photo.id} className="group overflow-hidden rounded-lg border border-line">
                      <div className="relative h-24">
                        <PhotoScene id={photo.id} tone={photo.tone} className="absolute inset-0" />
                        <span className="absolute top-1.5 right-1.5 rounded bg-black/40 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur">
                          {formatDate(photo.date, "short")}
                        </span>
                      </div>
                      <figcaption className="px-2 py-1.5">
                        <p className="truncate text-[11px] font-medium text-ink-800">{photo.label}</p>
                        <p className="truncate text-[10px] text-ink-400">{photo.phase}</p>
                      </figcaption>
                    </figure>
                  ))}
                  {projectPhotos.length === 0 ? (
                    <p className="col-span-2 py-6 text-center text-[13px] text-ink-400">Aucune photo publiée.</p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Incidents & blocages</CardTitle>
                  <Badge variant={projectIncidents.some((i) => i.status !== "closed") ? "risk" : "ok"} size="sm">
                    {projectIncidents.filter((i) => i.status !== "closed").length} ouverts
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {projectIncidents.length === 0 ? (
                    <p className="py-6 text-center text-[13px] text-ink-400">Aucun incident déclaré.</p>
                  ) : (
                    projectIncidents.map((incident) => (
                      <div key={incident.id} className="rounded-lg border border-line p-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex items-center gap-2">
                            <CircleAlert
                              className={cn(
                                "size-4",
                                incident.severity === "Critique" || incident.severity === "Grave"
                                  ? "text-risk-500"
                                  : "text-warn-500",
                              )}
                            />
                            <span className="text-[13px] font-medium text-ink-900">{incident.title}</span>
                          </span>
                          <Badge
                            variant={incident.status === "closed" ? "ok" : incident.status === "open" ? "risk" : "warn"}
                            size="sm"
                          >
                            {incident.status === "closed" ? "Clos" : incident.status === "open" ? "Ouvert" : "En cours"}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">{incident.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-400">
                          <span>{formatDate(incident.date)}</span>
                          <span>{incident.type}</span>
                          <span>Pilote : {incident.assignee}</span>
                          {incident.impactDays > 0 ? (
                            <span className="font-medium text-risk-600">impact {incident.impactDays} j</span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ----------------------- Budget ------------------------- */}
        <TabsContent value="budget">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <CardTitle>Dépenses rattachées</CardTitle>
                <Button variant="secondary" size="xs">
                  <Download />
                  Exporter
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Date</TH>
                        <TH>Libellé</TH>
                        <TH>Nature</TH>
                        <TH align="right">Montant</TH>
                        <TH>Statut</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {projectExpenses.map((expense) => (
                        <TR key={expense.id}>
                          <TD className="whitespace-nowrap">{formatDate(expense.date, "short")}</TD>
                          <TD>
                            <span className="block font-medium text-ink-900">{expense.label}</span>
                            <span className="block text-[11px] text-ink-400">
                              {expense.author} · {expense.paymentMethod}
                            </span>
                          </TD>
                          <TD>
                            <Badge variant="neutral" size="sm">
                              {expense.category}
                            </Badge>
                          </TD>
                          <TD align="right" className="tnum font-medium text-ink-900">
                            {formatMoney(expense.amount)}
                          </TD>
                          <TD>
                            <Badge
                              variant={
                                expense.status === "validated" ? "ok" : expense.status === "pending" ? "warn" : "risk"
                              }
                              size="sm"
                            >
                              {expense.status === "validated" ? "Validée" : expense.status === "pending" ? "À valider" : "Rejetée"}
                            </Badge>
                          </TD>
                        </TR>
                      ))}
                      {projectExpenses.length === 0 ? (
                        <TR>
                          <TD colSpan={5} className="py-8 text-center text-ink-400">
                            Aucune dépense enregistrée sur ce projet.
                          </TD>
                        </TR>
                      ) : null}
                    </TBody>
                  </Table>
                </TableWrap>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Budget / engagé / réalisé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.lots.map((lot) => (
                    <div key={lot.id}>
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <span className="truncate text-[13px] font-medium text-ink-800">{lot.name}</span>
                        <span className="tnum text-[12px] text-ink-500">
                          {formatMoneyCompact(lot.spent)} / {formatMoneyCompact(lot.budget)}
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-brand-200"
                          style={{ width: `${Math.min((lot.committed / lot.budget) * 100, 100)}%` }}
                        />
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full",
                            lot.spent / lot.budget > 0.95 ? "bg-risk-500" : "bg-brand-700",
                          )}
                          style={{ width: `${Math.min((lot.spent / lot.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 border-t border-line pt-3 text-[11px] text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-4 rounded-full bg-brand-200" /> engagé
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-4 rounded-full bg-brand-700" /> réalisé
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Facturation client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {projectInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="tnum text-[13px] font-medium text-ink-900">{invoice.number}</p>
                        <p className="truncate text-[11px] text-ink-400">{invoice.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="tnum text-[13px] font-semibold text-ink-900">{formatMoneyCompact(invoice.amount)}</p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "ok"
                              : invoice.status === "overdue"
                                ? "risk"
                                : invoice.status === "partial"
                                  ? "warn"
                                  : "info"
                          }
                          size="sm"
                        >
                          {invoice.status === "paid"
                            ? "Payée"
                            : invoice.status === "overdue"
                              ? "En retard"
                              : invoice.status === "partial"
                                ? "Partielle"
                                : invoice.status === "draft"
                                  ? "Brouillon"
                                  : "Envoyée"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {projectInvoices.length === 0 ? (
                    <p className="py-6 text-center text-[13px] text-ink-400">Aucune facture émise.</p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --------------------- Fournisseurs --------------------- */}
        <TabsContent value="achats">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectSuppliers.map((supplier) => (
              <Card key={supplier.id} interactive>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar initials={supplier.name.slice(0, 2).toUpperCase()} tone={supplier.tone} size="md" />
                    <div className="min-w-0">
                      <CardTitle className="truncate">{supplier.name}</CardTitle>
                      <p className="truncate text-[12px] text-ink-400">{supplier.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-line">
                    <DataRow label="Commandes" value={supplier.ordersCount} />
                    <DataRow label="Volume d'affaires" value={formatMoneyCompact(supplier.volume)} />
                    <DataRow label="Encours" value={formatMoneyCompact(supplier.outstanding)} />
                    <DataRow label="Note délai" value={`${supplier.rating.delay} / 5`} />
                  </div>
                </CardContent>
              </Card>
            ))}
            {projectSuppliers.length === 0 ? (
              <p className="col-span-full rounded-lg border border-dashed border-line bg-surface py-12 text-center text-[13px] text-ink-400">
                Aucun fournisseur référencé sur ce projet.
              </p>
            ) : null}
          </div>
        </TabsContent>

        {/* ----------------------- Documents ---------------------- */}
        <TabsContent value="documents">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Document</TH>
                  <TH>Catégorie</TH>
                  <TH>Version</TH>
                  <TH>Auteur</TH>
                  <TH>Partage</TH>
                  <TH align="right">Mise à jour</TH>
                </TR>
              </THead>
              <TBody>
                {projectDocs.map((doc) => (
                  <TR key={doc.id} interactive>
                    <TD>
                      <span className="flex items-center gap-2.5">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-700">
                          {doc.format}
                        </span>
                        <span>
                          <span className="block font-medium text-ink-900">{doc.name}</span>
                          <span className="block text-[11px] text-ink-400">{doc.size}</span>
                        </span>
                      </span>
                    </TD>
                    <TD>
                      <Badge variant="neutral" size="sm">
                        {doc.category}
                      </Badge>
                    </TD>
                    <TD className="tnum">{doc.version}</TD>
                    <TD>{doc.author}</TD>
                    <TD>
                      <span className="flex gap-1">
                        {doc.shared.map((s) => (
                          <Badge key={s} variant={s === "Client" ? "brand" : "outline"} size="sm">
                            {s}
                          </Badge>
                        ))}
                      </span>
                    </TD>
                    <TD align="right" className="whitespace-nowrap">
                      {formatDate(doc.updatedAt, "short")}
                    </TD>
                  </TR>
                ))}
                {projectDocs.length === 0 ? (
                  <TR>
                    <TD colSpan={6} className="py-10 text-center text-ink-400">
                      Aucun document rattaché à ce projet.
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>

        {/* ------------------------ Risques ----------------------- */}
        <TabsContent value="risques">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {project.risks.map((risk) => (
              <Card key={risk.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
                        risk.impact === "Critique"
                          ? "bg-risk-50 text-risk-600"
                          : risk.impact === "Élevé"
                            ? "bg-warn-50 text-warn-600"
                            : "bg-ink-100 text-ink-500",
                      )}
                    >
                      <Flag />
                    </span>
                    <div>
                      <CardTitle>{risk.label}</CardTitle>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge variant={risk.probability === "Élevée" ? "risk" : "neutral"} size="sm">
                          Probabilité {risk.probability.toLowerCase()}
                        </Badge>
                        <Badge variant={risk.impact === "Critique" ? "risk" : risk.impact === "Élevé" ? "warn" : "neutral"} size="sm">
                          Impact {risk.impact.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[13px] leading-relaxed text-ink-600">
                    <span className="font-medium text-ink-800">Mitigation : </span>
                    {risk.mitigation}
                  </p>
                  <p className="mt-2 text-[12px] text-ink-400">Pilote : {risk.owner}</p>
                </CardContent>
              </Card>
            ))}
            {project.risks.length === 0 ? (
              <p className="col-span-full rounded-lg border border-dashed border-line bg-surface py-12 text-center text-[13px] text-ink-400">
                Aucun risque ouvert sur ce projet.
              </p>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function StatCell({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "ok" | "warn" | "risk";
}) {
  return (
    <div className="bg-surface px-6 py-4">
      <p className="text-[11px] tracking-wide text-ink-400 uppercase">{label}</p>
      <p
        className={cn(
          "tnum mt-1 text-[18px] leading-none font-semibold tracking-[-0.02em]",
          tone === "risk" ? "text-risk-600" : tone === "warn" ? "text-warn-600" : tone === "ok" ? "text-ok-600" : "text-ink-900",
        )}
      >
        {value}
      </p>
      {sub ? <p className="tnum mt-1.5 text-[12px] text-ink-500">{sub}</p> : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-ink-50 px-2.5 py-1.5">
      <p className="text-[10px] tracking-wide text-ink-400 uppercase">{label}</p>
      <p className="tnum text-[13px] font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export { relativeTime, formatPercent, TODAY };
