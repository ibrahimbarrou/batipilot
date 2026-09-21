import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center">
      <div className="grid-blueprint absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(33,72,219,0.28), transparent 70%)" }}
      />

      <div className="relative">
        <Wordmark inverted size="md" tagline />

        <p className="tnum mt-12 text-[80px] leading-none font-semibold tracking-[-0.05em] text-white/10">404</p>
        <h1 className="-mt-8 text-[26px] font-semibold tracking-[-0.03em] text-white">Cette page n&apos;existe pas</h1>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/50">
          Le lien est peut-être obsolète, ou le projet a été archivé. Revenez au tableau de bord pour retrouver vos
          chantiers.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-ink-900 hover:bg-white/90">
            <Link href="/dashboard">
              <ArrowLeft />
              Tableau de bord
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="border border-white/15 text-white hover:bg-white/10">
            <Link href="/projets">
              <Compass />
              Voir les projets
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
