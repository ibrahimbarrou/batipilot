"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarClock,
  Handshake,
  Kanban,
  Phone,
  Plus,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow, Progress } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { ChartFrame } from "@/components/charts/kit";
import { FunnelBars } from "@/components/charts/charts";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { clients, conversionFunnel, leads, people, pipelineStages, quotes } from "@/data";
import { cn, formatDate, formatMoneyCompact, relativeFromToday } from "@/lib/utils";

const STAGE_TONE: Record<string, string> = {
  prospect: "bg-ink-400",
  visite: "bg-brand-400",
  etude: "bg-brand-600",
  devis: "bg-signal-400",
  negociation: "bg-signal-600",
  gagne: "bg-ok-500",
  perdu: "bg-ink-300",
};

export function CrmView() {
  const open = leads.filter((l) => l.stage !== "gagne" && l.stage !== "perdu");
  const weighted = open.reduce((s, l) => s + (l.budget * l.probability) / 100, 0);
  const won = leads.filter((l) => l.stage === "gagne");
  const winRate = Math.round((won.length / (won.length + leads.filter((l) => l.stage === "perdu").length)) * 100);
  const nextActions = [...leads]
    .filter((l) => l.stage !== "perdu")
    .sort((a, b) => a.nextActionDate.localeCompare(b.nextActionDate))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Développement commercial"
        title="CRM & prospection"
        description="Du premier contact au contrat signé : pipeline pondéré, relances programmées et conversion directe en devis puis en projet."
        meta={
          <>
            <Badge variant="brand">{open.length} opportunités ouvertes</Badge>
            <Badge variant="neutral">Pipeline pondéré {formatMoneyCompact(weighted)}</Badge>
            <Badge variant="ok">Taux de réussite {winRate} %</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Phone />
              Programmer une relance
            </Button>
            <Button>
              <Plus />
              Nouveau prospect
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pipeline brut" value={formatMoneyCompact(open.reduce((s, l) => s + l.budget, 0))} delta={21} icon={<Target />} accent="brand" trend={[2.1, 2.4, 2.8, 3.1, 3.4, 3.8, 4.1, 4.4]} />
        <KpiCard label="Pipeline pondéré" value={formatMoneyCompact(weighted)} delta={14} icon={<TrendingUp />} accent="ok" trend={[0.8, 0.9, 1.1, 1.2, 1.3, 1.5, 1.6, 1.7]} />
        <KpiCard label="Opportunités gagnées" value={`${won.length}`} delta={33} deltaLabel="ce trimestre" icon={<Handshake />} accent="signal" />
        <KpiCard label="Clients actifs" value={`${clients.length}`} delta={12} icon={<Users />} accent="brand" hint="dont 1 client diaspora" />
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="pipeline">
            <Kanban />
            Pipeline
          </TabsTrigger>
          <TabsTrigger variant="underline" value="opportunites">
            <Target />
            Opportunités
          </TabsTrigger>
          <TabsTrigger variant="underline" value="clients">
            <Users />
            Clients
          </TabsTrigger>
        </TabsList>

        {/* ---------------------- Pipeline ---------------------- */}
        <TabsContent value="pipeline">
          <div className="scrollbar-slim -mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
            {pipelineStages.map((stage) => {
              const items = leads.filter((l) => l.stage === stage.id);
              const total = items.reduce((s, l) => s + l.budget, 0);
              return (
                <div key={stage.id} className="flex w-[268px] shrink-0 flex-col rounded-lg border border-line bg-ink-50/60">
                  <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", STAGE_TONE[stage.id])} />
                      <span className="text-[13px] font-semibold text-ink-800">{stage.label}</span>
                      <span className="tnum rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium text-ink-500 ring-1 ring-line">
                        {items.length}
                      </span>
                    </div>
                    <span className="tnum text-[11px] text-ink-400">{formatMoneyCompact(total)}</span>
                  </div>
                  <div className="flex-1 space-y-2 p-2">
                    {items.map((lead) => {
                      const owner = people.find((p) => p.id === lead.ownerId);
                      return (
                        <div
                          key={lead.id}
                          className="rounded-lg border border-line bg-white p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] leading-snug font-semibold text-ink-900">{lead.company}</p>
                            <Avatar initials={owner?.initials ?? "??"} tone={owner?.avatarTone} size="xs" />
                          </div>
                          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-500">{lead.need}</p>
                          <p className="tnum mt-2 text-[14px] font-semibold text-brand-800">
                            {formatMoneyCompact(lead.budget)}
                          </p>
                          <div className="mt-2">
                            <div className="mb-1 flex items-center justify-between text-[10px] text-ink-400">
                              <span>{lead.source}</span>
                              <span className="tnum">{lead.probability} %</span>
                            </div>
                            <Progress value={lead.probability} size="xs" barClassName={lead.probability >= 60 ? "bg-ok-500" : "bg-brand-600"} />
                          </div>
                          <p className="mt-2 flex items-center gap-1 border-t border-line pt-2 text-[11px] text-ink-400">
                            <CalendarClock className="size-3" />
                            {relativeFromToday(lead.nextActionDate)}
                          </p>
                        </div>
                      );
                    })}
                    {items.length === 0 ? (
                      <p className="px-2 py-6 text-center text-xs text-ink-400">Aucune opportunité</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* -------------------- Opportunités -------------------- */}
        <TabsContent value="opportunites">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <TableWrap>
                <Table>
                  <THead>
                    <TR>
                      <TH>Opportunité</TH>
                      <TH>Besoin</TH>
                      <TH align="right">Budget</TH>
                      <TH align="right">Probabilité</TH>
                      <TH>Prochaine action</TH>
                      <TH>Étape</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {leads.map((lead) => (
                      <TR key={lead.id} interactive>
                        <TD>
                          <span className="block font-medium text-ink-900">{lead.company}</span>
                          <span className="block text-[11px] text-ink-400">
                            {lead.contact} · {lead.city}
                          </span>
                        </TD>
                        <TD className="max-w-[16rem] truncate">{lead.need}</TD>
                        <TD align="right" className="tnum font-medium text-ink-900">
                          {formatMoneyCompact(lead.budget)}
                        </TD>
                        <TD align="right" className="tnum">
                          {lead.probability} %
                        </TD>
                        <TD>
                          <span className="block max-w-[14rem] truncate text-[12px] text-ink-700">{lead.nextAction}</span>
                          <span className="block text-[11px] text-ink-400">{formatDate(lead.nextActionDate, "short")}</span>
                        </TD>
                        <TD>
                          <Badge
                            variant={lead.stage === "gagne" ? "ok" : lead.stage === "perdu" ? "neutral" : lead.stage === "negociation" ? "signal" : "brand"}
                            size="sm"
                          >
                            {pipelineStages.find((s) => s.id === lead.stage)?.label}
                          </Badge>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrap>
            </div>

            <div className="space-y-4 xl:col-span-4">
              <ChartFrame title="Entonnoir de conversion" subtitle="12 derniers mois" height={220}>
                <FunnelBars data={conversionFunnel} />
              </ChartFrame>

              <Card>
                <CardHeader>
                  <CardTitle>Relances à faire</CardTitle>
                  <CalendarClock className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {nextActions.map((lead) => (
                    <div key={lead.id} className="rounded-lg border border-line p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-[13px] font-medium text-ink-900">{lead.company}</p>
                        <span className="shrink-0 text-[11px] text-ink-400">{relativeFromToday(lead.nextActionDate)}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{lead.nextAction}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Devis liés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quotes.slice(0, 4).map((quote) => (
                    <Link
                      key={quote.id}
                      href={`/devis/${quote.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 transition-colors hover:bg-ink-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-ink-900">{quote.projectName}</span>
                        <span className="tnum block text-[11px] text-ink-400">{quote.number}</span>
                      </span>
                      <span className="tnum shrink-0 text-[13px] font-semibold text-ink-800">
                        {formatMoneyCompact(quote.amountHT)}
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ----------------------- Clients ---------------------- */}
        <TabsContent value="clients">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <Card key={client.id} interactive>
                <CardHeader>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar initials={client.name.slice(0, 2).toUpperCase()} tone={client.tone} size="lg" />
                    <div className="min-w-0">
                      <CardTitle className="truncate">{client.name}</CardTitle>
                      <p className="truncate text-[12px] text-ink-400">
                        {client.contact} · {client.city}
                      </p>
                    </div>
                  </div>
                  <Badge variant={client.type === "Diaspora" ? "signal" : client.type === "Public" ? "brand" : "neutral"} size="sm">
                    {client.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-line">
                    <DataRow label="Chantiers" value={client.projectIds.length} />
                    <DataRow label="Contracté" value={formatMoneyCompact(client.totalContracted)} />
                    <DataRow label="Encaissé" value={formatMoneyCompact(client.totalPaid)} />
                    <DataRow
                      label="Satisfaction"
                      value={
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5 fill-signal-400 text-signal-400" />
                          {client.satisfaction.toFixed(1)}
                        </span>
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {client.projectIds.map((id) => (
                      <Link key={id} href={`/projets/${id}`}>
                        <Badge variant="outline" size="sm">
                          {id.toUpperCase()}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
