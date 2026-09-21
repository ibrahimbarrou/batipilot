"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = React.useState(42);
  const [loading, setLoading] = React.useState(false);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const complete = code.every(Boolean);

  const setDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/choix-role"), 650);
  };

  return (
    <div>
      <Link href="/login" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft className="size-4" />
        Connexion
      </Link>

      <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <ShieldCheck className="size-6" />
      </span>

      <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink-900">Vérification</h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">
        Saisissez le code à 6 chiffres envoyé au <span className="font-medium text-ink-800">+237 699 •• •• 18</span>.
      </p>

      <form onSubmit={submit} className="mt-7">
        <div className="flex gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Chiffre ${i + 1}`}
              className={cn(
                "tnum h-13 flex-1 rounded-lg border bg-white text-center text-lg font-semibold text-ink-900 shadow-xs transition-all",
                "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none",
                digit ? "border-brand-300" : "border-line",
              )}
            />
          ))}
        </div>

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={!complete} loading={loading}>
          Vérifier et continuer
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-500">
        {seconds > 0 ? (
          <>
            Renvoyer le code dans <span className="tnum font-medium text-ink-800">{seconds} s</span>
          </>
        ) : (
          <button onClick={() => setSeconds(42)} className="font-medium text-brand-700 hover:underline">
            Renvoyer le code
          </button>
        )}
      </p>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-4 text-[13px] leading-relaxed text-ink-500">
        L&apos;authentification à deux facteurs est <span className="font-medium text-ink-800">obligatoire</span> pour
        les rôles financiers et administrateurs.
      </div>
    </div>
  );
}
