"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  HardHat,
  Info,
  Percent,
  Plus,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Badge, HealthBadge, healthMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, Progress } from "@/components/ui/data-display";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { ChartFrame, ChartLegend, SERIES } from "@/components/charts/kit";
import { CashflowChart, HealthDonut, RevenueTrend } from "@/components/charts/charts";
import { HeroKpi, KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import {
  activities,
  alerts,
  cashPosition,
  healthBreakdown,
  portfolio,
  projectMarginRanking,
  projects,
  revenueSeries,
  upcomingDeadlines,
  validationQueue,
} from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, formatPercent, relativeTime } from "@/lib/utils";

const alertIcon = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const alertTone = {
  critical: "border-risk-100 bg-risk-50 text-risk-600",
  warning: "border-warn-100 bg-warn-50 text-warn-600",
  info: "border-info-100 bg-info-50 text-info-600",
};

const kindTone: Record<string, string> = {
  finance: "bg-brand-600",
  chantier: "bg-signal-500",
  commercial: "bg-ok-600",
  achat: "bg-ink-600",
  rh: "bg-brand-500",
  doc: "bg-ink-500",
  client: "bg-signal-600",
};

export function DashboardView() {
  const criticalProjects = projects.filter((p) => p.health === "critical" || p.health === "at_risk");
  const collectionRate = Math.round((portfolio.collected / portfolio.invoiced) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Direction générale"
        title="Bonjour Armand, voici votre entreprise aujourd'hui"
        description="Vue consolidée du portefeuille au 21 septembre 2026 — avancement, marge, trésorerie et points de décision."
        meta={
          <>
            <Badge variant="ok" dot>
              {portfolio.reportsToday} rapports de chantier reçus aujourd&apos;hui
            </Badge>
            <Badge variant="risk" dot>
              {alerts.filter((a) => a.severity === "critical").length} alertes critiques
            </Badge>
            <Badge variant="neutral">Dernière synchronisation il y a 4 min</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="md">
              <Download />
              Rapport mensuel
            </Button>
            <Button size="md">
              <Plus />
              Nouveau projet
            </Button>
          </>
        }
      />

      {/* ---------------------------- KPI ---------------------------- */}
      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Chantiers actifs"
          value={`${portfolio.projectsActive}`}
          delta={12}
          deltaLabel="vs trimestre précédent"
          icon={<HardHat />}
          accent="brand"
          trend={[4, 5, 5, 6, 6, 7, 7, 8]}
        />
        <KpiCard
          label="Chiffre d'affaires facturé"
          value={formatMoneyCompact(portfolio.yearRevenue)}
          delta={18}
          deltaLabel="vs 2025 à date"
          icon={<Banknote />}
          accent="ok"
          trend={revenueSeries.map((r) => r.facture)}
          trendColor={SERIES[2]}
        />
        <KpiCard
          label="Marge brute prévisionnelle"
          value={formatPercent(Math.round(portfolio.grossMargin * 10) / 10, 1)}
          delta={Math.round((portfolio.grossMargin - 21.8) * 10) / 10}
          deltaLabel="vs objectif 21,8 %"
          upIsGood
          icon={<Percent />}
          accent="warn"
          trend={[22.4, 22.1, 21.8, 21.1, 20.6, 19.9, 19.4, 18.7]}
          trendColor={SERIES[1]}
        />
        <KpiCard
          label="Encours client"
          value={formatMoneyCompact(portfolio.outstanding)}
          delta={24}
          deltaLabel="dont 372 M échus"
          upIsGood={false}
          icon={<Wallet />}
          accent="risk"
          trend={[280, 310, 342, 366, 402, 448, 512, 561]}
          trendColor={SERIES[1]}
        />
      </div>

      {/* --------------------- Hero + santé + alertes ---------------- */}
      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <HeroKpi
          className="xl:col-span-4"
          label="Carnet de commandes"
          value={formatMoneyCompact(portfolio.contract)}
          delta="+2 chantiers ce trimestre"
          caption={`${portfolio.projectsActive} chantiers en cours · ${portfolio.surface.toLocaleString("fr-FR")} m² pilotés`}
        >
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            <div>
              <p className="text-[11px] text-white/40">Engagé</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold">{formatMoneyCompact(portfolio.committed)}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40">Réalisé</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold">{formatMoneyCompact(portfolio.spent)}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/40">Encaissé</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold">{formatMoneyCompact(portfolio.collected)}</p>
            </div>
          </div>
        </HeroKpi>

        <ChartFrame
          className="xl:col-span-8"
          title="Facturation, encaissement et dépenses"
          subtitle="12 derniers mois, en millions de FCFA"
          height={268}
          legend={
            <ChartLegend
              items={[
                { label: "Facturé", color: SERIES[0], shape: "line" },
                { label: "Encaissé", color: SERIES[2], shape: "line" },
                { label: "Dépensé", color: SERIES[1], shape: "dash" },
              ]}
            />
          }
          footnote={`Taux d'encaissement sur la période : ${collectionRate} % du facturé — l'écart alimente l'encours client.`}
        >
          <RevenueTrend data={revenueSeries} />
        </ChartFrame>
      </div>

      {/* ------------------- Trésorerie + alertes -------------------- */}
      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-8"
          title="Trésorerie prévisionnelle — 13 semaines"
          subtitle="Encaissements et décaissements attendus, solde projeté"
          height={280}
          legend={
            <ChartLegend
              items={[
                { label: "Encaissements", color: SERIES[0] },
                { label: "Décaissements", color: SERIES[1] },
                { label: "Solde projeté", color: SERIES[3], shape: "line" },
              ]}
            />
          }
          footnote="Solde de départ : 342 M FCFA. Le point bas projeté se situe en semaine 41 à 298 M FCFA."
        >
          <CashflowChart data={cashPosition} />
        </ChartFrame>

        <Card className="flex flex-col xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Points de décision</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Ce qui attend votre arbitrage</p>
            </div>
            <Badge variant="risk" size="sm">
              {alerts.filter((a) => a.severity === "critical").length} critiques
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 px-3 pb-3">
            {alerts.slice(0, 5).map((alert) => {
              const Icon = alertIcon[alert.severity];
              return (
                <Link
                  key={alert.id}
                  href={alert.href}
                  className="group flex gap-3 rounded-lg border border-transparent p-2.5 transition-colors hover:border-line hover:bg-ink-50/70"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg border [&_svg]:size-4",
                      alertTone[alert.severity],
                    )}
                  >
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] leading-snug font-medium text-ink-900">{alert.title}</span>
                    <span className="mt-0.5 block line-clamp-2 text-[12px] leading-snug text-ink-500">
                      {alert.detail}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
                      {alert.cta}
                      <ArrowRight className="size-3" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </CardContent>
          <div className="border-t border-line px-5 py-2.5">
            <Link href="/chantiers" className="text-[12px] font-medium text-brand-700 hover:underline">
              Voir les {alerts.length} alertes
            </Link>
          </div>
        </Card>
      </div>

      {/* --------------- Santé portefeuille + validations ------------ */}
      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Santé du portefeuille</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">{portfolio.projectsTotal} projets suivis</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-[132px] w-[132px] shrink-0">
                <HealthDonut data={healthBreakdown} />
              </div>
              <ul className="flex-1 space-y-2">
                {healthBreakdown.map((h) => (
                  <li key={h.key} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[13px] text-ink-600">
                      <span className="size-2.5 rounded-[3px]" style={{ background: h.color }} />
                      {h.label}
                    </span>
                    <span className="tnum text-[13px] font-semibold text-ink-900">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <p className="text-[11px] font-semibold tracking-wide text-ink-400 uppercase">Sous surveillance</p>
              {criticalProjects.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/projets/${p.id}`}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-ink-50"
                >
                  <span className={cn("size-2 shrink-0 rounded-full", healthMeta[p.health].dotClass)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink-800">{p.name}</span>
                    <span className="block text-[11px] text-ink-400">
                      {p.progress} % réalisé · {p.plannedProgress} % prévu
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-300" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Échéances à venir</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Jalons contractuels et situations à facturer</p>
            </div>
            <CalendarClock className="size-4 text-ink-400" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ul className="divide-y divide-line">
              {upcomingDeadlines.slice(0, 6).map((d) => {
                const late = d.status === "late";
                return (
                  <li key={d.id}>
                    <Link href={`/projets/${d.projectId}`} className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-ink-50/70">
                      <span
                        className={cn(
                          "flex w-12 shrink-0 flex-col items-center rounded-lg border py-1",
                          late ? "border-risk-100 bg-risk-50" : "border-line bg-surface-2",
                        )}
                      >
                        <span className={cn("tnum text-[15px] leading-none font-semibold", late ? "text-risk-600" : "text-ink-900")}>
                          {formatDate(d.date, "short").slice(0, 2)}
                        </span>
                        <span className="mt-0.5 text-[10px] text-ink-400 uppercase">
                          {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(`${d.date}T12:00:00`))}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink-900">{d.label}</span>
                        <span className="block truncate text-[11px] text-ink-400">{d.projectName}</span>
                      </span>
                      <span className="text-right">
                        {d.amount ? (
                          <span className="tnum block text-[13px] font-semibold text-ink-900">
                            {formatMoneyCompact(d.amount)}
                          </span>
                        ) : null}
                        <span className={cn("block text-[11px]", late ? "font-medium text-risk-600" : "text-ink-400")}>
                          {late ? `${Math.abs(d.days)} j de retard` : `dans ${d.days} j`}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>À valider</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Séparation des tâches appliquée</p>
            </div>
            <ShieldCheck className="size-4 text-ink-400" />
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            {validationQueue.slice(0, 4).map((v) => (
              <div key={v.id} className="rounded-lg border border-line bg-surface-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" size="sm">
                    {v.type}
                  </Badge>
                  <span className="tnum text-[11px] text-ink-400">{v.ref}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug font-medium text-ink-900">{v.label}</p>
                <p className="tnum mt-1 text-[13px] font-semibold text-brand-800">{formatMoney(v.amount)}</p>
                <div className="mt-2.5 flex gap-1.5">
                  <Button size="xs" variant="primary" className="flex-1">
                    <CheckCircle2 />
                    Valider
                  </Button>
                  <Button size="xs" variant="secondary">
                    Détail
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --------------- Rentabilité + activité ---------------------- */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <div>
              <CardTitle>Rentabilité par chantier</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Marge prévisionnelle = (marché − budget) / marché</p>
            </div>
            <Button variant="ghost" size="xs" asChild>
              <Link href="/reporting">
                Analyse complète
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <TableWrap className="rounded-none border-0 border-t border-line">
              <Table>
                <THead>
                  <TR>
                    <TH>Chantier</TH>
                    <TH align="right">Marché</TH>
                    <TH align="right">Marge</TH>
                    <TH>Répartition</TH>
                    <TH>Santé</TH>
                  </TR>
                </THead>
                <TBody>
                  {projectMarginRanking.slice(0, 6).map((p) => (
                    <TR key={p.id} interactive>
                      <TD>
                        <Link href={`/projets/${p.id}`} className="block">
                          <span className="block truncate text-[13px] font-medium text-ink-900">{p.name}</span>
                          <span className="tnum block text-[11px] text-ink-400">{p.code}</span>
                        </Link>
                      </TD>
                      <TD align="right" className="tnum font-medium">
                        {formatMoneyCompact(p.contract)}
                      </TD>
                      <TD align="right">
                        <span
                          className={cn(
                            "tnum font-semibold",
                            p.margin >= 20 ? "text-ok-600" : p.margin >= 15 ? "text-ink-800" : "text-risk-600",
                          )}
                        >
                          {formatPercent(p.margin, 1)}
                        </span>
                      </TD>
                      <TD className="w-40">
                        <Progress
                          value={(p.margin / 25) * 100}
                          size="xs"
                          barClassName={p.margin >= 20 ? "bg-ok-500" : p.margin >= 15 ? "bg-brand-600" : "bg-risk-500"}
                        />
                      </TD>
                      <TD>
                        <HealthBadge health={p.health} />
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrap>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Fil d&apos;activité</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Toute l&apos;entreprise, en temps réel</p>
            </div>
            <Users className="size-4 text-ink-400" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <ul className="relative space-y-3.5">
              <span className="absolute top-2 bottom-2 left-[13px] w-px bg-line" aria-hidden />
              {activities.slice(0, 8).map((a) => (
                <li key={a.id} className="relative flex gap-3">
                  <span
                    className={cn(
                      "relative z-10 mt-1 flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-4 ring-surface",
                      kindTone[a.kind],
                    )}
                  >
                    {a.actor
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="block text-[13px] leading-snug text-ink-700">
                      <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{" "}
                      <span className="font-medium text-ink-900">{a.target}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-400">{relativeTime(a.at)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <div className="border-t border-line px-5 py-2.5">
            <Link href="/messages" className="text-[12px] font-medium text-brand-700 hover:underline">
              Tout le journal d&apos;activité
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}

export { Building2, Avatar };
