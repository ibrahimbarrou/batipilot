"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, CornerDownLeft, FileSignature, Search, Truck, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/overlay";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { flatNav } from "@/lib/nav";
import { clients, projects, quotes, suppliers } from "@/data";

interface Entry {
  id: string;
  label: string;
  hint: string;
  href: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
}

function buildIndex(): Entry[] {
  return [
    ...flatNav.map((n) => ({
      id: `nav-${n.href}`,
      label: n.label,
      hint: n.description,
      href: n.href,
      group: "Navigation",
      icon: n.icon,
    })),
    ...projects.map((p) => ({
      id: p.id,
      label: p.name,
      hint: `${p.code} · ${p.city}`,
      href: `/projets/${p.id}`,
      group: "Projets",
      icon: Building2,
    })),
    ...clients.map((c) => ({
      id: c.id,
      label: c.name,
      hint: `${c.type} · ${c.city}`,
      href: "/crm",
      group: "Clients",
      icon: Users,
    })),
    ...quotes.map((q) => ({
      id: q.id,
      label: q.projectName,
      hint: `${q.number} · devis`,
      href: `/devis/${q.id}`,
      group: "Devis",
      icon: FileSignature,
    })),
    ...suppliers.map((s) => ({
      id: s.id,
      label: s.name,
      hint: `${s.category} · ${s.city}`,
      href: "/fournisseurs",
      group: "Fournisseurs",
      icon: Truck,
    })),
  ];
}

export function CommandPalette() {
  const open = useSession((s) => s.commandOpen);
  const setOpen = useSession((s) => s.setCommandOpen);
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const index = React.useMemo(buildIndex, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? index.filter((e) => `${e.label} ${e.hint} ${e.group}`.toLowerCase().includes(q))
      : index.filter((e) => e.group === "Navigation").slice(0, 7);
    return pool.slice(0, 12);
  }, [query, index]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  React.useEffect(() => {
    setCursor(0);
  }, [query]);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router, setOpen],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor].href);
    }
  };

  let lastGroup = "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent size="md" hideClose className="top-[18%] translate-y-0 overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-ink-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Rechercher un projet, un client, un devis, une page…"
            className="h-13 w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="hidden rounded border border-line bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-400 sm:block">
            ESC
          </kbd>
        </div>

        <div className="scrollbar-slim max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-ink-400">
              Aucun résultat pour « {query} »
            </p>
          ) : (
            results.map((entry, i) => {
              const showGroup = entry.group !== lastGroup;
              lastGroup = entry.group;
              return (
                <React.Fragment key={entry.id}>
                  {showGroup ? (
                    <p className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-[0.1em] text-ink-400 uppercase">
                      {entry.group}
                    </p>
                  ) : null}
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(entry.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      i === cursor ? "bg-brand-50" : "hover:bg-ink-50",
                    )}
                  >
                    <entry.icon className={cn("size-4 shrink-0", i === cursor ? "text-brand-700" : "text-ink-400")} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink-900">{entry.label}</span>
                      <span className="block truncate text-xs text-ink-400">{entry.hint}</span>
                    </span>
                    {i === cursor ? <ArrowRight className="size-3.5 text-brand-600" /> : null}
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-line bg-surface-2 px-4 py-2 text-[11px] text-ink-400">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" /> ouvrir
          </span>
          <span>↑ ↓ naviguer</span>
          <span className="ml-auto">{results.length} résultat{results.length > 1 ? "s" : ""}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
