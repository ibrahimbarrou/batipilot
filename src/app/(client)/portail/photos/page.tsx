import type { Metadata } from "next";
import { Camera, Download, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectById, sitePhotos } from "@/data";
import { cn, formatDate } from "@/lib/utils";
import { PhotoScene } from "@/components/shared/photo-tile";

export const metadata: Metadata = {
  title: "Photos du chantier",
  description: "Galerie de photos horodatées et géolocalisées de votre chantier.",
};

const COMPARISON = [
  { label: "Juillet 2026", caption: "Fin du gros œuvre", tone: "from-ink-500 to-ink-700" },
  { label: "Septembre 2026", caption: "Second œuvre en cours", tone: "from-brand-600 to-brand-900" },
];

export default function PortalPhotosPage() {
  const project = projectById("p-03")!;
  const photos = sitePhotos.filter((p) => p.projectId === project.id);
  const others = sitePhotos.filter((p) => p.projectId !== project.id).slice(0, 6);
  const gallery = [...photos, ...others];

  const byPhase = gallery.reduce<Record<string, typeof gallery>>((acc, photo) => {
    (acc[photo.phase] ||= []).push(photo);
    return acc;
  }, {});

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] text-brand-600 uppercase">Galerie</p>
          <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.03em] text-ink-900">
            Photos de votre chantier
          </h1>
          <p className="mt-1.5 max-w-2xl text-[14px] text-ink-500">
            Chaque prise de vue est horodatée, géolocalisée et scellée : c&apos;est la preuve de ce qui a réellement été
            fait sur votre terrain.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="ok" dot>
              {gallery.length} photos publiées
            </Badge>
            <Badge variant="neutral">Mise à jour quotidienne</Badge>
          </div>
        </div>
        <Button variant="secondary">
          <Download />
          Télécharger l&apos;album
        </Button>
      </div>

      {/* Comparateur avant / après */}
      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Comparateur avant / après</CardTitle>
            <p className="mt-0.5 text-[13px] text-ink-500">Même angle de vue, deux mois d&apos;écart</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COMPARISON.map((item) => (
            <figure key={item.label} className="overflow-hidden rounded-xl border border-line">
              <div className="relative h-52 sm:h-64">
                <PhotoScene id={item.label} tone={item.tone} className="absolute inset-0" />
                <span className="absolute top-3 left-3 rounded-md bg-black/45 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
                  {item.label}
                </span>
              </div>
              <figcaption className="px-4 py-3">
                <p className="text-[13px] font-medium text-ink-900">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </CardContent>
      </Card>

      {/* Galerie par phase */}
      {Object.entries(byPhase).map(([phase, items]) => (
        <section key={phase} className="mb-7">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-ink-900">{phase}</h2>
            <span className="tnum rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-500">
              {items.length}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((photo) => (
              <figure
                key={photo.id}
                className="group overflow-hidden rounded-xl border border-line bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-44">
                  <PhotoScene id={photo.id} tone={photo.tone} className="absolute inset-0" />
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                    <ShieldCheck className="size-3" />
                    certifiée
                  </span>
                  <span className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
                      <MapPin className="size-2.5" />
                      GPS
                    </span>
                    <span className="rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      {formatDate(photo.date, "short")}
                    </span>
                  </span>
                </div>
                <figcaption className="p-3">
                  <p className="truncate text-[13px] font-medium text-ink-900">{photo.label}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-ink-400">
                    <Camera className="size-3" />
                    {photo.author}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
