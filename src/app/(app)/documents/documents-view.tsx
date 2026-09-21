"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarClock,
  Download,
  FileText,
  FolderOpen,
  Grid2x2,
  List,
  Search,
  Share2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { documents, projects } from "@/data";
import { cn, daysBetween, formatDate, TODAY } from "@/lib/utils";

const CATEGORIES = ["Plans", "Contrats", "Rapports", "Factures", "Administratif", "PV"] as const;

const formatTone: Record<string, string> = {
  PDF: "bg-risk-50 text-risk-600",
  DWG: "bg-brand-50 text-brand-700",
  XLSX: "bg-ok-50 text-ok-700",
  DOCX: "bg-info-50 text-info-600",
  JPG: "bg-signal-50 text-signal-600",
};

export function DocumentsView() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [layout, setLayout] = React.useState<"list" | "grid">("list");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      if (category !== "all" && doc.category !== category) return false;
      if (!q) return true;
      return `${doc.name} ${doc.author} ${doc.category}`.toLowerCase().includes(q);
    });
  }, [query, category]);

  const expiring = documents.filter((d) => d.expiresAt && daysBetween(TODAY, d.expiresAt) < 120);

  return (
    <>
      <PageHeader
        eyebrow="Gestion documentaire"
        title="Centre documentaire"
        description="Plans indicés, contrats, rapports, PV et pièces administratives — une arborescence par projet, des droits de partage explicites et des alertes d'échéance."
        meta={
          <>
            <Badge variant="brand">{documents.length} documents</Badge>
            <Badge variant="warn" dot>
              {expiring.length} pièces à renouveler
            </Badge>
            <Badge variant="neutral">Partage par lien à durée limitée</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Share2 />
              Partager un dossier
            </Button>
            <Button>
              <Upload />
              Déposer un document
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <Toolbar
            right={
              <div className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-ink-50 p-1">
                <button
                  onClick={() => setLayout("list")}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    layout === "list" ? "bg-white text-ink-900 shadow-xs" : "text-ink-400 hover:text-ink-700",
                  )}
                >
                  <List className="size-4" />
                </button>
                <button
                  onClick={() => setLayout("grid")}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    layout === "grid" ? "bg-white text-ink-900 shadow-xs" : "text-ink-400 hover:text-ink-700",
                  )}
                >
                  <Grid2x2 className="size-4" />
                </button>
              </div>
            }
          >
            <div className="w-full sm:w-72">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un document…" icon={<Search />} />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[11rem]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar>

          {layout === "list" ? (
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH>Document</TH>
                    <TH>Projet</TH>
                    <TH>Catégorie</TH>
                    <TH>Version</TH>
                    <TH>Partage</TH>
                    <TH align="right">Mise à jour</TH>
                    <TH align="right"></TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((doc) => {
                    const project = projects.find((p) => p.id === doc.projectId);
                    return (
                      <TR key={doc.id} interactive>
                        <TD>
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                                formatTone[doc.format],
                              )}
                            >
                              {doc.format}
                            </span>
                            <span className="min-w-0">
                              <span className="block max-w-sm truncate font-medium text-ink-900">{doc.name}</span>
                              <span className="block text-[11px] text-ink-400">
                                {doc.size} · {doc.author}
                              </span>
                            </span>
                          </span>
                        </TD>
                        <TD>
                          {project ? (
                            <Link href={`/projets/${project.id}`} className="text-brand-700 hover:underline">
                              {project.code}
                            </Link>
                          ) : (
                            <span className="text-ink-400">Entreprise</span>
                          )}
                        </TD>
                        <TD>
                          <Badge variant="neutral" size="sm">
                            {doc.category}
                          </Badge>
                        </TD>
                        <TD className="tnum">{doc.version}</TD>
                        <TD>
                          <span className="flex gap-1">
                            {doc.shared.map((s) => (
                              <Badge key={s} variant={s === "Client" ? "brand" : "outline"} size="sm">
                                {s}
                              </Badge>
                            ))}
                          </span>
                        </TD>
                        <TD align="right" className="whitespace-nowrap">
                          {formatDate(doc.updatedAt, "short")}
                        </TD>
                        <TD align="right">
                          <Button variant="ghost" size="icon-xs">
                            <Download />
                          </Button>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </TableWrap>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((doc) => {
                const project = projects.find((p) => p.id === doc.projectId);
                return (
                  <Card key={doc.id} interactive className="overflow-hidden">
                    <div className="flex h-24 items-center justify-center border-b border-line bg-surface-2">
                      <span className={cn("flex size-12 items-center justify-center rounded-xl text-xs font-bold", formatTone[doc.format])}>
                        {doc.format}
                      </span>
                    </div>
                    <CardContent className="pt-3">
                      <p className="line-clamp-2 text-[13px] leading-snug font-medium text-ink-900">{doc.name}</p>
                      <p className="mt-1 truncate text-[11px] text-ink-400">
                        {project?.code ?? "Entreprise"} · {doc.version}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-ink-400">{doc.size}</span>
                        <span className="text-[11px] text-ink-400">{formatDate(doc.updatedAt, "short")}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Arborescence</CardTitle>
              <FolderOpen className="size-4 text-ink-400" />
            </CardHeader>
            <CardContent className="space-y-1">
              {CATEGORIES.map((cat) => {
                const count = documents.filter((d) => d.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                      category === cat ? "bg-brand-50 text-brand-800" : "hover:bg-ink-50",
                    )}
                  >
                    <FileText className={cn("size-4", category === cat ? "text-brand-600" : "text-ink-400")} />
                    <span className="flex-1 text-[13px] font-medium">{cat}</span>
                    <span className="tnum text-[11px] text-ink-400">{count}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setCategory("all")}
                className="mt-1 w-full rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-brand-700 hover:bg-ink-50"
              >
                Tout afficher
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Échéances administratives</CardTitle>
              <CalendarClock className="size-4 text-warn-500" />
            </CardHeader>
            <CardContent className="space-y-2.5">
              {expiring.map((doc) => {
                const days = daysBetween(TODAY, doc.expiresAt!);
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "rounded-lg border p-3",
                      days < 30 ? "border-risk-100 bg-risk-50/50" : "border-warn-100 bg-warn-50/50",
                    )}
                  >
                    <p className="text-[13px] font-medium text-ink-900">{doc.name}</p>
                    <p className="mt-0.5 text-[12px] text-ink-500">
                      Expire le {formatDate(doc.expiresAt!)} — dans {days} jours
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité documentaire</CardTitle>
              <ShieldCheck className="size-4 text-ok-600" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[12px] leading-relaxed text-ink-500">
                <li>URLs signées à durée limitée sur tous les téléchargements</li>
                <li>Analyse antivirus systématique des fichiers déposés</li>
                <li>Indices de révision : le plan en vigueur est mis en évidence</li>
                <li>Journal immuable des consultations et partages</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
