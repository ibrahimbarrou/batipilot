import type { Metadata } from "next";
import { Download, FileText, Lock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { documents, projectById } from "@/data";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mes documents",
  description: "Plans, contrats, rapports et procès-verbaux de votre chantier.",
};

const formatTone: Record<string, string> = {
  PDF: "bg-risk-50 text-risk-600",
  DWG: "bg-brand-50 text-brand-700",
  XLSX: "bg-ok-50 text-ok-700",
  DOCX: "bg-info-50 text-info-600",
  JPG: "bg-signal-50 text-signal-600",
};

export default function PortalDocumentsPage() {
  const project = projectById("p-03")!;
  const shared = documents.filter((d) => d.shared.includes("Client"));
  const mine = shared.filter((d) => d.projectId === project.id);
  const others = shared.filter((d) => d.projectId !== project.id);

  return (
    <>
      <div className="mb-6">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] text-brand-600 uppercase">Documents</p>
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.03em] text-ink-900">
          Vos documents contractuels
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] text-ink-500">
          Plans, contrat de travaux, rapports hebdomadaires et procès-verbaux — accessibles à tout moment, téléchargeables
          en un clic.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="brand">{shared.length} documents partagés</Badge>
          <Badge variant="ok" dot>
            Liens sécurisés à durée limitée
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Documents de votre chantier</CardTitle>
                <p className="tnum mt-0.5 text-[13px] text-ink-500">{project.code}</p>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <TableWrap className="rounded-none border-0 border-t border-line">
                <Table>
                  <THead>
                    <TR>
                      <TH>Document</TH>
                      <TH>Catégorie</TH>
                      <TH align="right">Mise à jour</TH>
                      <TH align="right"></TH>
                    </TR>
                  </THead>
                  <TBody>
                    {mine.map((doc) => (
                      <TR key={doc.id} interactive>
                        <TD>
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex size-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                                formatTone[doc.format],
                              )}
                            >
                              {doc.format}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-ink-900">{doc.name}</span>
                              <span className="block text-[11px] text-ink-400">
                                {doc.size} · version {doc.version}
                              </span>
                            </span>
                          </span>
                        </TD>
                        <TD>
                          <Badge variant="neutral" size="sm">
                            {doc.category}
                          </Badge>
                        </TD>
                        <TD align="right" className="whitespace-nowrap">
                          {formatDate(doc.updatedAt, "short")}
                        </TD>
                        <TD align="right">
                          <Button variant="secondary" size="xs">
                            <Download />
                            Télécharger
                          </Button>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrap>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Autres documents partagés</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Pièces administratives de l&apos;entreprise</p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {others.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-ink-50/60"
                >
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold", formatTone[doc.format])}>
                    {doc.format}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink-900">{doc.name}</span>
                    <span className="block text-[11px] text-ink-400">{formatDate(doc.updatedAt, "short")}</span>
                  </span>
                  <Button variant="ghost" size="icon-xs">
                    <Download />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Accès et confidentialité</CardTitle>
              <ShieldCheck className="size-4 text-ok-600" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[13px] leading-relaxed text-ink-600">
                <li className="flex gap-2.5">
                  <Lock className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  Vos documents ne sont visibles que par vous et l&apos;équipe projet.
                </li>
                <li className="flex gap-2.5">
                  <FileText className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  Chaque plan porte un indice de révision : vous consultez toujours la version en vigueur.
                </li>
                <li className="flex gap-2.5">
                  <Download className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  Les liens de téléchargement expirent automatiquement après 7 jours.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-brand-200 bg-brand-50/50">
            <CardContent className="pt-5">
              <p className="text-[13px] font-semibold text-brand-900">Besoin d&apos;un document absent ?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-800/80">
                Demandez-le directement à votre chef de projet depuis la messagerie : il sera ajouté ici dès validation.
              </p>
              <Button size="sm" className="mt-3">
                Faire une demande
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
