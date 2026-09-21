"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ExternalLink, Sparkles } from "lucide-react";
import { navigation } from "@/lib/nav";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LogoMark, Wordmark } from "@/components/brand/logo";
import { Hint } from "@/components/ui/overlay";
import { company, portfolio } from "@/data";

const badgeCounts = {
  alerts: 3,
  messages: 5,
  validations: 2,
};

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useSession((s) => s.sidebarCollapsed);
  const toggle = useSession((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-ink-900/60 bg-ink-950 transition-[width] duration-300 ease-[var(--ease-out-quint)] lg:flex",
        collapsed ? "w-[72px]" : "w-[248px]",
      )}
    >
      {/* Marque */}
      <div className={cn("flex h-16 items-center border-b border-white/5", collapsed ? "justify-center px-3" : "px-5")}>
        <Link href="/dashboard" className="flex items-center transition-opacity hover:opacity-90">
          {collapsed ? <LogoMark size={30} /> : <Wordmark inverted size="md" tagline />}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="scrollbar-slim flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {!collapsed ? (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
                {group.label}
              </p>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-white/10" />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const count = item.badge ? badgeCounts[item.badge] : 0;
                const link = (
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/55 hover:bg-white/[0.045] hover:text-white/90",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    {active ? (
                      <span className="absolute top-1/2 -left-3 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-signal-400" />
                    ) : null}
                    <item.icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors",
                        active ? "text-signal-400" : "text-white/40 group-hover:text-white/70",
                      )}
                      strokeWidth={1.9}
                    />
                    {!collapsed ? (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {count > 0 ? (
                          <span
                            className={cn(
                              "tnum flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                              item.badge === "alerts" ? "bg-risk-500 text-white" : "bg-white/12 text-white/80",
                            )}
                          >
                            {count}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </Link>
                );

                return (
                  <li key={item.href}>
                    {collapsed ? <Hint label={item.label}>{link}</Hint> : link}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pied : portail client + abonnement */}
      <div className="border-t border-white/5 p-3">
        {!collapsed ? (
          <div className="mb-3 rounded-xl border border-white/8 bg-white/[0.04] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-signal-400" />
              <p className="text-[11px] font-semibold tracking-wide text-white/85 uppercase">Offre {company.plan}</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-white/45">
              {portfolio.projectsActive} chantiers actifs · {portfolio.headcount} collaborateurs
            </p>
            <Link
              href="/portail"
              className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-signal-300 transition-colors hover:text-signal-200"
            >
              Ouvrir le portail client
              <ExternalLink className="size-3" />
            </Link>
          </div>
        ) : null}

        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/75",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronsLeft className={cn("size-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed ? "Réduire" : null}
        </button>
      </div>
    </aside>
  );
}
