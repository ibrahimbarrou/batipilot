"use client";

import * as React from "react";
import {
  BarChart3,
  Building2,
  CalendarRange,
  Download,
  FileSpreadsheet,
  Gauge,
  Mail,
  Percent,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow, Progress } from "@/components/ui/data-display";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { ChartFrame, ChartLegend, SERIES } from "@/components/charts/kit";
import { BudgetUsageChart, CategoryDonut, GaugeRadial, MarginChart, RevenueTrend } from "@/components/charts/charts";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import {
  company,
  expenseByCategory,
  marginSeries,
  portfolio,
  projectMarginRanking,
  projects,
  revenueSeries,
} from "@/data";
import { cn, formatMoneyCompact, formatNumber, formatPercent } from "@/lib/utils";

const KPI_TABLE = [
  { name: "Avancement moyen vs planning", value: "-4,2 pts", target: "0 pt", status: "warn" },
  { name: "Écart budgétaire moyen", value: "+2,8 %", target: "< 2 %", status: "warn" },
  { name: "Marge brute réalisée", value: "18,7 %", target: "21,8 %", status: "risk" },
  { name: "DSO (délai moyen d'encaissement)", value: "68 j", target: "< 45 j", status: "risk" },
  { name: "Taux d'incidents par chantier", value: "0,7", target: "< 1", status: "ok" },
  { name: "Productivité main-d'œuvre", value: "1,18", target: "> 1,10", status: "ok" },
  { name: "Taux d'adoption terrain", value: "88 %", target: "> 80 %", status: "ok" },
  { name: "Satisfaction client (NPS)", value: "42", target: "> 30", status: "ok" },
];

const statusVariant = { ok: "ok", warn: "warn", risk: "risk" } as const;

