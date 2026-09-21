"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  CircleAlert,
  CloudRain,
  Download,
  Filter,
  Image as ImageIcon,
  MapPin,
  Plus,
  ScrollText,
  ShieldCheck,
  Sun,
  Thermometer,
  Users,
  Wind,
} from "lucide-react";
import { Badge, HealthBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/data-display";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { PortfolioMap } from "@/components/shared/project-views";
import { activeProjects, alerts, incidents, portfolio, projects, sitePhotos, siteReports } from "@/data";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { PhotoScene } from "@/components/shared/photo-tile";

const weatherIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  Ensoleillé: Sun,
  Nuageux: CloudRain,
  Pluie: CloudRain,
  Orage: CloudRain,
  Harmattan: Wind,
};

export function SiteView() {
  const [project, setProject] = React.useState("all");

  const reports = React.useMemo(
    () => (project === "all" ? siteReports : siteReports.filter((r) => r.projectId === project)),
    [project],
  );
  const photos = React.useMemo(
    () => (project === "all" ? sitePhotos : sitePhotos.filter((p) => p.projectId === project)),
    [project],
  );
  const issues = React.useMemo(
    () => (project === "all" ? incidents : incidents.filter((i) => i.projectId === project)),
    [project],
  );

  const onSiteToday = siteReports.filter((r) => r.date === "2026-09-21").reduce((s, r) => s + r.headcount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Terrain"
        title="Suivi de chantier"
        description="Chaque journée de chantier documentée : rapport, effectifs, quantités, photos horodatées et incidents — saisis depuis le mobile, même hors ligne."
        meta={
          <>
            <Badge variant="ok" dot>
              {portfolio.reportsToday} rapports reçus aujourd&apos;hui
            </Badge>
            <Badge variant="warn" dot>
              {issues.filter((i) => i.status !== "closed").length} incidents ouverts
            </Badge>
            <Badge variant="neutral">Synchronisation mobile à jour</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Download />
              Rapport hebdo
            </Button>
            <Button>
              <Plus />
              Saisir un rapport
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Taux d'adoption terrain"
          value={`${portfolio.adoptionRate} %`}
          delta={9}
          hint={`${portfolio.reportingProjects} chantiers sur ${activeProjects.length} cette semaine`}
          icon={<ScrollText />}
          accent="ok"
          trend={[62, 68, 71, 74, 79, 82, 85, 88]}
        />
        <KpiCard
          label="Effectif pointé aujourd'hui"
          value={formatNumber(portfolio.headcountToday)}
          delta={4}
          hint={`dont ${onSiteToday} sur les chantiers ayant transmis`}
          icon={<Users />}
          accent="brand"
          trend={[102, 118, 124, 131, 128, 136, 142, 144]}
        />
        <KpiCard
          label="Photos certifiées ce mois"
          value="486"
          delta={22}
          deltaLabel="horodatées + géolocalisées"
          icon={<Camera />}
          accent="signal"
          trend={[210, 248, 292, 331, 364, 402, 441, 486]}
        />
        <KpiCard
          label="Incidents ouverts"
          value={`${incidents.filter((i) => i.status !== "closed").length}`}
          delta={-25}
          deltaLabel="vs mois dernier"
          upIsGood={false}
          icon={<AlertTriangle />}
          accent="risk"
          trend={[7, 6, 6, 5, 5, 4, 4, 3]}
        />
      </div>

      <Toolbar
        right={
          <>
            <Button variant="ghost" size="sm">
              <Filter />
              Filtres avancés
            </Button>
          </>
        }
      >
        <Select value={project} onValueChange={setProject}>
          <SelectTrigger className="w-[22rem]">
            <SelectValue placeholder="Tous les chantiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les chantiers actifs</SelectItem>
            {activeProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.code} — {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      <Tabs defaultValue="journal">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="journal">
            <ScrollText />
            Journal de chantier
          </TabsTrigger>
          <TabsTrigger variant="underline" value="photos">
            <ImageIcon />
            Photos & vidéos
          </TabsTrigger>
          <TabsTrigger variant="underline" value="incidents">
            <CircleAlert />
            Incidents
          </TabsTrigger>
          <TabsTrigger variant="underline" value="carte">
            <MapPin />
            Géolocalisation
          </TabsTrigger>
        </TabsList>

        {/* --------------------- Journal ----------------------- */}
        <TabsContent value="journal">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="space-y-3 xl:col-span-8">
              {reports.map((report) => {
                const proj = projects.find((p) => p.id === report.projectId);
                const Weather = weatherIcon[report.weather] ?? Sun;
                return (
                  <Card key={report.id} interactive>
                    <CardHeader>
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge variant="brand" size="sm">
                            {formatDate(report.date, "long")}
                          </Badge>
                          {report.status === "synced_offline" ? (
                            <Badge variant="warn" size="sm">
                              synchronisé hors ligne
                            </Badge>
                          ) : (
                            <Badge variant="ok" size="sm">
                              publié
                            </Badge>
                          )}
                        </div>
                        <CardTitle>
                          <Link href={`/projets/${report.projectId}`} className="hover:text-brand-800">
                            {proj?.name}
                          </Link>
                        </CardTitle>
                        <p className="mt-0.5 text-[13px] text-ink-500">
                          Saisi par {report.author} · {proj?.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-ink-500">
                        <span className="flex items-center gap-1.5">
                          <Weather className="size-4 text-ink-400" />
                          {report.weather}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Thermometer className="size-4 text-ink-400" />
                          {report.temperature} °C
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Metric label="Effectif" value={`${report.headcount}`} />
                        <Metric label="Heures travaillées" value={`${report.hoursWorked}`} />
                        <Metric label="Photos" value={`${report.photos}`} />
                        <Metric label="Avancement" value={`+${report.progressDelta} pt`} accent />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-ink-400 uppercase">
                            Tâches réalisées
                          </p>
                          <ul className="space-y-1">
                            {report.tasksDone.map((task) => (
                              <li key={task} className="flex items-start gap-2 text-[13px] text-ink-700">
                                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-500" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-ink-400 uppercase">
                            Matériaux & engins
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {report.materialsUsed.map((m) => (
                              <Badge key={m.label} variant="neutral" size="sm">
                                {m.label} · {m.qty} {m.unit}
                              </Badge>
                            ))}
                            {report.equipment.map((e) => (
                              <Badge key={e} variant="outline" size="sm">
                                {e}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 rounded-lg border-l-2 border-signal-400 bg-signal-50/50 px-3 py-2.5 text-[13px] leading-relaxed text-ink-700">
                        {report.observations}
                      </p>

                      {report.incidents > 0 ? (
                        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-risk-600">
                          <AlertTriangle className="size-3.5" />
                          {report.incidents} incident déclaré avec ce rapport
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Saisie du jour</CardTitle>
                  <Badge variant="neutral" size="sm">
                    {portfolio.reportsToday}/{activeProjects.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {activeProjects.map((p) => {
                    const done = siteReports.some((r) => r.projectId === p.id && r.date === "2026-09-21");
                    return (
                      <div key={p.id} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            done ? "bg-ok-50 text-ok-600" : "bg-ink-100 text-ink-400",
                          )}
                        >
                          {done ? "✓" : "—"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-ink-800">{p.name}</span>
                          <span className="block text-[11px] text-ink-400">{p.city}</span>
                        </span>
                        {!done ? (
                          <Button size="xs" variant="ghost">
                            Relancer
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertes terrain</CardTitle>
                  <AlertTriangle className="size-4 text-warn-500" />
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {alerts
                    .filter((a) => a.projectId)
                    .map((alert) => (
                      <Link
                        key={alert.id}
                        href={alert.href}
                        className="block rounded-lg border border-line p-3 transition-colors hover:bg-ink-50"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              "mt-1 size-2 shrink-0 rounded-full",
                              alert.severity === "critical" ? "bg-risk-500" : alert.severity === "warning" ? "bg-warn-500" : "bg-info-500",
                            )}
                          />
                          <span className="min-w-0">
                            <span className="block text-[13px] leading-snug font-medium text-ink-900">{alert.title}</span>
                            <span className="mt-0.5 block text-[12px] leading-snug text-ink-500">{alert.detail}</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité & conformité</CardTitle>
                  <ShieldCheck className="size-4 text-ok-600" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <SafetyRow label="Causeries sécurité réalisées" value={92} />
                  <SafetyRow label="Port des EPI contrôlé" value={87} />
                  <SafetyRow label="Habilitations à jour" value={78} tone="warn" />
                  <p className="border-t border-line pt-3 text-[12px] text-ink-500">
                    Taux de fréquence des accidents : <span className="font-semibold text-ink-800">4,2</span> sur 12 mois
                    glissants (objectif &lt; 6).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------- Photos ----------------------- */}
        <TabsContent value="photos">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => {
              const proj = projects.find((p) => p.id === photo.projectId);
              return (
                <figure
                  key={photo.id}
                  className="group overflow-hidden rounded-lg border border-line bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-40">
                    <PhotoScene id={photo.id} tone={photo.tone} className="absolute inset-0" />
                    {photo.certified ? (
                      <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                        <ShieldCheck className="size-3" />
                        certifiée
                      </span>
                    ) : null}
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      {formatDate(photo.date, "short")}
                    </span>
                  </div>
                  <figcaption className="p-3">
                    <p className="truncate text-[13px] font-medium text-ink-900">{photo.label}</p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-400">
                      {proj?.code} · {photo.phase}
                    </p>
                    <p className="mt-1.5 truncate text-[11px] text-ink-400">Par {photo.author}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </TabsContent>

        {/* --------------------- Incidents --------------------- */}
        <TabsContent value="incidents">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Incident</TH>
                  <TH>Chantier</TH>
                  <TH>Type</TH>
                  <TH>Gravité</TH>
                  <TH>Pilote</TH>
                  <TH align="right">Impact</TH>
                  <TH>Statut</TH>
                </TR>
              </THead>
              <TBody>
                {issues.map((incident) => {
                  const proj = projects.find((p) => p.id === incident.projectId);
                  return (
                    <TR key={incident.id} interactive>
                      <TD>
                        <span className="block max-w-sm font-medium text-ink-900">{incident.title}</span>
                        <span className="block text-[11px] text-ink-400">
                          {formatDate(incident.date)} · déclaré par {incident.reporter}
                        </span>
                      </TD>
                      <TD>
                        <Link href={`/projets/${incident.projectId}`} className="text-brand-700 hover:underline">
                          {proj?.code}
                        </Link>
                      </TD>
                      <TD>{incident.type}</TD>
                      <TD>
                        <Badge
                          variant={
                            incident.severity === "Critique" || incident.severity === "Grave"
                              ? "risk"
                              : incident.severity === "Modéré"
                                ? "warn"
                                : "neutral"
                          }
                          size="sm"
                        >
                          {incident.severity}
                        </Badge>
                      </TD>
                      <TD>{incident.assignee}</TD>
                      <TD align="right" className="tnum">
                        {incident.impactDays > 0 ? `${incident.impactDays} j` : "—"}
                      </TD>
                      <TD>
                        <Badge
                          variant={incident.status === "closed" ? "ok" : incident.status === "open" ? "risk" : "warn"}
                          size="sm"
                        >
                          {incident.status === "closed" ? "Clos" : incident.status === "open" ? "Ouvert" : "En cours"}
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>

        {/* ----------------------- Carte ----------------------- */}
        <TabsContent value="carte">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <PortfolioMap projects={activeProjects} />
            </div>
            <Card className="xl:col-span-4">
              <CardHeader>
                <CardTitle>Présence sur site</CardTitle>
                <Badge variant="ok" size="sm">
                  géorepérage actif
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeProjects.map((p) => {
                  const report = siteReports.find((r) => r.projectId === p.id && r.date === "2026-09-21");
                  return (
                    <div key={p.id} className="rounded-lg border border-line p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink-900">{p.name}</p>
                          <p className="flex items-center gap-1 text-[11px] text-ink-400">
                            <MapPin className="size-3" />
                            {p.coords.lat.toFixed(4)}, {p.coords.lng.toFixed(4)}
                          </p>
                        </div>
                        <HealthBadge health={p.health} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[12px] text-ink-500">
                        <span>{report ? `${report.headcount} personnes pointées` : "Aucun pointage aujourd'hui"}</span>
                        <span className="tnum font-medium text-ink-700">{p.progress} %</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-lg px-3 py-2", accent ? "bg-brand-50" : "bg-ink-50")}>
      <p className="text-[10px] tracking-wide text-ink-400 uppercase">{label}</p>
      <p className={cn("tnum text-[15px] font-semibold", accent ? "text-brand-800" : "text-ink-900")}>{value}</p>
    </div>
  );
}

function SafetyRow({ label, value, tone }: { label: string; value: number; tone?: "warn" }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[13px] text-ink-600">{label}</span>
        <span className="tnum text-[13px] font-semibold text-ink-900">{value} %</span>
      </div>
      <Progress value={value} size="sm" barClassName={tone === "warn" ? "bg-warn-500" : "bg-ok-500"} />
    </div>
  );
}
