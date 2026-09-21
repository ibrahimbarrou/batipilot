import type { Metadata } from "next";
import { CheckCircle2, CreditCard, Download, Receipt, Smartphone } from "lucide-react";
import { Badge, invoiceStatusMeta } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow, Progress } from "@/components/ui/data-display";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { invoices, projectById } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, relativeFromToday } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mes paiements",
  description: "Situations de travaux, factures, reçus et paiement en ligne.",
};

export default function PortalPaymentsPage() {
  const project = projectById("p-03")!;
  const clientInvoices = invoices.filter((i) => i.projectId === project.id);
  const due = clientInvoices.find((i) => i.status === "sent");
  const paidTotal = project.collected;
  const progress = Math.round((paidTotal / project.contractAmount) * 100);

  return (
    <>
      <div className="mb-6">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] text-brand-600 uppercase">Paiements</p>
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.03em] text-ink-900">
          Vos situations et règlements
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] text-ink-500">
          Chaque situation correspond à des travaux réellement exécutés et photographiés. Réglez en ligne par mobile
          money ou par carte, votre reçu est disponible immédiatement.
        </p>
      </div>

      {/* Échéance en cours */}
      {due ? (
        <Card className="mb-5 border-signal-200 bg-signal-50/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 pt-5">
            <div className="min-w-0">
              <Badge variant="signal" dot>
                Échéance en cours
              </Badge>
              <p className="mt-2 text-[15px] font-semibold text-ink-900">{due.label}</p>
              <p className="tnum mt-0.5 text-[13px] text-ink-500">
                {due.number} · à régler avant le {formatDate(due.dueDate, "long")} ({relativeFromToday(due.dueDate)})
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-right">
                <p className="text-[12px] text-ink-500">Montant dû</p>
                <p className="tnum text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink-900">
                  {formatMoney(due.amount)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="signal" size="lg">
                  <Smartphone />
                  Payer par mobile money
                </Button>
                <Button variant="secondary" size="sm">
                  <CreditCard />
                  Payer par carte bancaire
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Historique de facturation</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Toutes vos situations depuis le démarrage</p>
              </div>
              <Button variant="secondary" size="xs">
                <Download />
                Relevé complet
              </Button>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <TableWrap className="rounded-none border-0 border-t border-line">
                <Table>
                  <THead>
                    <TR>
                      <TH>Situation</TH>
                      <TH align="right">Montant</TH>
                      <TH align="right">Réglé</TH>
                      <TH align="right">Échéance</TH>
                      <TH>Statut</TH>
                      <TH align="right"></TH>
                    </TR>
                  </THead>
                  <TBody>
                    {clientInvoices.map((invoice) => {
                      const meta = invoiceStatusMeta[invoice.status];
                      return (
                        <TR key={invoice.id}>
                          <TD>
                            <span className="block font-medium text-ink-900">{invoice.label}</span>
                            <span className="tnum block text-[11px] text-ink-400">{invoice.number}</span>
                          </TD>
                          <TD align="right" className="tnum font-medium text-ink-900">
                            {formatMoney(invoice.amount)}
                          </TD>
                          <TD align="right" className="tnum">
                            {invoice.paid > 0 ? formatMoney(invoice.paid) : "—"}
                          </TD>
                          <TD align="right" className="whitespace-nowrap">
                            {formatDate(invoice.dueDate, "short")}
                          </TD>
                          <TD>
                            <Badge variant={meta.variant} size="sm">
                              {meta.label}
                            </Badge>
                          </TD>
                          <TD align="right">
                            <Button variant="ghost" size="icon-xs">
                              <Receipt />
                            </Button>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </TableWrap>
            </CardContent>
          </Card>

          <Card className="mt-5">
            <CardHeader>
              <div>
                <CardTitle>Échéancier contractuel</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Paiements liés aux jalons du chantier</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3.5",
                    m.status === "done" ? "border-ok-100 bg-ok-50/40" : "border-line",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        m.status === "done" ? "bg-ok-500 text-white" : m.status === "current" ? "bg-brand-700 text-white" : "bg-ink-100 text-ink-400",
                      )}
                    >
                      {m.status === "done" ? <CheckCircle2 className="size-4" /> : <Receipt className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink-900">{m.label}</p>
                      <p className="text-[11px] text-ink-400">{formatDate(m.date, "long")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {m.amount ? (
                      <span className="tnum text-[14px] font-semibold text-ink-900">{formatMoney(m.amount)}</span>
                    ) : null}
                    <Badge variant={m.status === "done" ? "ok" : m.status === "current" ? "brand" : "neutral"} size="sm">
                      {m.status === "done" ? "Réglé" : m.status === "current" ? "En cours" : "À venir"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-line">
                <DataRow label="Montant du marché" value={formatMoneyCompact(project.contractAmount)} />
                <DataRow label="Facturé à ce jour" value={formatMoneyCompact(project.invoiced)} />
                <DataRow label="Déjà réglé" value={<span className="text-ok-600">{formatMoneyCompact(paidTotal)}</span>} />
                <DataRow
                  label="Reste à régler"
                  value={formatMoneyCompact(project.contractAmount - paidTotal)}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[12px] text-ink-500">
                  <span>Progression des règlements</span>
                  <span className="tnum font-medium text-ink-700">{progress} %</span>
                </div>
                <Progress value={progress} barClassName="bg-ok-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moyens de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { label: "Orange Money", detail: "Sans frais · confirmation immédiate" },
                { label: "MTN Mobile Money", detail: "Sans frais · confirmation immédiate" },
                { label: "Carte bancaire", detail: "Visa, Mastercard · frais 1,8 %" },
                { label: "Virement bancaire", detail: "Délai de 24 à 72 heures" },
              ].map((method) => (
                <div key={method.label} className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                    <Smartphone className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-900">{method.label}</p>
                    <p className="truncate text-[11px] text-ink-400">{method.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-ok-200 bg-ok-50/40">
            <CardContent className="pt-5">
              <p className="text-[13px] font-semibold text-ok-800">Pourquoi je paie cette situation ?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ok-700">
                Chaque situation est calculée sur l&apos;avancement réellement constaté sur le chantier, appuyé par les
                photos horodatées de la période. Vous ne payez que ce qui est fait.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
