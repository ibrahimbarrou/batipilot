"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fingerprint, Lock, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useSession((s) => s.signIn);
  const [loading, setLoading] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signIn("dg");
      router.push("/choix-role");
    }, 650);
  };

  return (
    <div>
      <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-ink-900">Connexion</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">
        Accédez à votre espace de pilotage Groupe SOGEBAT.
      </p>

      <Tabs defaultValue="email" className="mt-7">
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">
            <Mail />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex-1">
            <Smartphone />
            Téléphone + OTP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-5">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Adresse e-mail">
              <Input
                type="email"
                defaultValue="a.nkodo@sogebat.cm"
                placeholder="prenom.nom@entreprise.cm"
                icon={<Mail />}
                autoComplete="email"
              />
            </Field>

            <Field label="Mot de passe">
              <Input type="password" defaultValue="demo-pilotis" icon={<Lock />} autoComplete="current-password" />
            </Field>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 font-normal text-ink-600">
                <Checkbox defaultChecked />
                Rester connecté 30 jours
              </Label>
              <Link href="/mot-de-passe-oublie" className="text-[13px] font-medium text-brand-700 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Se connecter
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone" className="mt-5">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Numéro de téléphone" hint="Un code à 6 chiffres vous sera envoyé par SMS.">
              <Input type="tel" defaultValue="+237 699 41 02 18" icon={<Smartphone />} />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Recevoir le code SMS
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] tracking-wide text-ink-400 uppercase">ou</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="secondary" size="lg" className="w-full" onClick={submit}>
        <Fingerprint />
        Authentification unique (SSO)
      </Button>

      <p className="mt-8 text-center text-[12px] leading-relaxed text-ink-400">
        En vous connectant, vous acceptez les conditions d&apos;utilisation et la politique de confidentialité de
        PILOTIS.
      </p>
    </div>
  );
}
