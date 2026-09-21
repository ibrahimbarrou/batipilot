"use client";

import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck2,
  ClipboardCheck,
  HardHat,
  Plus,
  Search,
  Smartphone,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, DataRow, Progress } from "@/components/ui/data-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrap } from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import { attendanceWeek, company, employees, portfolio, projects } from "@/data";
import { cn, formatDate, formatMoney, formatMoneyCompact, formatNumber } from "@/lib/utils";

const statusMeta: Record<string, { label: string; variant: "ok" | "warn" | "risk" | "neutral" | "brand" }> = {
  present: { label: "Présent", variant: "ok" },
  absent: { label: "Absent", variant: "risk" },
  leave: { label: "Congé", variant: "neutral" },
  mission: { label: "En mission", variant: "brand" },
};

export function TeamsView() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => `${e.name} ${e.job} ${e.agency}`.toLowerCase().includes(q));
  }, [query]);

  const present = employees.filter((e) => e.status === "present").length;
  const dailyPayroll = employees.reduce((s, e) => s + (e.status === "present" ? e.dailyRate : 0), 0);
  const journaliers = employees.filter((e) => e.contract === "Journalier" || e.contract === "Tâcheron").length;

  return (
    <>
      <PageHeader
        eyebrow="Ressources humaines"
        title="Équipes & présences"
        description="Pointage mobile avec photo et GPS, affectation par chantier, productivité par tâche et paie des journaliers par mobile money."
        meta={
          <>
            <Badge variant="brand">{company.headcount} collaborateurs au total</Badge>
            <Badge variant="ok" dot>
              {present} présents aujourd&apos;hui
            </Badge>
            <Badge variant="neutral">{journaliers} journaliers et tâcherons</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <ClipboardCheck />
              Export paie
            </Button>
            <Button>
              <Plus />
              Ajouter un collaborateur
            </Button>
          </>
        }
      />

      <div className="stagger mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Effectif pointé aujourd'hui" value={formatNumber(portfolio.headcountToday)} delta={4} icon={<UserCheck />} accent="ok" trend={attendanceWeek.map((d) => d.present)} />
        <KpiCard label="Masse salariale journalière" value={formatMoneyCompact(dailyPayroll)} delta={6} upIsGood={false} icon={<Users />} accent="brand" />
        <KpiCard label="Taux d'absentéisme" value="4,6 %" delta={-1.2} upIsGood={false} icon={<CalendarCheck2 />} accent="warn" trend={[6.4, 6.1, 5.8, 5.4, 5.1, 4.9, 4.7, 4.6]} />
        <KpiCard label="Productivité moyenne" value="1,18" delta={7} deltaLabel="quantité réalisée / heure" icon={<HardHat />} accent="signal" trend={[1.02, 1.05, 1.08, 1.09, 1.12, 1.14, 1.16, 1.18]} />
      </div>

      <Tabs defaultValue="effectif">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="effectif">
            <Users />
            Effectif
          </TabsTrigger>
          <TabsTrigger variant="underline" value="presences">
            <CalendarCheck2 />
            Présences
          </TabsTrigger>
          <TabsTrigger variant="underline" value="affectations">
            <HardHat />
            Affectations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effectif">
          <Toolbar>
            <div className="w-full sm:w-72">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un collaborateur…" icon={<Search />} />
            </div>
          </Toolbar>

          <TableWrap>
            <Table>
              <THead>
                <TR>
                  <TH>Collaborateur</TH>
                  <TH>Poste</TH>
                  <TH>Contrat</TH>
                  <TH>Chantier</TH>
                  <TH>Qualifications</TH>
                  <TH align="right">Taux journalier</TH>
                  <TH>Statut</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((employee) => {
                  const project = projects.find((p) => p.id === employee.projectId);
                  const meta = statusMeta[employee.status];
                  return (
                    <TR key={employee.id} interactive>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <Avatar initials={employee.initials} tone={employee.tone} size="md" />
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-ink-900">{employee.name}</span>
                            <span className="block text-[11px] text-ink-400">
                              {employee.agency} · depuis {formatDate(employee.since, "short")}
                            </span>
                          </span>
                        </span>
                      </TD>
                      <TD>{employee.job}</TD>
                      <TD>
                        <Badge variant={employee.contract === "Permanent" ? "brand" : "neutral"} size="sm">
                          {employee.contract}
                        </Badge>
                      </TD>
                      <TD>
                        {project ? (
                          <Link href={`/projets/${project.id}`} className="text-brand-700 hover:underline">
                            {project.code}
                          </Link>
                        ) : (
                          <span className="text-ink-400">Siège</span>
                        )}
                      </TD>
                      <TD>
                        <span className="flex flex-wrap gap-1">
                          {employee.qualifications.slice(0, 2).map((q) => (
                            <Badge key={q} variant="outline" size="sm">
                              {q}
                            </Badge>
                          ))}
                          {employee.qualifications.length > 2 ? (
                            <Badge variant="outline" size="sm">
                              +{employee.qualifications.length - 2}
                            </Badge>
                          ) : null}
                        </span>
                      </TD>
                      <TD align="right" className="tnum">
                        {formatMoney(employee.dailyRate)}
                      </TD>
                      <TD>
                        <Badge variant={meta.variant} size="sm">
                          {meta.label}
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrap>
        </TabsContent>

        <TabsContent value="presences">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <Card className="xl:col-span-8">
              <CardHeader>
                <div>
                  <CardTitle>Pointage de la semaine</CardTitle>
                  <p className="mt-0.5 text-[13px] text-ink-500">
                    Saisi par les chefs de chantier depuis le mobile, avec photo et vérification GPS
                  </p>
                </div>
                <Badge variant="ok" size="sm">
                  <Smartphone className="size-3" />
                  100 % mobile
                </Badge>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <TableWrap className="rounded-none border-0 border-t border-line">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Jour</TH>
                        <TH align="right">Présents</TH>
                        <TH align="right">Absents</TH>
                        <TH align="right">Journaliers</TH>
                        <TH>Taux de présence</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {attendanceWeek.map((day) => {
                        const rate = Math.round((day.present / (day.present + day.absent)) * 100);
                        return (
                          <TR key={day.day}>
                            <TD className="font-medium text-ink-900">{day.day}</TD>
                            <TD align="right" className="tnum">{day.present}</TD>
                            <TD align="right" className="tnum text-risk-600">{day.absent}</TD>
                            <TD align="right" className="tnum">{day.journaliers}</TD>
                            <TD className="w-44">
                              <div className="flex items-center gap-2">
                                <Progress value={rate} size="xs" barClassName={rate >= 95 ? "bg-ok-500" : "bg-brand-600"} />
                                <span className="tnum w-9 text-right text-xs font-medium">{rate} %</span>
                              </div>
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </TableWrap>
              </CardContent>
            </Card>

            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paie des journaliers</CardTitle>
                  <Smartphone className="size-4 text-ink-400" />
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-line">
                    <DataRow label="Journaliers pointés (semaine)" value="393" />
                    <DataRow label="Montant à verser" value={formatMoneyCompact(7_517_000)} />
                    <DataRow label="Mode de paiement" value="Mobile Money" />
                    <DataRow label="Dernier versement" value={formatDate("2026-09-18", "short")} />
                  </div>
                  <Button className="mt-3 w-full">Lancer le paiement groupé</Button>
                  <p className="mt-2 text-center text-[11px] text-ink-400">
                    Double validation requise au-delà de 5 M FCFA
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Habilitations à renouveler</CardTitle>
                  <BadgeCheck className="size-4 text-warn-500" />
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {employees
                    .filter((e) => e.qualifications.some((q) => q.includes("CACES") || q.includes("SST")))
                    .slice(0, 4)
                    .map((employee) => (
                      <div key={employee.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
                        <Avatar initials={employee.initials} tone={employee.tone} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-ink-900">{employee.name}</p>
                          <p className="truncate text-[11px] text-ink-400">{employee.qualifications.join(" · ")}</p>
                        </div>
                        <Badge variant="warn" size="sm">
                          3 mois
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="affectations">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects
              .filter((p) => p.stage !== "cloture" && p.teamIds.length > 0)
              .map((project) => {
                const team = employees.filter((e) => e.projectId === project.id);
                return (
                  <Card key={project.id} interactive>
                    <CardHeader>
                      <div className="min-w-0">
                        <CardTitle className="truncate">
                          <Link href={`/projets/${project.id}`} className="hover:text-brand-800">
                            {project.name}
                          </Link>
                        </CardTitle>
                        <p className="tnum truncate text-[12px] text-ink-400">
                          {project.code} · {project.city}
                        </p>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {team.length} affectés
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {team.map((member) => (
                        <div key={member.id} className="flex items-center gap-2.5">
                          <Avatar initials={member.initials} tone={member.tone} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-ink-900">{member.name}</p>
                            <p className="truncate text-[11px] text-ink-400">{member.job}</p>
                          </div>
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              member.status === "present" ? "bg-ok-500" : member.status === "absent" ? "bg-risk-500" : "bg-ink-300",
                            )}
                          />
                        </div>
                      ))}
                      {team.length === 0 ? (
                        <p className="py-4 text-center text-[13px] text-ink-400">Aucun collaborateur affecté.</p>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