export function ReportingView() {
  const [period, setPeriod] = React.useState("12m");
  const [agency, setAgency] = React.useState("all");

  const totalExpenses = expenseByCategory.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <PageHeader
        eyebrow="Business intelligence"
        title="Reporting décisionnel"
        description="Les indicateurs qui pilotent l'entreprise : performance opérationnelle, santé financière et exports prêts pour la direction et les investisseurs."
        meta={
          <>
            <Badge variant="neutral">Exercice 2026</Badge>
            <Badge variant="brand">{company.agencies.length} agences</Badge>
            <Badge variant="neutral">Mise à jour automatique quotidienne</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Mail />
              Programmer l&apos;envoi
            </Button>
            <Button>
              <Download />
              Rapport exécutif PDF
            </Button>
          </>
        }
      />

      <Toolbar
        right={
          <>
            <Button variant="secondary" size="sm">
              <FileSpreadsheet />
              Excel
            </Button>
            <Button variant="secondary" size="sm">
              <Download />
              CSV
            </Button>
          </>
        }
      >
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[11rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">3 derniers mois</SelectItem>
            <SelectItem value="6m">6 derniers mois</SelectItem>
            <SelectItem value="12m">12 derniers mois</SelectItem>
            <SelectItem value="ytd">Depuis le 1er janvier</SelectItem>
          </SelectContent>
        </Select>
        <Select value={agency} onValueChange={setAgency}>
          <SelectTrigger className="w-[11rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les agences</SelectItem>
            {company.agencies.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Chiffre d'affaires" value={formatMoneyCompact(portfolio.yearRevenue)} delta={18} icon={<TrendingUp />} accent="ok" trend={revenueSeries.map((r) => r.facture)} trendColor={SERIES[2]} />
        <KpiCard label="Carnet de commandes" value={formatMoneyCompact(portfolio.contract)} delta={9} icon={<Building2 />} accent="brand" />
        <KpiCard label="Marge réalisée" value={formatPercent(18.7, 1)} delta={-3.1} icon={<Percent />} accent="warn" trend={marginSeries.map((m) => m.reelle)} trendColor={SERIES[1]} />
        <KpiCard label="Surface pilotée" value={`${formatNumber(portfolio.surface)} m²`} delta={16} icon={<Gauge />} accent="signal" />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-8"
          title="Performance financière"
          subtitle="Facturation, encaissement et dépenses — millions de FCFA"
          height={280}
          legend={
            <ChartLegend
              items={[
                { label: "Facturé", color: SERIES[0], shape: "line" },
                { label: "Encaissé", color: SERIES[2], shape: "line" },
                { label: "Dépensé", color: SERIES[1], shape: "dash" },
              ]}
            />
          }
        >
          <RevenueTrend data={revenueSeries} />
        </ChartFrame>

        <Card className="xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Santé globale</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Score composite de pilotage</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-[150px] w-[210px]">
              <GaugeRadial value={72} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                <span className="tnum text-[32px] leading-none font-semibold tracking-[-0.03em] text-ink-900">72</span>
                <span className="text-[12px] text-ink-400">sur 100</span>
              </div>
            </div>
            <div className="mt-2 divide-y divide-line">
              <DataRow label="Respect des délais" value="64 / 100" />
              <DataRow label="Tenue budgétaire" value="71 / 100" />
              <DataRow label="Qualité & sécurité" value="88 / 100" />
              <DataRow label="Trésorerie" value="66 / 100" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-6"
          title="Marge prévisionnelle contre marge réelle"
          subtitle="Suivi mensuel, en pourcentage"
          height={250}
          legend={
            <ChartLegend
              items={[
                { label: "Prévisionnelle", color: SERIES[4], shape: "dash" },
                { label: "Réelle", color: SERIES[0], shape: "line" },
              ]}
            />
          }
        >
          <MarginChart data={marginSeries} />
        </ChartFrame>

        <Card className="xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Structure de coûts</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Répartition des dépenses par nature</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-[190px] w-[190px] shrink-0">
                <CategoryDonut
                  data={expenseByCategory.map((c) => ({ name: c.name, value: c.value }))}
                  centerValue={formatMoneyCompact(totalExpenses)}
                  centerLabel="cumul"
                />
              </div>
              <ul className="min-w-[180px] flex-1 space-y-2">
                {expenseByCategory.map((c, i) => (
                  <li key={c.name}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] text-ink-600">
                        <span className="size-2.5 rounded-[3px]" style={{ background: SERIES[i % SERIES.length] }} />
                        {c.name}
                      </span>
                      <span className="tnum text-[13px] font-medium text-ink-900">
                        {Math.round((c.value / totalExpenses) * 100)} %
                      </span>
                    </div>
                    <Progress value={(c.value / totalExpenses) * 100} size="xs" barClassName="bg-brand-600" />
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Indicateurs clés</CardTitle>
              <p className="mt-0.5 text-[13px] text-ink-500">Valeur constatée contre objectif</p>
            </div>
            <BarChart3 className="size-4 text-ink-400" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <TableWrap className="rounded-none border-0 border-t border-line">
              <Table>
                <THead>
                  <TR>
                    <TH>Indicateur</TH>
                    <TH align="right">Valeur</TH>
                    <TH align="right">Objectif</TH>
                    <TH></TH>
                  </TR>
                </THead>
                <TBody>
                  {KPI_TABLE.map((kpi) => (
                    <TR key={kpi.name}>
                      <TD className="font-medium text-ink-900">{kpi.name}</TD>
                      <TD align="right" className="tnum font-semibold">
                        {kpi.value}
                      </TD>
                      <TD align="right" className="tnum text-ink-500">
                        {kpi.target}
                      </TD>
                      <TD>
                        <Badge variant={statusVariant[kpi.status as keyof typeof statusVariant]} size="sm" dot>
                          {kpi.status === "ok" ? "atteint" : kpi.status === "warn" ? "à surveiller" : "hors cible"}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrap>
          </CardContent>
        </Card>

        <ChartFrame
          className="xl:col-span-7"
          title="Budget, engagé et réalisé par chantier"
          subtitle="Millions de FCFA"
          height={380}
          legend={
            <ChartLegend
              items={[
                { label: "Budget", color: "#e2e5ec" },
                { label: "Engagé", color: SERIES[4] },
                { label: "Réalisé", color: SERIES[0] },
              ]}
            />
          }
          footnote="Les chantiers dont le réalisé dépasse l'engagé signalent des dépenses hors commande à régulariser."
        >
          <BudgetUsageChart
            data={projects.slice(0, 8).map((p) => ({
              name: `${p.city} · ${p.code.slice(-3)}`,
              budget: Math.round(p.budget / 1_000_000),
              engage: Math.round(p.committed / 1_000_000),
              realise: Math.round(p.spent / 1_000_000),
            }))}
          />
        </ChartFrame>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Classement de rentabilité</CardTitle>
            <p className="mt-0.5 text-[13px] text-ink-500">Tous chantiers hors phase d&apos;étude</p>
          </div>
          <Timer className="size-4 text-ink-400" />
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <TableWrap className="rounded-none border-0 border-t border-line">
            <Table>
              <THead>
                <TR>
                  <TH>Rang</TH>
                  <TH>Chantier</TH>
                  <TH align="right">Montant du marché</TH>
                  <TH align="right">Marge prévisionnelle</TH>
                  <TH>Contribution</TH>
                </TR>
              </THead>
              <TBody>
                {projectMarginRanking.map((p, i) => (
                  <TR key={p.id} interactive>
                    <TD className="tnum w-12 font-semibold text-ink-400">{String(i + 1).padStart(2, "0")}</TD>
                    <TD>
                      <span className="block font-medium text-ink-900">{p.name}</span>
                      <span className="tnum block text-[11px] text-ink-400">{p.code}</span>
                    </TD>
                    <TD align="right" className="tnum">{formatMoneyCompact(p.contract)}</TD>
                    <TD align="right">
                      <span className={cn("tnum font-semibold", p.margin >= 20 ? "text-ok-600" : p.margin >= 15 ? "text-ink-800" : "text-risk-600")}>
                        {formatPercent(p.margin, 1)}
                      </span>
                    </TD>
                    <TD className="w-52">
                      <Progress
                        value={(p.margin / 25) * 100}
                        size="xs"
                        barClassName={p.margin >= 20 ? "bg-ok-500" : p.margin >= 15 ? "bg-brand-600" : "bg-risk-500"}
                      />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Rapports programmés</CardTitle>
            <p className="mt-0.5 text-[13px] text-ink-500">Générés automatiquement et envoyés par e-mail</p>
          </div>
          <CalendarRange className="size-4 text-ink-400" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { title: "Rapport exécutif mensuel", detail: "Direction et investisseurs · 1er de chaque mois", format: "PDF" },
            { title: "Revue de portefeuille hebdomadaire", detail: "Chefs de projet · chaque lundi 7h", format: "PDF" },
            { title: "Export comptable SYSCOHADA", detail: "Cabinet comptable · fin de mois", format: "CSV" },
          ].map((report) => (
            <div key={report.title} className="rounded-lg border border-line bg-surface-2 p-4">
              <Badge variant="neutral" size="sm">
                {report.format}
              </Badge>
              <p className="mt-2 text-[13px] font-medium text-ink-900">{report.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{report.detail}</p>
              <Button size="xs" variant="secondary" className="mt-3">
                Configurer
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
