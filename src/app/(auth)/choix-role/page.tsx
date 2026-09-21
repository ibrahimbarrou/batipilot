"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/data";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { RoleId } from "@/types";

export default function RoleChoicePage() {
  const router = useRouter();
  const setRole = useSession((s) => s.setRole);
  const signIn = useSession((s) => s.signIn);
  const [selected, setSelected] = React.useState<RoleId>("dg");

  const confirm = () => {
    signIn(selected);
    setRole(selected);
    const role = roles.find((r) => r.id === selected);
    router.push(role?.landing ?? "/dashboard");
  };

  return (
    <div className="w-full max-w-[520px]">
      <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink-900">Choisissez votre espace</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">
        Votre compte donne accès à plusieurs rôles. L&apos;interface s&apos;adapte à vos responsabilités.
      </p>

      <div className="mt-7 space-y-2">
        {roles.map((role) => {
          const active = selected === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={cn(
                "flex w-full items-start gap-3.5 rounded-lg border p-4 text-left transition-all duration-150",
                active
                  ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/15"
                  : "border-line bg-surface hover:border-line-strong hover:bg-ink-50/60",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold",
                  active ? "bg-brand-800 text-white" : "bg-ink-100 text-ink-500",
                )}
              >
                {role.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink-900">{role.label}</span>
                  <Badge variant={active ? "brand" : "neutral"} size="sm">
                    {role.scope}
                  </Badge>
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">{role.description}</span>
              </span>
              {active ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <Button size="lg" className="mt-6 w-full" onClick={confirm}>
        Entrer dans PILOTIS
        <ArrowRight />
      </Button>

      <p className="mt-4 text-center text-[12px] text-ink-400">
        Vous pourrez changer de rôle à tout moment depuis votre menu utilisateur.
      </p>
    </div>
  );
}
