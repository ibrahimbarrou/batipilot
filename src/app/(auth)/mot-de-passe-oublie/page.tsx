"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-ok-50 text-ok-600">
          <MailCheck className="size-6" />
        </span>
        <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink-900">Lien envoyé</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
          Si un compte est associé à cette adresse, vous recevrez un lien de réinitialisation valable 30 minutes.
          Pensez à vérifier vos indésirables.
        </p>
        <Button asChild variant="secondary" size="lg" className="mt-6 w-full">
          <Link href="/login">
            <ArrowLeft />
            Retour à la connexion
          </Link>
        </Button>
        <button onClick={() => setSent(false)} className="mt-4 text-[13px] font-medium text-brand-700 hover:underline">
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  return (
    <div>
      <Link href="/login" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft className="size-4" />
        Connexion
      </Link>
      <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink-900">Mot de passe oublié</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">
        Saisissez votre adresse professionnelle, nous vous envoyons un lien de réinitialisation.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Adresse e-mail">
          <Input type="email" placeholder="prenom.nom@entreprise.cm" icon={<Mail />} required />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Envoyer le lien
        </Button>
      </form>

      <div className="mt-8 rounded-lg border border-line bg-surface-2 p-4">
        <p className="text-[13px] font-medium text-ink-800">Pas d&apos;adresse e-mail ?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
          Les utilisateurs terrain peuvent se connecter avec leur numéro de téléphone et un code SMS. Contactez
          l&apos;administrateur de votre entreprise.
        </p>
      </div>
    </div>
  );
}
