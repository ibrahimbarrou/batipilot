"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  UserCog,
  Wifi,
} from "lucide-react";
import { Avatar } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlay";
import { flatNav, navigation } from "@/lib/nav";
import { useSession } from "@/lib/store";
import { cn, relativeTime } from "@/lib/utils";
import { currentUser, notifications, roles } from "@/data";
import { LogoMark, Wordmark } from "@/components/brand/logo";

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const root = flatNav.find((n) => n.href === `/${segments[0]}`);
  return { root, deep: segments.length > 1 };
}

export function Topbar() {
  const setCommandOpen = useSession((s) => s.setCommandOpen);
  const roleId = useSession((s) => s.roleId);
  const setRole = useSession((s) => s.setRole);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { root } = useBreadcrumb();
  const unread = notifications.filter((n) => n.unread).length;
  const activeRole = roles.find((r) => r.id === roleId) ?? roles[0];

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-xl lg:px-6">
        {/* Mobile : menu + logo */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard" className="lg:hidden">
          <LogoMark size={28} />
        </Link>

        {/* Fil d'ariane */}
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink-900">
            {root?.label ?? "Tableau de bord"}
          </p>
          <p className="truncate text-xs text-ink-400">{root?.description ?? "Vue consolidée de l'entreprise"}</p>
        </div>

        {/* Recherche */}
        <button
          onClick={() => setCommandOpen(true)}
          className="group ml-auto flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 text-ink-400 transition-colors hover:border-line-strong hover:text-ink-600 md:w-72 md:justify-start md:px-3 xl:w-80"
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden text-[13px] md:block">Rechercher…</span>
          <kbd className="ml-auto hidden rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-medium md:block">
            ⌘K
          </kbd>
        </button>

        {/* Statut de synchronisation */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-ok-100 bg-ok-50 px-2.5 py-1.5 xl:flex">
          <Wifi className="size-3.5 text-ok-600" />
          <span className="text-[11px] font-medium text-ok-700">Synchronisé</span>
        </div>

        <Button size="sm" variant="primary" className="hidden sm:inline-flex">
          <Plus />
          Créer
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800">
              <Bell className="size-[18px]" />
              {unread > 0 ? (
                <span className="absolute top-1.5 right-1.5 flex size-2 items-center justify-center">
                  <span className="absolute inline-flex size-2 animate-ping rounded-full bg-risk-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-risk-500" />
                </span>
              ) : null}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[22rem]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[13px] font-semibold text-ink-900">Notifications</p>
              <Badge variant="risk" size="sm">
                {unread} non lues
              </Badge>
            </div>
            <div className="scrollbar-slim max-h-80 divide-y divide-line overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn("flex gap-3 px-4 py-3 transition-colors hover:bg-ink-50", n.unread && "bg-brand-50/40")}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      n.kind === "critical" ? "bg-risk-500" : n.kind === "warning" ? "bg-warn-500" : "bg-brand-500",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-ink-900">{n.title}</p>
                    <p className="truncate text-xs text-ink-500">{n.body}</p>
                    <p className="mt-0.5 text-[11px] text-ink-400">{relativeTime(n.at)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-4 py-2.5">
              <Link href="/messages" className="text-[12px] font-medium text-brand-700 hover:underline">
                Voir tout le centre de communication
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Compte */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 transition-colors hover:bg-ink-100">
              <Avatar initials={currentUser.initials} tone={currentUser.avatarTone} size="md" />
              <span className="hidden text-left xl:block">
                <span className="block text-[13px] leading-tight font-medium text-ink-900">{currentUser.name}</span>
                <span className="block text-[11px] leading-tight text-ink-400">{activeRole.label}</span>
              </span>
              <ChevronDown className="hidden size-3.5 text-ink-400 xl:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3 px-2.5 py-2">
              <Avatar initials={currentUser.initials} tone={currentUser.avatarTone} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-ink-900">{currentUser.name}</p>
                <p className="truncate text-xs text-ink-400">{currentUser.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Changer de rôle (démo)</DropdownMenuLabel>
            {roles.map((r) => (
              <DropdownMenuItem key={r.id} onSelect={() => setRole(r.id)}>
                <UserCog />
                <span className="flex-1">{r.label}</span>
                {r.id === roleId ? <Badge variant="brand" size="sm">actif</Badge> : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/parametres">
                <Settings />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleHelp />
              Centre d&apos;aide
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive asChild>
              <Link href="/login">
                <LogOut />
                Se déconnecter
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Navigation mobile */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="scrollbar-slim absolute inset-y-0 left-0 w-[268px] overflow-y-auto bg-ink-950 p-4">
            <div className="mb-6 flex items-center justify-between">
              <Wordmark inverted size="sm" />
              <button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-white/50 hover:bg-white/10">
                ✕
              </button>
            </div>
            {navigation.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.12em] text-white/30 uppercase">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <item.icon className="size-[17px] text-white/40" strokeWidth={1.9} />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
