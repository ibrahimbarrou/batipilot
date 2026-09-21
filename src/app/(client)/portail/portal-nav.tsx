"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, FolderOpen, Home, Images, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/portail", label: "Mon chantier", icon: Home },
  { href: "/portail/photos", label: "Photos", icon: Images },
  { href: "/portail/documents", label: "Documents", icon: FolderOpen },
  { href: "/portail/paiements", label: "Paiements", icon: CreditCard },
  { href: "/portail/messages", label: "Messages", icon: MessageSquare, badge: 1 },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-line">
      <div className="scrollbar-slim mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 lg:px-6">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-brand-700 text-brand-800"
                  : "border-transparent text-ink-500 hover:text-ink-900",
              )}
            >
              <item.icon className={cn("size-4", active ? "text-brand-700" : "text-ink-400")} />
              {item.label}
              {item.badge ? (
                <span className="tnum flex size-4 items-center justify-center rounded-full bg-risk-500 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
