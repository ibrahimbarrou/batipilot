"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Copy,
  Download,
  History,
  Mail,
  Printer,
  Send,
  ShieldCheck,
  Signature,
} from "lucide-react";
import { Badge, quoteStatusMeta, typeMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow } from "@/components/ui/data-display";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay";
import { clients, people } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, formatNumber, formatPercent, margin } from "@/lib/utils";
import type { Quote } from "@/types";

export function QuoteDetail({ quote }: { quote: Quote }) {
  const client = clients.find((c) => c.id === quote.clientId);
  const owner = people.find((p) => p.id === quote.ownerId);
  const meta = quoteStatusMeta[quote.status];
  const m = margin(quote.amountHT, quote.costPrice);
  const vatAmount = (quote.amountHT * quote.vat) / 100;

  return (
    <>
      <Link
        href="/devis"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-800"
      >
        <ArrowLeft className="size-4" />
        Tous les devis
      </Link>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* ------------------------ Document ----------------------- */}
        <div className="xl:col-span-8">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                  <Badge variant="outline">{typeMeta[quote.type]}</Badge>
                  <span className="tnum text-[12px] text-ink-400">version {quote.version}</span>
                </div>
                <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.025em] text-ink-900">
                  {quote.projectName}
                </h1>
                <p className="tnum mt-1 text-[13px] text-ink-500">
                  {quote.number} · émis le {formatDate(quote.createdAt)} · valable jusqu&apos;au{" "}
                  {formatDate(quote.validUntil)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Printer />
                  Imprimer
                </Button>
                <Button variant="secondary" size="sm">
                  <Download />
                  PDF
                </Button>
              </div>
            </div>

            <CardContent className="px-0 pb-0">
              {/* Entêtes émetteur / destinataire */}
              <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
                <div className="bg-surface px-6 py-4">
                  <p className="text-[11px] font-semibold tracking-wide text-ink-400 uppercase">Émetteur</p>
                  <p className="mt-1.5 text-[14px] font-semibold text-ink-900">SOGEBAT Construction SARL</p>
                  <p className="text-[12px] leading-relaxed text-ink-500">
                    Zone industrielle de Bassa, Douala — Cameroun
                    <br />
                    RC/DLA/2011/B/4182 · NIU M071100042817R
                  </p>
                </div>
                <div className="bg-surface px-6 py-4">
                  <p className="text-[11px] font-semibold tracking-wide text-ink-400 uppercase">Destinataire</p>
                  <p className="mt-1.5 text-[14px] font-semibold text-ink-900">{client?.name}</p>
                  <p className="text-[12px] leading-relaxed text-ink-500">
                    {client?.contact}
                    <br />
                    {client?.city}, {client?.country} · {client?.phone}
                  </p>
                </div>
              </div>

              {/* Lignes */}
              <TableWrap className="rounded-none border-0 border-t border-line">
                <Table>
                  <THead>
                    <TR>
                      <TH>Lot</TH>
                      <TH>Désignation</TH>
                      <TH align="right">Qté</TH>
                      <TH align="right">Unité</TH>
                      <TH align="right">P.U. HT</TH>
                      <TH align="right">Total HT</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {quote.lines.map((line) => (
                      <TR key={line.id}>
                        <TD>
                          <Badge variant="neutral" size="sm">
                            {line.lot}
                          </Badge>
                        </TD>
                        <TD className="font-medium text-ink-900">{line.designation}</TD>
                        <TD align="right" className="tnum">{formatNumber(line.qty)}</TD>
                        <TD align="right">{line.unit}</TD>
                        <TD align="right" className="tnum">{formatMoney(line.unitPrice)}</TD>
                        <TD align="right" className="tnum font-medium text-ink-900">
                          {formatMoney(line.qty * line.unitPrice)}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrap>

              {/* Totaux */}
              <div className="flex justify-end border-t border-line px-6 py-4">
                <div className="w-full max-w-xs divide-y divide-line">
                  <DataRow label="Total HT" value={formatMoney(quote.amountHT)} />
                  <DataRow label={`TVA ${formatPercent(quote.vat, 2)}`} value={formatMoney(vatAmount)} />
                  <div className="flex items-baseline justify-between gap-4 pt-3">
                    <span className="text-[14px] font-semibold text-ink-900">Total TTC</span>
                    <span className="tnum text-[18px] font-semibold tracking-[-0.02em] text-brand-800">
                      {formatMoney(quote.amountHT + vatAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-line bg-surface-2 px-6 py-4">
                <p className="text-[12px] leading-relaxed text-ink-500">
                  Devis valable 30 jours. Acompte de 30 % à la signature, situations mensuelles selon avancement.
                  Retenue de garantie de 5 % libérée à la levée des réserves. Mentions légales conformes à la
                  réglementation en vigueur au Cameroun.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ------------------------- Latéral ----------------------- */}
        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de marge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-line">
                <DataRow label="Prix de vente HT" value={formatMoneyCompact(quote.amountHT)} />
                <DataRow label="Déboursé sec" value={formatMoneyCompact(quote.costPrice)} />
                <DataRow label="Marge brute" value={formatMoneyCompact(quote.amountHT - quote.costPrice)} />
                <DataRow
                  label="Taux de marge"
                  value={
                    <span className={cn(m >= 22 ? "text-ok-600" : m >= 18 ? "text-ink-900" : "text-warn-600")}>
                      {formatPercent(m, 1)}
                    </span>
                  }
                />
                <DataRow label="Coefficient de vente" value={(quote.amountHT / quote.costPrice).toFixed(2)} />
              </div>
              <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2.5 text-[12px] leading-relaxed text-ink-500">
                Seuil de validation interne : marge inférieure à 18 % ou montant supérieur à 250 M FCFA.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suivi commercial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar initials={owner?.initials ?? "??"} tone={owner?.avatarTone} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink-900">{owner?.name}</p>
                  <p className="truncate text-[12px] text-ink-400">{owner?.role}</p>
                </div>
              </div>
              <div className="mt-3 divide-y divide-line border-t border-line">
                <DataRow label="Probabilité" value={`${quote.probability} %`} />
                <DataRow label="Ville" value={quote.city} />
                <DataRow label="Version" value={`v${quote.version}`} />
              </div>
              <div className="mt-3 space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Signature />
                      Envoyer pour signature
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="sm">
                    <DialogHeader>
                      <DialogTitle>Envoyer pour signature électronique</DialogTitle>
                      <DialogDescription>
                        Le client recevra un lien sécurisé et un code OTP par SMS. La signature est horodatée et
                        accompagnée d&apos;un certificat de preuve.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogBody className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg border border-line p-3">
                        <Avatar initials={client?.name.slice(0, 2).toUpperCase() ?? "CL"} tone={client?.tone} size="md" />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink-900">{client?.contact}</p>
                          <p className="truncate text-[12px] text-ink-400">{client?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 rounded-lg bg-ok-50 p-3 text-[12px] leading-relaxed text-ok-700">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                        Le document sera verrouillé après signature et archivé dans la GED du projet.
                      </div>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="secondary">Annuler</Button>
                      <Button>
                        <Send />
                        Envoyer maintenant
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="secondary" className="w-full">
                  <Mail />
                  Envoyer par e-mail
                </Button>
                <Button variant="ghost" className="w-full">
                  <Copy />
                  Dupliquer en nouvelle version
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des versions</CardTitle>
              <History className="size-4 text-ink-400" />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {Array.from({ length: quote.version }).map((_, i) => {
                const version = quote.version - i;
                return (
                  <div key={version} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                    <div>
                      <p className="text-[13px] font-medium text-ink-900">Version {version}</p>
                      <p className="text-[11px] text-ink-400">
                        {version === quote.version ? "version courante" : "remise commerciale ajustée"}
                      </p>
                    </div>
                    <span className="tnum text-[12px] text-ink-500">
                      {formatMoneyCompact(quote.amountHT * (1 + i * 0.04))}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {quote.status === "signed" ? (
            <Card className="border-ok-200 bg-ok-50/50">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ok-500 text-white">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ok-800">Devis signé</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ok-700">
                      Convertissez ce devis en projet : les lots, le budget et l&apos;échéancier seront générés
                      automatiquement.
                    </p>
                    <Button size="sm" className="mt-3 bg-ok-600 hover:bg-ok-700">
                      Créer le projet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
