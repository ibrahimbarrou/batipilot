"use client";

import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  PackageCheck,
  Plus,
  Search,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { Badge, poStatusMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow, Progress } from "@/components/ui/data-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { projects, purchaseOrders, suppliers } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, relativeFromToday } from "@/lib/utils";

const PROCUREMENT_FLOW = [
  { label: "Demande d'achat", detail: "Émise depuis le chantier", icon: Plus },
  { label: "Validation conducteur", detail: "Contrôle du besoin et du budget", icon: CheckCircle2 },
  { label: "Demande de prix", detail: "Consultation multi-fournisseurs", icon: Search },
  { label: "Bon de commande", detail: "Validation par seuil financier", icon: FileCheck2 },
  { label: "Réception", detail: "BL photographié, écarts relevés", icon: PackageCheck },
  { label: "Facture & paiement", detail: "Rapprochement à trois niveaux", icon: Truck },
];

export function SuppliersView() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => `${s.name} ${s.category} ${s.city}`.toLowerCase().includes(q));
  }, [query]);

  const toValidate = purchaseOrders.filter((po) => po.status === "to_validate");
  const totalVolume = suppliers.reduce((s, x) => s + x.volume, 0);
  const totalOutstanding = suppliers.reduce((s, x) => s + x.outstanding, 0);

  return (
    <>
      <PageHeader
        eyebrow="Achats"
        title="Fournisseurs & approvisionnements"
        description="Du besoin exprimé sur le chantier au paiement de la facture : chaque étape met à jour l'engagé et le réalisé du projet."
        meta={
          <>
            <Badge variant="brand">{suppliers.length} fournisseurs référencés</Badge>
            <Badge variant="warn" dot>
              {toValidate.length} commandes à valider
            </Badge>
            <Badge variant="neutral">Encours {formatMoneyCompact(totalOutstanding)}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Search />
              Demande de prix
            </Button>
            <Button>
              <Plus />
              Bon de commande
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Volume d'achats" value={formatMoneyCompact(totalVolume)} delta={14} icon={<Truck />} accent="brand" trend={[180, 220, 268, 310, 352, 398, 442, 486]} />
        <KpiCard label="Commandes en cours" value={`${purchaseOrders.filter((p) => p.status !== "invoiced").length}`} icon={<FileCheck2 />} accent="signal" hint="dont 2 en attente de validation" />
        <KpiCard label="Taux de respect des délais" value="87 %" delta={5} icon={<Clock3 />} accent="ok" trend={[76, 79, 81, 82, 84, 85, 86, 87]} />
        <KpiCard label="Encours fournisseurs" value={formatMoneyCompact(totalOutstanding)} delta={-9} deltaLabel="vs mois dernier" upIsGood={false} icon={<BadgeCheck />} accent="warn" />
      </div>

      <Card className="mb-5">
        <CardHeader>
          <div>
            <CardTitle>Circuit d&apos;achat</CardTitle>
            <p className="mt-0.5 text-[13px] text-ink-500">Le terrain déclenche, la finance contrôle, le projet est mis à jour</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {PROCUREMENT_FLOW.map((step, i) => (
              <div key={step.label} className="relative rounded-lg border border-line bg-surface-2 p-3">
                <span className="absolute top-2 right-2.5 text-[11px] font-semibold text-ink-300">0{i + 1}</span>
                <step.icon className="size-4 text-brand-600" />
                <p className="mt-2 text-[13px] leading-snug font-medium text-ink-900">{step.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repertoire">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="repertoire">
            <Truck />
            Répertoire
          </TabsTrigger>
          <TabsTrigger variant="underline" value="commandes">
            <FileCheck2 />
            Bons de commande
          </TabsTrigger>
          <TabsTrigger variant="underline" value="evaluations">
            <Star />
            Évaluations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repertoire">
          <Toolbar>
            <div className="w-full sm:w-72">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un fournisseur…" icon={<Search />} />
            </div>
          </Toolbar>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((supplier) => (
              <Card key={supplier.id} interactive>
                <CardHeader>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar initials={supplier.name.slice(0, 2).toUpperCase()} tone={supplier.tone} size="lg" />
                    <div className="min-w-0">
                      <CardTitle className="flex items-center gap-1.5 truncate">
                        {supplier.name}
                        {supplier.certified ? <BadgeCheck className="size-4 shrink-0 text-brand-600" /> : null}
                      </CardTitle>
                      <p className="truncate text-[12px] text-ink-400">
                        {supplier.category} · {supplier.city}
                      </p>
                    </div>
                  </div>
                  <Badge variant={supplier.status === "active" ? "ok" : supplier.status === "watch" ? "warn" : "risk"} size="sm">
                    {supplier.status === "active" ? "Actif" : supplier.status === "watch" ? "Sous surveillance" : "Bloqué"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <Rating label="Délai" value={supplier.rating.delay} />
                    <Rating label="Qualité" value={supplier.rating.quality} />
                    <Rating label="Prix" value={supplier.rating.price} />
                  </div>
                  <div className="mt-3 divide-y divide-line border-t border-line">
                    <DataRow label="Commandes" value={supplier.ordersCount} />
                    <DataRow label="Volume" value={formatMoneyCompact(supplier.volume)} />
                    <DataRow
                      label="Encours"
                      value={
                        <span className={supplier.outstanding > 40_000_000 ? "text-warn-600" : ""}>
                          {formatMoneyCompact(supplier.outstanding)}
                        </span>
                      }
                    />
                    <DataRow label="Règlement" value={supplier.paymentTerms} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="commandes">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <TableWrap>
                <Table>
                  <THead>
                    <TR>
                      <TH>Commande</TH>
                      <TH>Fournisseur</TH>
                      <TH>Chantier</TH>
                      <TH align="right">Montant</TH>
                      <TH align="right">Livraison</TH>
                      <TH>Statut</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {purchaseOrders.map((po) => {
                      const supplier = suppliers.find((s) => s.id === po.supplierId);
                      const project = projects.find((p) => p.id === po.projectId);
                      const meta = poStatusMeta[po.status];
                      return (
                        <TR key={po.id} interactive>
                          <TD>
                            <span className="tnum block font-medium text-ink-900">{po.number}</span>
                            <span className="block max-w-[15rem] truncate text-[11px] text-ink-400">
                              {po.lines[0]?.designation}
                            </span>
                          </TD>
                          <TD className="max-w-[10rem] truncate">{supplier?.name}</TD>
                          <TD>
                            <Link href={`/projets/${po.projectId}`} className="text-brand-700 hover:underline">
                              {project?.code}
                            </Link>
                          </TD>
                          <TD align="right" className="tnum font-medium text-ink-900">
                            {formatMoney(po.amount)}
                          </TD>
                          <TD align="right">
                            <span className="block whitespace-nowrap">{formatDate(po.expectedDate, "short")}</span>
                            <span className="block text-[11px] text-ink-400">{relativeFromToday(po.expectedDate)}</span>
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
            </div>

            <Card className="xl:col-span-4">
              <CardHeader>
                <div>
                  <CardTitle>Validations en attente</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Seuil : 2 M FCFA → RF, 10 M FCFA → DG</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {toValidate.map((po) => {
                  const supplier = suppliers.find((s) => s.id === po.supplierId);
                  return (
                    <div key={po.id} className="rounded-lg border border-warn-100 bg-warn-50/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="tnum text-[12px] font-semibold text-ink-700">{po.number}</span>
                        <Badge variant="warn" size="sm">
                          à valider
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-[13px] font-medium text-ink-900">{supplier?.name}</p>
                      <p className="text-[12px] text-ink-500">{po.lines[0]?.designation}</p>
                      <p className="tnum mt-1.5 text-[15px] font-semibold text-ink-900">{formatMoney(po.amount)}</p>
                      <p className="mt-0.5 text-[11px] text-ink-400">Demandé par {po.requester}</p>
                      <div className="mt-2.5 flex gap-1.5">
                        <Button size="xs" className="flex-1">
                          <CheckCircle2 />
                          Valider
                        </Button>
                        <Button size="xs" variant="secondary">
                          <XCircle />
                          Refuser
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {toValidate.length === 0 ? (
                  <p className="py-6 text-center text-[13px] text-ink-400">Aucune validation en attente.</p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluations">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Fournisseur</TH>
                  <TH>Catégorie</TH>
                  <TH>Délai</TH>
                  <TH>Qualité</TH>
                  <TH>Prix</TH>
                  <TH align="right">Note globale</TH>
                  <TH>Statut</TH>
                </TR>
              </THead>
              <TBody>
                {[...suppliers]
                  .sort(
                    (a, b) =>
                      (b.rating.delay + b.rating.quality + b.rating.price) / 3 -
                      (a.rating.delay + a.rating.quality + a.rating.price) / 3,
                  )
                  .map((supplier) => {
                    const global = (supplier.rating.delay + supplier.rating.quality + supplier.rating.price) / 3;
                    return (
                      <TR key={supplier.id} interactive>
                        <TD className="font-medium text-ink-900">{supplier.name}</TD>
                        <TD>{supplier.category}</TD>
                        <TD className="w-28">
                          <Progress value={(supplier.rating.delay / 5) * 100} size="xs" barClassName={supplier.rating.delay < 3.5 ? "bg-risk-500" : "bg-brand-600"} />
                        </TD>
                        <TD className="w-28">
                          <Progress value={(supplier.rating.quality / 5) * 100} size="xs" barClassName="bg-brand-600" />
                        </TD>
                        <TD className="w-28">
                          <Progress value={(supplier.rating.price / 5) * 100} size="xs" barClassName="bg-brand-600" />
                        </TD>
                        <TD align="right">
                          <span className={cn("tnum font-semibold", global >= 4.3 ? "text-ok-600" : global < 3.8 ? "text-warn-600" : "text-ink-800")}>
                            {global.toFixed(1)} / 5
                          </span>
                        </TD>
                        <TD>
                          <Badge variant={supplier.status === "active" ? "ok" : "warn"} size="sm">
                            {supplier.status === "active" ? "Actif" : "Surveillance"}
                          </Badge>
                        </TD>
                      </TR>
                    );
                  })}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Rating({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-ink-50 px-2 py-1.5 text-center">
      <p className="text-[10px] tracking-wide text-ink-400 uppercase">{label}</p>
      <p className={cn("tnum text-[14px] font-semibold", value >= 4.3 ? "text-ok-600" : value < 3.5 ? "text-warn-600" : "text-ink-900")}>
        {value.toFixed(1)}
      </p>
    </div>
  );
}
