"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  Boxes,
  Gauge,
  Plus,
  QrCode,
  Search,
  Truck,
  Wrench,
} from "lucide-react";
import { Badge, assetStatusMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow, Progress } from "@/components/ui/data-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { assets, maintenancePlan, projects, stock, stockMovements } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, formatNumber, relativeFromToday } from "@/lib/utils";

export function AssetsView() {
  const [query, setQuery] = React.useState("");

  const filteredAssets = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter((a) => `${a.name} ${a.code} ${a.brand} ${a.location}`.toLowerCase().includes(q));
  }, [query]);

  const lowStock = stock.filter((s) => s.qty < s.minQty);
  const stockValue = stock.reduce((s, item) => s + item.qty * item.unitCost, 0);
  const fleetValue = assets.reduce((s, a) => s + a.acquisitionValue, 0);
  const availability = Math.round((assets.filter((a) => a.status === "in_service").length / assets.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Logistique"
        title="Matériel & stocks"
        description="Parc d'engins, outillage et consommables : affectation par chantier, mouvements scannés en QR code, maintenance préventive et alertes de rupture."
        meta={
          <>
            <Badge variant="brand">{assets.length} équipements</Badge>
            <Badge variant="risk" dot>
              {lowStock.length} articles sous le seuil
            </Badge>
            <Badge variant="neutral">Valeur de stock {formatMoneyCompact(stockValue)}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <QrCode />
              Scanner
            </Button>
            <Button>
              <Plus />
              Nouveau mouvement
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Taux de disponibilité du parc" value={`${availability} %`} delta={-6} deltaLabel="2 engins immobilisés" icon={<Gauge />} accent="warn" trend={[92, 90, 88, 86, 84, 82, 80, 79]} />
        <KpiCard label="Valeur du parc" value={formatMoneyCompact(fleetValue)} icon={<Truck />} accent="brand" hint="propriété + location" />
        <KpiCard label="Valeur de stock" value={formatMoneyCompact(stockValue)} delta={8} icon={<Boxes />} accent="ok" trend={[18, 21, 24, 22, 26, 28, 30, 32]} />
        <KpiCard label="Coût de maintenance (mois)" value={formatMoneyCompact(maintenancePlan.reduce((s, m) => s + m.cost, 0))} delta={34} upIsGood={false} icon={<Wrench />} accent="risk" />
      </div>

      <Tabs defaultValue="parc">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="parc">
            <Truck />
            Parc matériel
          </TabsTrigger>
          <TabsTrigger variant="underline" value="stocks">
            <Boxes />
            Stocks
          </TabsTrigger>
          <TabsTrigger variant="underline" value="maintenance">
            <Wrench />
            Maintenance
          </TabsTrigger>
          <TabsTrigger variant="underline" value="mouvements">
            <ArrowLeftRight />
            Mouvements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parc">
          <Toolbar>
            <div className="w-full sm:w-72">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un engin…" icon={<Search />} />
            </div>
          </Toolbar>

          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Équipement</TH>
                  <TH>Famille</TH>
                  <TH>Affectation</TH>
                  <TH align="right">Compteur</TH>
                  <TH align="right">Coût / jour</TH>
                  <TH align="right">Prochaine maintenance</TH>
                  <TH>Statut</TH>
                </TR>
              </THead>
              <TBody>
                {filteredAssets.map((asset) => {
                  const project = projects.find((p) => p.id === asset.projectId);
                  const meta = assetStatusMeta[asset.status];
                  const dueSoon = relativeFromToday(asset.nextMaintenance).startsWith("dans 0") || asset.nextMaintenance <= "2026-09-30";
                  return (
                    <TR key={asset.id} interactive>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                            <QrCode className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-ink-900">{asset.name}</span>
                            <span className="tnum block text-[11px] text-ink-400">
                              {asset.code} · {asset.brand} · {asset.owner}
                            </span>
                          </span>
                        </span>
                      </TD>
                      <TD>
                        <Badge variant="neutral" size="sm">
                          {asset.family}
                        </Badge>
                      </TD>
                      <TD>
                        {project ? (
                          <Link href={`/projets/${project.id}`} className="text-brand-700 hover:underline">
                            {project.code}
                          </Link>
                        ) : (
                          <span className="text-ink-400">{asset.location}</span>
                        )}
                      </TD>
                      <TD align="right" className="tnum">
                        {asset.hours > 0 ? `${formatNumber(asset.hours)} h` : "—"}
                      </TD>
                      <TD align="right" className="tnum">
                        {asset.dailyCost > 0 ? formatMoney(asset.dailyCost) : "—"}
                      </TD>
                      <TD align="right">
                        <span className={cn("block whitespace-nowrap", dueSoon && "font-medium text-warn-600")}>
                          {formatDate(asset.nextMaintenance, "short")}
                        </span>
                        <span className="block text-[11px] text-ink-400">{relativeFromToday(asset.nextMaintenance)}</span>
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
        </TabsContent>

        <TabsContent value="stocks">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <TableWrap>
                <Table>
                  <THead>
                    <TR>
                      <TH>Article</TH>
                      <TH>Dépôt</TH>
                      <TH align="right">Stock</TH>
                      <TH align="right">Seuil</TH>
                      <TH>Couverture</TH>
                      <TH align="right">Valeur</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {stock.map((item) => {
                      const low = item.qty < item.minQty;
                      const ratio = Math.min((item.qty / (item.minQty * 2)) * 100, 100);
                      return (
                        <TR key={item.id} interactive>
                          <TD>
                            <span className="block font-medium text-ink-900">{item.label}</span>
                            <span className="tnum block text-[11px] text-ink-400">
                              {item.ref} · {item.category}
                            </span>
                          </TD>
                          <TD>{item.warehouse}</TD>
                          <TD align="right">
                            <span className={cn("tnum font-semibold", low ? "text-risk-600" : "text-ink-900")}>
                              {formatNumber(item.qty, item.qty % 1 === 0 ? 0 : 1)} {item.unit}
                            </span>
                          </TD>
                          <TD align="right" className="tnum text-ink-500">
                            {formatNumber(item.minQty)} {item.unit}
                          </TD>
                          <TD className="w-32">
                            <Progress value={ratio} size="xs" barClassName={low ? "bg-risk-500" : ratio > 70 ? "bg-ok-500" : "bg-brand-600"} />
                          </TD>
                          <TD align="right" className="tnum">
                            {formatMoneyCompact(item.qty * item.unitCost)}
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </TableWrap>
            </div>

            <Card className="xl:col-span-4">
              <CardHeader>
                <div>
                  <CardTitle>Alertes de rupture</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Seuil minimal par article et par dépôt</p>
                </div>
                <AlertTriangle className="size-4 text-risk-500" />
              </CardHeader>
              <CardContent className="space-y-2.5">
                {lowStock.map((item) => (
                  <div key={item.id} className="rounded-lg border border-risk-100 bg-risk-50/50 p-3">
                    <p className="text-[13px] font-medium text-ink-900">{item.label}</p>
                    <p className="tnum mt-0.5 text-[12px] text-ink-500">
                      {formatNumber(item.qty, item.qty % 1 === 0 ? 0 : 1)} {item.unit} en stock — seuil{" "}
                      {formatNumber(item.minQty)} {item.unit}
                    </p>
                    <p className="text-[11px] text-ink-400">{item.warehouse}</p>
                    <Button size="xs" className="mt-2 w-full">
                      Lancer une demande d&apos;achat
                    </Button>
                  </div>
                ))}
                {lowStock.length === 0 ? (
                  <p className="py-6 text-center text-[13px] text-ink-400">Aucune rupture détectée.</p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Plan de maintenance</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Préventif par heures moteur et par échéance calendaire</p>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Équipement</TH>
                        <TH>Intervention</TH>
                        <TH align="right">Date</TH>
                        <TH align="right">Coût estimé</TH>
                        <TH>Statut</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {maintenancePlan.map((plan) => {
                        const asset = assets.find((a) => a.id === plan.assetId);
                        return (
                          <TR key={plan.assetId + plan.date}>
                            <TD>
                              <span className="block font-medium text-ink-900">{asset?.name}</span>
                              <span className="tnum block text-[11px] text-ink-400">{asset?.code}</span>
                            </TD>
                            <TD>{plan.label}</TD>
                            <TD align="right">
                              <span className="block whitespace-nowrap">{formatDate(plan.date, "short")}</span>
                              <span className="block text-[11px] text-ink-400">{relativeFromToday(plan.date)}</span>
                            </TD>
                            <TD align="right" className="tnum font-medium text-ink-900">
                              {formatMoney(plan.cost)}
                            </TD>
                            <TD>
                              <Badge
                                variant={plan.status === "En cours" ? "warn" : plan.status === "À planifier" ? "risk" : "neutral"}
                                size="sm"
                              >
                                {plan.status}
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

            <Card className="xl:col-span-4">
              <CardHeader>
                <CardTitle>Immobilisations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assets
                  .filter((a) => a.status === "broken" || a.status === "maintenance")
                  .map((asset) => (
                    <div key={asset.id} className="rounded-lg border border-warn-100 bg-warn-50/50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink-900">{asset.name}</p>
                          <p className="tnum text-[11px] text-ink-400">
                            {asset.code} · {asset.location}
                          </p>
                        </div>
                        <Badge variant={asset.status === "broken" ? "risk" : "warn"} size="sm">
                          {assetStatusMeta[asset.status].label}
                        </Badge>
                      </div>
                      <p className="mt-2 text-[12px] text-ink-500">
                        Coût d&apos;immobilisation estimé :{" "}
                        <span className="tnum font-semibold text-ink-800">{formatMoney(asset.dailyCost * 6)}</span> sur 6
                        jours
                      </p>
                    </div>
                  ))}
                <div className="divide-y divide-line border-t border-line pt-1">
                  <DataRow label="Heures moteur cumulées" value={`${formatNumber(assets.reduce((s, a) => s + a.hours, 0))} h`} />
                  <DataRow label="Engins en location" value={assets.filter((a) => a.owner === "Location").length} />
                  <DataRow label="Coût location / jour" value={formatMoney(assets.filter((a) => a.owner === "Location").reduce((s, a) => s + a.dailyCost, 0))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mouvements">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Date</TH>
                  <TH>Référence</TH>
                  <TH>Mouvement</TH>
                  <TH align="right">Quantité</TH>
                  <TH>Opérateur</TH>
                </TR>
              </THead>
              <TBody>
                {stockMovements.map((mv) => (
                  <TR key={mv.id}>
                    <TD className="whitespace-nowrap">{formatDate(mv.date, "short")}</TD>
                    <TD className="tnum font-medium text-ink-900">{mv.ref}</TD>
                    <TD>{mv.label}</TD>
                    <TD align="right">
                      <span className={cn("tnum font-semibold", mv.qty < 0 ? "text-risk-600" : "text-ok-600")}>
                        {mv.qty > 0 ? "+" : ""}
                        {formatNumber(mv.qty, mv.qty % 1 === 0 ? 0 : 1)} {mv.unit}
                      </span>
                    </TD>
                    <TD>{mv.by}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>
      </Tabs>
    </>
  );
}
