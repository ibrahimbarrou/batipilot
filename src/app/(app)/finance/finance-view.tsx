"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  Banknote,
  CreditCard,
  Download,
  FileSpreadsheet,
  Percent,
  PiggyBank,
  Plus,
  Receipt,
  Smartphone,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Badge, invoiceStatusMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow, Progress } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { ChartFrame, ChartLegend, SERIES } from "@/components/charts/kit";
import { BudgetUsageChart, CashflowChart, CategoryDonut, MarginChart, RevenueTrend } from "@/components/charts/charts";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import {
  agingBuckets,
  cashPosition,
  clients,
  expenseByCategory,
  expensesByProject,
  invoices,
  marginSeries,
  portfolio,
  projectMarginRanking,
  projects,
  recentExpenses,
  revenueSeries,
  supplierInvoices,
  suppliers,
} from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, formatPercent, relativeFromToday } from "@/lib/utils";

export function FinanceView() {
  const totalExpenses = expenseByCategory.reduce((s, c) => s + c.value, 0);
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const dso = 68;

  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Gestion financière"
        description="Budgets, engagements, dépenses, facturation et trésorerie — chaque franc rattaché à un chantier et à un lot."
        meta={
          <>
            <Badge variant="neutral">Exercice 2026 · FCFA</Badge>
            <Badge variant="risk" dot>
              {overdueInvoices.length} factures échues
            </Badge>
            <Badge variant="neutral">DSO {dso} jours</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <FileSpreadsheet />
              Export SYSCOHADA
            </Button>
            <Button>
              <Plus />
              Nouvelle situation
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Facturé sur 12 mois"
          value={formatMoneyCompact(revenueSeries.reduce((s, r) => s + r.facture, 0) * 1_000_000)}
          delta={18}
          icon={<Banknote />}
          accent="brand"
          trend={revenueSeries.map((r) => r.facture)}
        />
        <KpiCard
          label="Encours client"
          value={formatMoneyCompact(portfolio.outstanding)}
          delta={24}
          deltaLabel={`dont ${formatMoneyCompact(portfolio.overdue)} échus`}
          upIsGood={false}
          icon={<Wallet />}
          accent="risk"
          trend={[280, 310, 342, 366, 402, 448, 512, 561]}
          trendColor={SERIES[1]}
        />
        <KpiCard
          label="Trésorerie disponible"
          value="342 M FCFA"
          delta={-8}
          deltaLabel="point bas projeté S41"
          icon={<PiggyBank />}
          accent="warn"
          trend={[412, 398, 386, 371, 364, 352, 348, 342]}
          trendColor={SERIES[1]}
        />
        <KpiCard
          label="Marge réelle constatée"
          value={formatPercent(18.7, 1)}
          delta={-3.1}
          deltaLabel="vs 21,8 % prévus"
          icon={<Percent />}
          accent="signal"
          trend={marginSeries.map((m) => m.reelle)}
          trendColor={SERIES[1]}
        />
      </div>

      <Tabs defaultValue="pilotage">
        <TabsList variant="underline" className="mb-5 w-full overflow-x-auto">
          <TabsTrigger variant="underline" value="pilotage">
            <Banknote />
            Pilotage
          </TabsTrigger>
          <TabsTrigger variant="underline" value="budget">
            <Percent />
            Budgets & engagements
          </TabsTrigger>
          <TabsTrigger variant="underline" value="depenses">
            <Receipt />
            Dépenses
          </TabsTrigger>
          <TabsTrigger variant="underline" value="factures">
            <CreditCard />
            Factures & recouvrement
          </TabsTrigger>
          <TabsTrigger variant="underline" value="tresorerie">
            <PiggyBank />
            Trésorerie
          </TabsTrigger>
        </TabsList>

        {/* ---------------------- Pilotage ---------------------- */}
        <TabsContent value="pilotage">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <ChartFrame
              className="xl:col-span-8"
              title="Facturation, encaissement et dépenses"
              subtitle="12 derniers mois, en millions de FCFA"
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
                  <CardTitle>Répartition des dépenses</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Cumul exercice, toutes natures</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <CategoryDonut
                    data={expenseByCategory.map((c) => ({ name: c.name, value: c.value }))}
                    centerValue={formatMoneyCompact(totalExpenses)}
                    centerLabel="dépensé"
                  />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {expenseByCategory.map((c, i) => (
                    <li key={c.name} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[13px] text-ink-600">
                        <span className="size-2.5 rounded-[3px]" style={{ background: SERIES[i % SERIES.length] }} />
                        {c.name}
                      </span>
                      <span className="tnum text-[13px] font-medium text-ink-900">
                        {formatMoneyCompact(c.value)}
                        <span className="ml-1.5 text-[11px] text-ink-400">
                          {Math.round((c.value / totalExpenses) * 100)} %
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <ChartFrame
              className="xl:col-span-7"
              title="Marge prévisionnelle contre marge réelle"
              subtitle="Écart cumulé de 3,1 points sur 6 mois"
              height={240}
              legend={
                <ChartLegend
                  items={[
                    { label: "Prévisionnelle", color: SERIES[4], shape: "dash" },
                    { label: "Réelle", color: SERIES[0], shape: "line" },
                  ]}
                />
              }
              footnote="L'érosion provient principalement des chantiers Yopougon et Nsimalen (sujétions imprévues et pénalités)."
            >
              <MarginChart data={marginSeries} />
            </ChartFrame>

            <Card className="xl:col-span-5">
              <CardHeader>
                <div>
                  <CardTitle>Rentabilité par chantier</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Classement par marge prévisionnelle</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectMarginRanking.slice(0, 7).map((p) => (
                  <div key={p.id}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <Link href={`/projets/${p.id}`} className="truncate text-[13px] font-medium text-ink-800 hover:text-brand-800">
                        {p.name}
                      </Link>
                      <span
                        className={cn(
                          "tnum shrink-0 text-[13px] font-semibold",
                          p.margin >= 20 ? "text-ok-600" : p.margin >= 15 ? "text-ink-800" : "text-risk-600",
                        )}
                      >
                        {formatPercent(p.margin, 1)}
                      </span>
                    </div>
                    <Progress
                      value={(p.margin / 25) * 100}
                      size="xs"
                      barClassName={p.margin >= 20 ? "bg-ok-500" : p.margin >= 15 ? "bg-brand-600" : "bg-risk-500"}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ----------------------- Budget ----------------------- */}
        <TabsContent value="budget">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <ChartFrame
              className="xl:col-span-7"
              title="Budget, engagé et réalisé par chantier"
              subtitle="En millions de FCFA"
              height={360}
              legend={
                <ChartLegend
                  items={[
                    { label: "Budget", color: "#e2e5ec" },
                    { label: "Engagé", color: SERIES[4] },
                    { label: "Réalisé", color: SERIES[0] },
                  ]}
                />
              }
            >
              <BudgetUsageChart
                data={projects.slice(0, 8).map((p) => ({
                  name: p.city + " · " + p.code.slice(-3),
                  budget: Math.round(p.budget / 1_000_000),
                  engage: Math.round(p.committed / 1_000_000),
                  realise: Math.round(p.spent / 1_000_000),
                }))}
              />
            </ChartFrame>

            <Card className="xl:col-span-5">
              <CardHeader>
                <div>
                  <CardTitle>Consommation budgétaire</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Alertes aux seuils 80 %, 100 % et 110 %</p>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Chantier</TH>
                        <TH align="right">Budget</TH>
                        <TH align="right">Réalisé</TH>
                        <TH align="right">Taux</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {expensesByProject.map((p) => (
                        <TR key={p.id} interactive>
                          <TD>
                            <Link href={`/projets/${p.id}`} className="block max-w-[12rem] truncate font-medium text-ink-900">
                              {p.name}
                            </Link>
                          </TD>
                          <TD align="right" className="tnum">{formatMoneyCompact(p.budget)}</TD>
                          <TD align="right" className="tnum">{formatMoneyCompact(p.spent)}</TD>
                          <TD align="right">
                            <Badge variant={p.usage > 100 ? "risk" : p.usage > 80 ? "warn" : "ok"} size="sm">
                              {p.usage} %
                            </Badge>
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </TableWrap>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------------- Dépenses ---------------------- */}
        <TabsContent value="depenses">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Dépenses récentes</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Justificatif photo obligatoire, validation par seuil</p>
                </div>
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
                        <TH>Chantier</TH>
                        <TH>Nature</TH>
                        <TH align="right">Montant</TH>
                        <TH>Statut</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {recentExpenses.map((expense) => {
                        const proj = projects.find((p) => p.id === expense.projectId);
                        return (
                          <TR key={expense.id} interactive>
                            <TD className="whitespace-nowrap">{formatDate(expense.date, "short")}</TD>
                            <TD>
                              <span className="block max-w-xs truncate font-medium text-ink-900">{expense.label}</span>
                              <span className="flex items-center gap-1 text-[11px] text-ink-400">
                                {expense.paymentMethod === "Mobile Money" ? <Smartphone className="size-3" /> : null}
                                {expense.paymentMethod} · {expense.author}
                              </span>
                            </TD>
                            <TD>
                              <Link href={`/projets/${expense.projectId}`} className="text-brand-700 hover:underline">
                                {proj?.code}
                              </Link>
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
                                {expense.status === "validated"
                                  ? "Validée"
                                  : expense.status === "pending"
                                    ? "À valider"
                                    : "Rejetée"}
                              </Badge>
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </TableWrap>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Factures fournisseurs</CardTitle>
                  <Badge variant="warn" size="sm">
                    {supplierInvoices.filter((s) => s.status === "to_match").length} à rapprocher
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {supplierInvoices.map((inv) => {
                    const supplier = suppliers.find((s) => s.id === inv.supplierId);
                    return (
                      <div key={inv.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink-900">{supplier?.name}</p>
                          <p className="tnum truncate text-[11px] text-ink-400">
                            {inv.number} · échéance {formatDate(inv.dueDate, "short")}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="tnum text-[13px] font-semibold text-ink-900">{formatMoneyCompact(inv.amount)}</p>
                          <Badge
                            variant={
                              inv.status === "paid"
                                ? "ok"
                                : inv.status === "validated"
                                  ? "brand"
                                  : inv.status === "matched"
                                    ? "info"
                                    : "warn"
                            }
                            size="sm"
                          >
                            {inv.status === "paid"
                              ? "Payée"
                              : inv.status === "validated"
                                ? "Validée"
                                : inv.status === "matched"
                                  ? "Rapprochée"
                                  : "À rapprocher"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paiements mobile money</CardTitle>
                  <Smartphone className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-line">
                    <DataRow label="Paie journaliers (septembre)" value={formatMoneyCompact(7_517_000)} />
                    <DataRow label="Paiements fournisseurs" value={formatMoneyCompact(24_800_000)} />
                    <DataRow label="Transactions du mois" value="148" />
                    <DataRow label="Taux de succès" value="99,3 %" />
                  </div>
                  <Button variant="secondary" size="sm" className="mt-3 w-full">
                    <ArrowDownToLine />
                    Relevé des transactions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------- Factures ---------------------- */}
        <TabsContent value="factures">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Factures et situations de travaux</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Retenue de garantie appliquée selon le marché</p>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Facture</TH>
                        <TH>Client</TH>
                        <TH align="right">Montant</TH>
                        <TH align="right">Réglé</TH>
                        <TH align="right">Échéance</TH>
                        <TH>Statut</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {invoices.map((invoice) => {
                        const client = clients.find((c) => c.id === invoice.clientId);
                        const meta = invoiceStatusMeta[invoice.status];
                        const late = invoice.status === "overdue";
                        return (
                          <TR key={invoice.id} interactive>
                            <TD>
                              <span className="tnum block font-medium text-ink-900">{invoice.number}</span>
                              <span className="block max-w-[16rem] truncate text-[11px] text-ink-400">{invoice.label}</span>
                            </TD>
                            <TD className="max-w-[10rem] truncate">{client?.name}</TD>
                            <TD align="right" className="tnum font-medium text-ink-900">
                              {formatMoneyCompact(invoice.amount)}
                            </TD>
                            <TD align="right" className="tnum">
                              {invoice.paid > 0 ? formatMoneyCompact(invoice.paid) : "—"}
                            </TD>
                            <TD align="right">
                              <span className={cn("block whitespace-nowrap", late && "font-medium text-risk-600")}>
                                {formatDate(invoice.dueDate, "short")}
                              </span>
                              <span className="block text-[11px] text-ink-400">{relativeFromToday(invoice.dueDate)}</span>
                            </TD>
                            <TD>
                              <Badge variant={meta.variant} size="sm">
                                {meta.label}
                              </Badge>
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </TableWrap>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Balance âgée</CardTitle>
                    <p className="mt-0.5 text-[13px] text-ink-500">Encours client par ancienneté</p>
                  </div>
                  <TrendingDown className="size-4 text-risk-500" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {agingBuckets.map((bucket) => {
                    const max = Math.max(...agingBuckets.map((b) => b.amount));
                    const critical = bucket.bucket.includes("61") || bucket.bucket.includes("90");
                    return (
                      <div key={bucket.bucket}>
                        <div className="mb-1 flex items-baseline justify-between">
                          <span className="text-[13px] text-ink-600">{bucket.bucket}</span>
                          <span className="tnum text-[13px] font-semibold text-ink-900">
                            {formatMoneyCompact(bucket.amount)}
                          </span>
                        </div>
                        <Progress
                          value={max ? (bucket.amount / max) * 100 : 0}
                          size="sm"
                          barClassName={critical ? "bg-risk-500" : "bg-brand-600"}
                        />
                      </div>
                    );
                  })}
                  <p className="border-t border-line pt-3 text-[12px] leading-relaxed text-ink-500">
                    <span className="font-semibold text-risk-600">{formatMoneyCompact(portfolio.overdue)}</span> échus
                    depuis plus de 30 jours, concentrés sur deux maîtres d&apos;ouvrage publics.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions de recouvrement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {overdueInvoices.map((inv) => {
                    const client = clients.find((c) => c.id === inv.clientId);
                    return (
                      <div key={inv.id} className="rounded-lg border border-risk-100 bg-risk-50/50 p-3">
                        <p className="text-[13px] font-medium text-ink-900">{client?.name}</p>
                        <p className="tnum mt-0.5 text-[12px] text-ink-500">
                          {inv.number} · {formatMoney(inv.amount)}
                        </p>
                        <div className="mt-2.5 flex gap-1.5">
                          <Button size="xs" variant="danger" className="flex-1">
                            Mise en demeure
                          </Button>
                          <Button size="xs" variant="secondary">
                            Relancer
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --------------------- Trésorerie --------------------- */}
        <TabsContent value="tresorerie">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <ChartFrame
              className="xl:col-span-8"
              title="Prévisionnel de trésorerie — 13 semaines"
              subtitle="Encaissements attendus, décaissements engagés et solde projeté"
              height={320}
              legend={
                <ChartLegend
                  items={[
                    { label: "Encaissements", color: SERIES[0] },
                    { label: "Décaissements", color: SERIES[1] },
                    { label: "Solde", color: SERIES[3], shape: "line" },
                  ]}
                />
              }
              footnote="Hypothèse : règlement des situations publiques sous 60 jours. Un décalage de 30 jours ramène le point bas à 164 M FCFA."
            >
              <CashflowChart data={cashPosition} />
            </ChartFrame>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Position de trésorerie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-line">
                    <DataRow label="Solde bancaire consolidé" value="342 M FCFA" />
                    <DataRow label="Encaissements attendus (13 s)" value="2,06 Md FCFA" />
                    <DataRow label="Décaissements engagés (13 s)" value="1,85 Md FCFA" />
                    <DataRow label="Point bas projeté (S41)" value={<span className="text-warn-600">298 M FCFA</span>} />
                    <DataRow label="Lignes de crédit disponibles" value="450 M FCFA" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leviers disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Lever
                    title="Affacturage des situations validées"
                    detail="372 M FCFA mobilisables sous 5 jours, commission 2,4 %"
                    action="Simuler"
                  />
                  <Lever
                    title="Étalement fournisseur Cimencam"
                    detail="Report de 45 jours négociable sur 24,6 M FCFA"
                    action="Négocier"
                  />
                  <Lever
                    title="Facturation anticipée Kribi"
                    detail="Situation n°7 prête à émettre : 58,2 M FCFA"
                    action="Émettre"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Lever({ title, detail, action }: { title: string; detail: string; action: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-3">
      <p className="text-[13px] font-medium text-ink-900">{title}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{detail}</p>
      <Button size="xs" variant="outline" className="mt-2">
        {action}
      </Button>
    </div>
  );
}
