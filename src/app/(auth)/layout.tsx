import Link from "next/link";
import { CheckCircle2, Quote } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";

const proofs = [
  "Rapport de chantier saisi en moins de 5 minutes, même sans réseau",
  "Budget engagé / réalisé mis à jour à chaque bon de commande",
  "Portail client : photos horodatées, situations et paiements",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-canvas">
      {/* Panneau de marque */}
      <div className="relative hidden w-[46%] shrink-0 overflow-hidden bg-ink-950 lg:flex lg:flex-col xl:w-[42%]">
        <div className="grid-blueprint absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-32 -left-24 size-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(33,72,219,0.35), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -right-20 -bottom-24 size-[360px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,111,26,0.22), transparent 70%)" }}
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
          <Link href="/">
            <Wordmark inverted size="md" tagline />
          </Link>

          <div className="max-w-md">
            <h2 className="text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-white">
              Le terrain, le bureau et le client sur une seule plateforme.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/55">
              PILOTIS relie chaque rapport de chantier à votre budget, votre trésorerie et votre client — sans
              ressaisie, même hors ligne.
            </p>
            <ul className="mt-7 space-y-3">
              {proofs.map((proof) => (
                <li key={proof} className="flex items-start gap-3 text-[14px] text-white/75">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-signal-400" />
                  {proof}
                </li>
              ))}
            </ul>
          </div>

          <figure className="max-w-md rounded-xl border border-white/8 bg-white/[0.04] p-5 backdrop-blur">
            <Quote className="size-5 text-signal-400" />
            <blockquote className="mt-3 text-[14px] leading-relaxed text-white/75">
              « Avant, je découvrais un dépassement à la fin du chantier. Aujourd&apos;hui je le vois le jour où il
              arrive. »
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                AN
              </span>
              <span>
                <span className="block text-[13px] font-medium text-white">Armand Nkodo</span>
                <span className="block text-[12px] text-white/45">Directeur Général, Groupe SOGEBAT</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="lg:hidden">
            <Wordmark size="sm" />
          </Link>
          <span className="ml-auto text-[13px] text-ink-500">
            Pas encore de compte ?{" "}
            <Link href="/login" className="font-medium text-brand-700 hover:underline">
              Demander une démo
            </Link>
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
