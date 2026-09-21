import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
        <footer className="border-t border-line px-4 py-4 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 text-[11px] text-ink-400">
            <span>PILOTIS · Construction OS — données de démonstration</span>
            <span className="flex items-center gap-4">
              <span>Groupe SOGEBAT · Offre Business</span>
              <span>FCFA · Français</span>
            </span>
          </div>
        </footer>
      </div>
      <CommandPalette />
    </div>
  );
}
