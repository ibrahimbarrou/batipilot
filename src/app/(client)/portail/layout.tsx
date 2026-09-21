import Link from "next/link";
import { ArrowLeft, Bell, HelpCircle, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/data-display";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";
import { PortalNav } from "./portal-nav";
import { clientById } from "@/data/clients";
import { company } from "@/data";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const client = clientById("c-03");

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* En-tête marque blanche : l'entreprise BTP, pas PILOTIS */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 lg:px-6">
          <Link href="/portail" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-800 text-[13px] font-bold text-white">
              SG
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink-900">{company.name}</span>
              <span className="mt-0.5 text-[11px] text-ink-400">Espace client</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Aide">
              <HelpCircle />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
              <Bell />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-risk-500" />
            </Button>
            <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
            <div className="flex items-center gap-2.5">
              <Avatar initials="VT" tone="bg-signal-500" size="md" />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-[13px] font-medium text-ink-900">{client?.contact}</span>
                <span className="text-[11px] text-ink-400">{client?.city}</span>
              </span>
            </div>
          </div>
        </div>

        <PortalNav />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">{children}</main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-800 text-[11px] font-bold text-white">
              SG
            </span>
            <div>
              <p className="text-[13px] font-medium text-ink-800">{company.legal}</p>
              <p className="text-[11px] text-ink-400">
                {company.hq} · {company.rccm}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:+237699410218" className="flex items-center gap-1.5 text-[13px] text-ink-600 hover:text-ink-900">
              <Phone className="size-3.5" />
              +237 699 41 02 18
            </a>
            <span className="flex items-center gap-1.5 text-[11px] text-ink-400">
              <LogoMark size={16} />
              Propulsé par PILOTIS
            </span>
          </div>
        </div>
      </footer>

      <Link
        href="/dashboard"
        className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[12px] font-medium text-ink-600 shadow-lg transition-all hover:-translate-y-0.5 hover:text-ink-900 lg:inline-flex"
      >
        <ArrowLeft className="size-3.5" />
        Retour à l&apos;espace entreprise
      </Link>
    </div>
  );
}
