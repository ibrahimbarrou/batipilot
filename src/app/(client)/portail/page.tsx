import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  Images,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow, Progress, ProgressRing } from "@/components/ui/data-display";
import { clientById, invoices, people, projectById, sitePhotos, siteReports } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, relativeFromToday } from "@/lib/utils";
import { PhotoScene } from "@/components/shared/photo-tile";

export const metadata: Metadata = {
  title: "Mon chantier",
  description: "Suivez l'avancement de votre chantier, vos photos, vos documents et vos paiements.",
};

export default function PortalHome() {
  const project = projectById("p-03")!;
  const client = clientById("c-03")!;
  const manager = people.find((p) => p.id === project.managerId);
  const photos = sitePhotos.filter((p) => p.projectId === project.id);
  const reports = siteReports.filter((r) => r.projectId === project.id);
  const clientInvoices = invoices.filter((i) => i.projectId === project.id);
  const nextMilestone = project.milestones.find((m) => m.status === "current") ?? project.milestones[0];
  const paid = project.collected;
  const remaining = project.contractAmount - paid;

  return (
    <>
      {/* ---------------------- Bandeau ---------------------- */}
      <section className="relative mb-6 overflow-hidden rounded-2xl border border-brand-900/40 bg-ink-950 text-white shadow-lg">
        <div className="grid-blueprint pointer-events-none absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-28 -right-16 size-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,111,26,0.24), transparent 70%)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-8 p-7 lg:p-9">
          <div className="min-w-0">
            <Badge variant="dark" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="size-3 text-signal-400" />
              Chantier certifié
            </Badge>
            <h1 className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.03em]">{project.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-white/55">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {project.address}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="size-3.5" />
                Livraison prévue le {formatDate(project.forecastEndDate, "long")}
              </span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="md" className="bg-white text-ink-900 hover:bg-white/90" asChild>
                <Link href="/portail/photos">
                  <Images />
                  Voir les dernières photos
                </Link>
              </Button>
              <Button size="md" variant="ghost" className="border border-white/15 text-white hover:bg-white/10" asChild>
                <Link href="/portail/messages">
                  <MessageSquare />
                  Poser une question
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ProgressRing value={project.progress} size={132} stroke={10} trackClass="text-white/10" barClass="text-signal-400">
              <span className="tnum text-[30px] leading-none font-semibold tracking-[-0.03em]">{project.progress}%</span>
              <span className="mt-1 text-[11px] text-white/45">réalisé</span>
            </ProgressRing>
            <div className="hidden space-y-3 sm:block">
              <HeroStat label="Montant du marché" value={formatMoneyCompact(project.contractAmount)} />
              <HeroStat label="Déjà réglé" value={formatMoneyCompact(paid)} />
              <HeroStat label="Reste à régler" value={formatMoneyCompact(remaining)} accent />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* --------------------- Colonne principale -------------------- */}
        <div className="space-y-5 lg:col-span-8">
          {/* Avancement par phase */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Où en est votre chantier</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Avancement réel, phase par phase</p>
              </div>
              <Badge variant="ok" dot>
                Dans les temps
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.lots.map((lot) => (
                <div key={lot.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-ink-800">{lot.name}</span>
                    <span className="tnum text-[13px] font-semibold text-ink-900">{lot.progress} %</span>
                  </div>
                  <Progress
                    value={lot.progress}
                    barClassName={lot.progress === 100 ? "bg-ok-500" : lot.progress > 0 ? "bg-brand-700" : "bg-ink-200"}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dernières photos */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Dernières photos du chantier</CardTitle>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-500">
                  <ShieldCheck className="size-3.5 text-ok-600" />
                  Horodatées, géolocalisées et infalsifiables
                </p>
              </div>
              <Button variant="ghost" size="xs" asChild>
                <Link href="/portail/photos">
                  Toute la galerie
                  <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo) => (
                <figure key={photo.id} className="group overflow-hidden rounded-xl border border-line">
                  <div className="relative h-32">
                    <PhotoScene id={photo.id} tone={photo.tone} className="absolute inset-0" />
                    <span className="absolute right-2 bottom-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      {formatDate(photo.date, "short")}
                    </span>
                  </div>
                  <figcaption className="px-3 py-2">
                    <p className="truncate text-[12px] font-medium text-ink-800">{photo.label}</p>
                    <p className="truncate text-[11px] text-ink-400">{photo.phase}</p>
                  </figcaption>
                </figure>
              ))}
            </CardContent>
          </Card>

          {/* Rapport hebdomadaire */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Rapport de la semaine</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">Publié par {manager?.name} · semaine 38</p>
              </div>
              <Button variant="secondary" size="xs">
                <Download />
                PDF
              </Button>
            </CardHeader>
            <CardContent>
              {reports.slice(0, 1).map((report) => (
                <div key={report.id}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <PortalStat label="Jours travaillés" value="6" />
                    <PortalStat label="Personnes sur site" value={`${report.headcount}`} />
                    <PortalStat label="Photos ajoutées" value={`${report.photos}`} />
                    <PortalStat label="Avancement gagné" value={`+${report.progressDelta} pt`} accent />
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-semibold tracking-wide text-ink-400 uppercase">
                      Travaux réalisés
                    </p>
                    <ul className="space-y-1.5">
                      {report.tasksDone.map((task) => (
                        <li key={task} className="flex items-start gap-2 text-[13px] text-ink-700">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok-500" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-4 rounded-lg border-l-2 border-brand-500 bg-brand-50/50 px-4 py-3 text-[13px] leading-relaxed text-ink-700">
                    {report.observations}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ------------------------- Latéral ------------------------- */}
        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Prochaine étape</CardTitle>
              <Clock className="size-4 text-ink-400" />
            </CardHeader>
            <CardContent>
              <p className="text-[15px] font-semibold text-ink-900">{nextMilestone.label}</p>
              <p className="mt-1 text-[13px] text-ink-500">
                {formatDate(nextMilestone.date, "long")} · {relativeFromToday(nextMilestone.date)}
              </p>
              {nextMilestone.amount ? (
                <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2.5">
                  <p className="text-[12px] text-ink-500">Montant de l&apos;échéance</p>
                  <p className="tnum text-[16px] font-semibold text-ink-900">{formatMoney(nextMilestone.amount)}</p>
                </div>
              ) : null}

              <div className="mt-4 space-y-3 border-t border-line pt-4">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1 size-2.5 shrink-0 rounded-full",
                        m.status === "done" ? "bg-ok-500" : m.status === "current" ? "bg-brand-600" : "bg-ink-200",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[13px]",
                          m.status === "done" ? "text-ink-400 line-through" : "font-medium text-ink-800",
                        )}
                      >
                        {m.label}
                      </span>
                      <span className="block text-[11px] text-ink-400">{formatDate(m.date)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Votre interlocuteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar initials={manager?.initials ?? "CF"} tone={manager?.avatarTone} size="xl" />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink-900">{manager?.name}</p>
                  <p className="truncate text-[12px] text-ink-400">Chef de projet</p>
                  <p className="tnum mt-1 truncate text-[12px] text-ink-500">{manager?.phone}</p>
                </div>
              </div>
              <Button className="mt-4 w-full" asChild>
                <Link href="/portail/messages">
                  <MessageSquare />
                  Envoyer un message
                </Link>
              </Button>
              <p className="mt-2 text-center text-[11px] text-ink-400">Réponse sous 4 heures ouvrées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Votre situation financière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-line">
                <DataRow label="Montant du marché" value={formatMoneyCompact(project.contractAmount)} />
                <DataRow label="Facturé à ce jour" value={formatMoneyCompact(project.invoiced)} />
                <DataRow label="Déjà réglé" value={<span className="text-ok-600">{formatMoneyCompact(paid)}</span>} />
                <DataRow label="Reste à régler" value={formatMoneyCompact(remaining)} />
              </div>
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-[12px] text-ink-500">
                  <span>Progression des règlements</span>
                  <span className="tnum font-medium text-ink-700">
                    {Math.round((paid / project.contractAmount) * 100)} %
                  </span>
                </div>
                <Progress value={(paid / project.contractAmount) * 100} barClassName="bg-ok-500" />
              </div>
              {clientInvoices.some((i) => i.status === "sent") ? (
                <Button variant="signal" className="mt-4 w-full" asChild>
                  <Link href="/portail/paiements">Régler la situation en cours</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-ok-200 bg-ok-50/40">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ok-500 text-white">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ok-800">Chantier certifié</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ok-700">
                    Chaque photo publiée porte une empreinte cryptographique, sa date et sa position GPS. Vous voyez
                    exactement ce qui se passe sur votre terrain, où que vous soyez.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function HeroStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{label}</p>
      <p className={cn("tnum text-[16px] font-semibold", accent ? "text-signal-400" : "text-white")}>{value}</p>
    </div>
  );
}

function PortalStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-lg px-3 py-2.5", accent ? "bg-brand-50" : "bg-ink-50")}>
      <p className="text-[11px] text-ink-400">{label}</p>
      <p className={cn("tnum text-[16px] font-semibold", accent ? "text-brand-800" : "text-ink-900")}>{value}</p>
    </div>
  );
}
