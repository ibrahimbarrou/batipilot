"use client";

import * as React from "react";
import {
  Building2,
  CreditCard,
  Globe,
  KeyRound,
  Layers,
  Palette,
  Plug,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow, Progress } from "@/components/ui/data-display";
import { Field, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { LogoMark } from "@/components/brand/logo";
import { company, people, roles } from "@/data";
import { cn, formatMoney } from "@/lib/utils";

const MODULES = [
  { id: "projects", label: "Projets & planning", included: true, plan: "Starter" },
  { id: "site", label: "Suivi de chantier mobile", included: true, plan: "Starter" },
  { id: "client", label: "Portail client", included: true, plan: "Starter" },
  { id: "quotes", label: "Devis & signature", included: true, plan: "Starter" },
  { id: "finance", label: "Finance & trésorerie", included: true, plan: "Pro" },
  { id: "procurement", label: "Achats & fournisseurs", included: true, plan: "Pro" },
  { id: "assets", label: "Matériel & stocks", included: true, plan: "Pro" },
  { id: "hr", label: "Ressources humaines", included: true, plan: "Pro" },
  { id: "crm", label: "CRM & prospection", included: true, plan: "Business" },
  { id: "bi", label: "Reporting & BI", included: true, plan: "Business" },
  { id: "api", label: "API publique & webhooks", included: true, plan: "Business" },
  { id: "ai", label: "Modules IA (prévision, OCR avancé)", included: false, plan: "Enterprise" },
];

const PERMISSION_MATRIX = [
  { role: "Directeur Général", projets: "V", chantier: "L", finance: "V", devis: "V", achats: "V", reporting: "A" },
  { role: "Chef d'entreprise", projets: "A", chantier: "A", finance: "A", devis: "A", achats: "A", reporting: "A" },
  { role: "Chef de Projet", projets: "E", chantier: "V", finance: "P", devis: "E", achats: "E", reporting: "P" },
  { role: "Conducteur de Travaux", projets: "P", chantier: "E", finance: "P", devis: "L", achats: "E", reporting: "P" },
  { role: "Chef de Chantier", projets: "P", chantier: "E", finance: "—", devis: "—", achats: "P", reporting: "—" },
  { role: "Responsable Financier", projets: "L", chantier: "L", finance: "V", devis: "V", achats: "V", reporting: "A" },
  { role: "Client", projets: "P", chantier: "P", finance: "P", devis: "P", achats: "—", reporting: "P" },
];

const LEGEND = [
  { key: "A", label: "Administration complète" },
  { key: "V", label: "Validation" },
  { key: "E", label: "Création et modification" },
  { key: "L", label: "Lecture" },
  { key: "P", label: "Lecture sur son périmètre" },
  { key: "—", label: "Aucun accès" },
];

export function SettingsView() {
  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Paramètres"
        description="Entreprise, utilisateurs, rôles, modules actifs, intégrations et abonnement — tout ce qui configure PILOTIS pour votre organisation."
        meta={
          <>
            <Badge variant="brand">Offre {company.plan}</Badge>
            <Badge variant="neutral">{company.agencies.length} agences</Badge>
            <Badge variant="ok" dot>
              Conformité OHADA activée
            </Badge>
          </>
        }
        actions={<Button>Enregistrer les modifications</Button>}
      />

      <Tabs defaultValue="entreprise">
        <TabsList variant="underline" className="mb-5 w-full overflow-x-auto">
          <TabsTrigger variant="underline" value="entreprise">
            <Building2 />
            Entreprise
          </TabsTrigger>
          <TabsTrigger variant="underline" value="utilisateurs">
            <Users />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger variant="underline" value="roles">
            <UserCog />
            Rôles & permissions
          </TabsTrigger>
          <TabsTrigger variant="underline" value="modules">
            <Layers />
            Modules
          </TabsTrigger>
          <TabsTrigger variant="underline" value="integrations">
            <Plug />
            Intégrations
          </TabsTrigger>
          <TabsTrigger variant="underline" value="abonnement">
            <CreditCard />
            Abonnement
          </TabsTrigger>
        </TabsList>

        {/* --------------------- Entreprise --------------------- */}
        <TabsContent value="entreprise">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <CardTitle>Informations légales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Raison sociale">
                  <Input defaultValue={company.legal} />
                </Field>
                <Field label="Nom commercial">
                  <Input defaultValue={company.name} />
                </Field>
                <Field label="Registre du commerce">
                  <Input defaultValue={company.rccm} />
                </Field>
                <Field label="Numéro d'identifiant unique">
                  <Input defaultValue={company.niu} />
                </Field>
                <Field label="Siège social">
                  <Input defaultValue={company.hq} />
                </Field>
                <Field label="Secteur d'activité">
                  <Input defaultValue={company.tagline} />
                </Field>
                <Field label="Devise de référence" hint="Utilisée pour la consolidation du groupe">
                  <Select defaultValue="XAF">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XAF">FCFA — Franc CFA (CEMAC)</SelectItem>
                      <SelectItem value="XOF">FCFA — Franc CFA (UEMOA)</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Langue par défaut">
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Identité visuelle</CardTitle>
                  <Palette className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 rounded-lg border border-line bg-surface-2 p-4">
                    <LogoMark size={44} />
                    <div>
                      <p className="text-[13px] font-medium text-ink-900">Logo de l&apos;entreprise</p>
                      <p className="text-[12px] text-ink-400">PNG ou SVG, 512 × 512 px</p>
                      <Button size="xs" variant="secondary" className="mt-2">
                        Remplacer
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-ink-900">Marque blanche</p>
                        <p className="text-[12px] text-ink-500">Portail client à vos couleurs</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-ink-900">Thème sombre</p>
                        <p className="text-[12px] text-ink-500">Disponible pour tous les utilisateurs</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agences</CardTitle>
                  <Globe className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {company.agencies.map((agency) => (
                    <div key={agency} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                      <span className="text-[13px] font-medium text-ink-900">{agency}</span>
                      <span className="tnum text-[12px] text-ink-400">
                        {people.filter((p) => p.agency === agency).length} utilisateur
                        {people.filter((p) => p.agency === agency).length > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" className="w-full">
                    Ajouter une agence
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* -------------------- Utilisateurs -------------------- */}
        <TabsContent value="utilisateurs">
          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Utilisateur</TH>
                  <TH>Rôle</TH>
                  <TH>Agence</TH>
                  <TH>Contact</TH>
                  <TH>MFA</TH>
                  <TH align="right">Statut</TH>
                </TR>
              </THead>
              <TBody>
                {people.map((person) => {
                  const mfaRequired = ["dg", "resp_financier", "chef_entreprise", "comptable"].includes(person.roleId);
                  return (
                    <TR key={person.id} interactive>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <Avatar initials={person.initials} tone={person.avatarTone} size="md" />
                          <span>
                            <span className="block font-medium text-ink-900">{person.name}</span>
                            <span className="block text-[11px] text-ink-400">{person.email}</span>
                          </span>
                        </span>
                      </TD>
                      <TD>{person.role}</TD>
                      <TD>{person.agency}</TD>
                      <TD className="tnum">{person.phone}</TD>
                      <TD>
                        <Badge variant={mfaRequired ? "ok" : "neutral"} size="sm">
                          {mfaRequired ? "Obligatoire" : "Optionnel"}
                        </Badge>
                      </TD>
                      <TD align="right">
                        <Badge variant="ok" size="sm" dot>
                          Actif
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>

        {/* ----------------------- Rôles ------------------------ */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Matrice des permissions</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Modèle par défaut, modifiable rôle par rôle</p>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Rôle</TH>
                        <TH align="center">Projets</TH>
                        <TH align="center">Chantier</TH>
                        <TH align="center">Finance</TH>
                        <TH align="center">Devis</TH>
                        <TH align="center">Achats</TH>
                        <TH align="center">Reporting</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {PERMISSION_MATRIX.map((row) => (
                        <TR key={row.role}>
                          <TD className="font-medium text-ink-900">{row.role}</TD>
                          {[row.projets, row.chantier, row.finance, row.devis, row.achats, row.reporting].map((v, i) => (
                            <TD key={i} align="center">
                              <span
                                className={cn(
                                  "inline-flex size-6 items-center justify-center rounded-md text-[11px] font-bold",
                                  v === "A"
                                    ? "bg-brand-800 text-white"
                                    : v === "V"
                                      ? "bg-brand-100 text-brand-800"
                                      : v === "E"
                                        ? "bg-ok-50 text-ok-700"
                                        : v === "L"
                                          ? "bg-ink-100 text-ink-600"
                                          : v === "P"
                                            ? "bg-warn-50 text-warn-700"
                                            : "text-ink-300",
                                )}
                              >
                                {v}
                              </span>
                            </TD>
                          ))}
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </TableWrap>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line px-5 py-3">
                  {LEGEND.map((l) => (
                    <span key={l.key} className="flex items-center gap-1.5 text-[11px] text-ink-500">
                      <span className="font-bold text-ink-700">{l.key}</span> {l.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Règles de gouvernance</CardTitle>
                  <ShieldCheck className="size-4 text-ok-600" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Rule
                    title="Séparation des tâches"
                    detail="Celui qui crée un paiement ne peut pas le valider."
                    on
                  />
                  <Rule
                    title="Validation par seuil"
                    detail={`Au-delà de ${formatMoney(2_000_000)} : Responsable Financier. Au-delà de ${formatMoney(10_000_000)} : Directeur Général.`}
                    on
                  />
                  <Rule
                    title="Visibilité client contrôlée"
                    detail="Coûts internes et marges masqués par défaut sur le portail."
                    on
                  />
                  <Rule title="Journal d'audit immuable" detail="Conservation 5 ans minimum." on />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modèles de rôles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-ink-900">{role.label}</p>
                        <p className="truncate text-[11px] text-ink-400">{role.scope}</p>
                      </div>
                      <Button size="xs" variant="ghost">
                        Cloner
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---------------------- Modules ----------------------- */}
        <TabsContent value="modules">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {MODULES.map((module) => (
              <Card key={module.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-ink-900">{module.label}</p>
                    <Badge variant={module.included ? "ok" : "neutral"} size="sm" className="mt-1.5">
                      Inclus dans {module.plan}
                    </Badge>
                  </div>
                  <Switch defaultChecked={module.included} disabled={!module.included} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* -------------------- Intégrations -------------------- */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { name: "Orange Money", detail: "Paiements fournisseurs et journaliers", status: "connected" },
              { name: "MTN Mobile Money", detail: "Encaissements clients et décaissements", status: "connected" },
              { name: "Wave", detail: "Zone UEMOA — Côte d'Ivoire et Sénégal", status: "connected" },
              { name: "Sage Comptabilité", detail: "Export des écritures SYSCOHADA", status: "connected" },
              { name: "WhatsApp Business", detail: "Notifications client et liens portail", status: "pending" },
              { name: "Agrégateur SMS", detail: "Alertes critiques et codes OTP", status: "connected" },
              { name: "Mapbox", detail: "Carte des chantiers et géorepérage", status: "connected" },
              { name: "API publique PILOTIS", detail: "Clés API par tenant et webhooks", status: "available" },
              { name: "Odoo", detail: "Synchronisation comptable bidirectionnelle", status: "available" },
            ].map((integration) => (
              <Card key={integration.name} interactive>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink-900">{integration.name}</p>
                      <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{integration.detail}</p>
                    </div>
                    <Badge
                      variant={
                        integration.status === "connected" ? "ok" : integration.status === "pending" ? "warn" : "neutral"
                      }
                      size="sm"
                    >
                      {integration.status === "connected" ? "Connecté" : integration.status === "pending" ? "En attente" : "Disponible"}
                    </Badge>
                  </div>
                  <Button size="xs" variant={integration.status === "connected" ? "secondary" : "primary"} className="mt-3">
                    {integration.status === "connected" ? "Configurer" : "Connecter"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* -------------------- Abonnement ---------------------- */}
        <TabsContent value="abonnement">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Offre {company.plan}</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">Facturation annuelle — 2 mois offerts</p>
                </div>
                <Badge variant="brand">Renouvellement le 1er février 2027</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Usage label="Chantiers actifs" used={9} limit="illimité" ratio={40} />
                  <Usage label="Utilisateurs bureau" used={10} limit="75" ratio={13} />
                  <Usage label="Stockage documents" used={128} limit="500 Go" ratio={26} />
                </div>
                <div className="mt-5 divide-y divide-line border-t border-line pt-1">
                  <DataRow label="Abonnement annuel" value={formatMoney(3_900_000)} />
                  <DataRow label="Utilisateurs supplémentaires" value="0 × 6 000 FCFA / mois" />
                  <DataRow label="Mise en service et formation" value={formatMoney(850_000)} />
                  <div className="flex items-baseline justify-between gap-4 pt-3">
                    <span className="text-[14px] font-semibold text-ink-900">Total facturé</span>
                    <span className="tnum text-[18px] font-semibold text-brand-800">{formatMoney(4_750_000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <KeyRound className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Rule title="Authentification à deux facteurs" detail="Obligatoire pour les rôles financiers." on />
                  <Rule title="SSO SAML / OIDC" detail="Disponible sur l'offre Enterprise." />
                  <Rule title="Journalisation des exports" detail="Chaque export est tracé et horodaté." on />
                  <Rule title="Session mobile verrouillée" detail="Code PIN ou biométrie après 15 minutes." on />
                </CardContent>
              </Card>

              <Card className="border-brand-200 bg-brand-50/50">
                <CardContent className="pt-5">
                  <p className="text-[13px] font-semibold text-brand-900">Passer à l&apos;offre Enterprise</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-brand-800/80">
                    Base de données dédiée, hébergement souverain, SSO, SLA 1 heure et modules IA avancés.
                  </p>
                  <Button size="sm" className="mt-3">
                    Contacter un conseiller
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Rule({ title, detail, on }: { title: string; detail: string; on?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-line p-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink-900">{title}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{detail}</p>
      </div>
      <Switch defaultChecked={on} />
    </div>
  );
}

function Usage({ label, used, limit, ratio }: { label: string; used: number; limit: string; ratio: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4">
      <p className="text-[12px] text-ink-500">{label}</p>
      <p className="tnum mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink-900">
        {used}
        <span className="ml-1 text-[13px] font-normal text-ink-400">/ {limit}</span>
      </p>
      <Progress value={ratio} size="sm" className="mt-2" />
    </div>
  );
}
