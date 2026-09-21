"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileSignature,
  Percent,
  PenLine,
  Plus,
  Search,
  Send,
  TrendingUp,
} from "lucide-react";
import { Badge, quoteStatusMeta, typeMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/data-display";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { clients, people, quotes } from "@/data";
import { cn, daysBetween, formatDate, formatMoneyCompact, formatPercent, margin, TODAY } from "@/lib/utils";

export function QuotesView() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((quote) => {
      if (status !== "all" && quote.status !== status) return false;
      if (!q) return true;
      return `${quote.projectName} ${quote.number} ${quote.city}`.toLowerCase().includes(q);
    });
  }, [query, status]);

  const sent = quotes.filter((q) => q.status === "sent");
  const signed = quotes.filter((q) => q.status === "signed");
  const pipeline = sent.reduce((s, q) => s + q.amountHT, 0);
  const winRate = Math.round((signed.length / quotes.filter((q) => q.status !== "draft").length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Avant-vente"
        title="Devis"
        description="Chiffrage au déboursé sec, coefficient de vente, validation interne puis signature électronique — un devis signé devient un projet en un clic."
        meta={
          <>
            <Badge variant="brand">{quotes.length} devis</Badge>
            <Badge variant="neutral">{formatMoneyCompact(pipeline)} en attente de réponse</Badge>
            <Badge variant="ok">Taux de transformation {winRate} %</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <PenLine />
              Bibliothèque de prix
            </Button>
            <Button>
              <Plus />
              Nouveau devis
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Devis en cours" value={`${sent.length + quotes.filter((q) => q.status === "internal_review").length}`} icon={<FileSignature />} accent="brand" hint="dont 1 en validation interne" />
        <KpiCard label="Montant proposé" value={formatMoneyCompact(pipeline)} delta={16} icon={<TrendingUp />} accent="ok" trend={[210, 268, 312, 356, 402, 448, 486, 512]} />
        <KpiCard label="Marge moyenne proposée" value={formatPercent(23.4, 1)} delta={1.2} icon={<Percent />} accent="signal" />
        <KpiCard label="Délai moyen de réponse" value="11 j" delta={-18} deltaLabel="vs trimestre précédent" upIsGood={false} icon={<Clock />} accent="warn" />
      </div>

      <Toolbar>
        <div className="w-full sm:w-72">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un devis…" icon={<Search />} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[11rem]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="internal_review">Validation interne</SelectItem>
            <SelectItem value="sent">Envoyé</SelectItem>
            <SelectItem value="signed">Signé</SelectItem>
            <SelectItem value="refused">Refusé</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Devis</TH>
                  <TH>Client</TH>
                  <TH align="right">Montant HT</TH>
                  <TH align="right">Marge</TH>
                  <TH align="right">Validité</TH>
                  <TH>Statut</TH>
                  <TH align="right"></TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((quote) => {
                  const client = clients.find((c) => c.id === quote.clientId);
                  const meta = quoteStatusMeta[quote.status];
                  const m = margin(quote.amountHT, quote.costPrice);
                  const daysLeft = daysBetween(TODAY, quote.validUntil);
                  return (
                    <TR key={quote.id} interactive>
                      <TD>
                        <Link href={`/devis/${quote.id}`} className="block">
                          <span className="block max-w-xs truncate text-[13px] font-medium text-ink-900">
                            {quote.projectName}
                          </span>
                          <span className="tnum block text-[11px] text-ink-400">
                            {quote.number} · v{quote.version} · {typeMeta[quote.type]}
                          </span>
                        </Link>
                      </TD>
                      <TD className="max-w-[10rem] truncate">{client?.name}</TD>
                      <TD align="right" className="tnum font-medium text-ink-900">
                        {formatMoneyCompact(quote.amountHT)}
                      </TD>
                      <TD align="right">
                        <span className={cn("tnum font-semibold", m >= 22 ? "text-ok-600" : m >= 18 ? "text-ink-800" : "text-warn-600")}>
                          {formatPercent(m, 1)}
                        </span>
                      </TD>
                      <TD align="right">
                        <span className="block whitespace-nowrap">{formatDate(quote.validUntil, "short")}</span>
                        <span className={cn("block text-[11px]", daysLeft < 15 && daysLeft > 0 ? "text-warn-600" : "text-ink-400")}>
                          {daysLeft > 0 ? `${daysLeft} j restants` : "expiré"}
                        </span>
                      </TD>
                      <TD>
                        <Badge variant={meta.variant} size="sm">
                          {meta.label}
                        </Badge>
                      </TD>
                      <TD align="right">
                        <Link href={`/devis/${quote.id}`} className="inline-flex rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Cycle de vie d&apos;un devis</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Du brouillon au projet actif</p>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4">
                <span className="absolute top-1 bottom-1 left-[11px] w-px bg-line" aria-hidden />
                {[
                  { label: "Brouillon", detail: "Chiffrage au déboursé sec", done: true },
                  { label: "Validation interne", detail: "Selon montant et marge", done: true },
                  { label: "Envoi au client", detail: "PDF à l'image de l'entreprise", done: true },
                  { label: "Signature électronique", detail: "Horodatage et code OTP", done: false },
                  { label: "Conversion en projet", detail: "Lots, budget et échéancier générés", done: false },
                ].map((step) => (
                  <li key={step.label} className="relative flex gap-3">
                    <span
                      className={cn(
                        "relative z-10 mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full ring-4 ring-surface",
                        step.done ? "bg-ok-500 text-white" : "bg-ink-100 text-ink-400",
                      )}
                    >
                      {step.done ? <CheckCircle2 className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-ink-900">{step.label}</span>
                      <span className="block text-[12px] text-ink-500">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Devis à relancer</CardTitle>
              <Send className="size-4 text-ink-400" />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {sent.map((quote) => {
                const owner = people.find((p) => p.id === quote.ownerId);
                return (
                  <div key={quote.id} className="rounded-lg border border-line p-3">
                    <p className="truncate text-[13px] font-medium text-ink-900">{quote.projectName}</p>
                    <p className="tnum mt-0.5 text-[12px] text-ink-500">
                      {formatMoneyCompact(quote.amountHT)} · {owner?.name}
                    </p>
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-ink-400">
                        <span>Probabilité de signature</span>
                        <span className="tnum font-medium text-ink-700">{quote.probability} %</span>
                      </div>
                      <Progress value={quote.probability} size="xs" />
                    </div>
                    <Button size="xs" variant="secondary" className="mt-2.5 w-full">
                      Relancer le client
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
