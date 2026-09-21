export * from "./org";
export * from "./clients";
export * from "./projects";
export * from "./finance";
export * from "./site";
export * from "./commerce";
export * from "./assets";
export * from "./feed";

import { clients } from "./clients";
import { expenses, invoices } from "./finance";
import { leads, quotes, suppliers } from "./commerce";
import { activeProjects, projects } from "./projects";
import { assets, stock } from "./assets";
import { incidents, siteReports } from "./site";
import { attendanceWeek, employees } from "./org";
import { TODAY, daysBetween } from "@/lib/utils";

/* ------------------------------------------------------------------
   Agrégats — calculés à partir des données, jamais codés en dur.
------------------------------------------------------------------- */

export const portfolio = (() => {
  const inFlight = projects.filter((p) => p.stage !== "cloture");
  const contract = inFlight.reduce((s, p) => s + p.contractAmount, 0);
  const spent = inFlight.reduce((s, p) => s + p.spent, 0);
  const budget = inFlight.reduce((s, p) => s + p.budget, 0);
  const committed = inFlight.reduce((s, p) => s + p.committed, 0);
  const invoiced = inFlight.reduce((s, p) => s + p.invoiced, 0);
  const collected = inFlight.reduce((s, p) => s + p.collected, 0);

  const yearRevenue = projects.reduce((s, p) => s + p.invoiced, 0);
  const grossMargin = contract > 0 ? ((contract - budget) / contract) * 100 : 0;

  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "draft")
    .reduce((s, i) => s + (i.amount - i.paid), 0);

  const overdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + (i.amount - i.paid), 0);

  const weightedPipeline = leads
    .filter((l) => l.stage !== "gagne" && l.stage !== "perdu")
    .reduce((s, l) => s + (l.budget * l.probability) / 100, 0);

  return {
    projectsActive: activeProjects.length,
    projectsTotal: projects.length,
    projectsDelivered: projects.filter((p) => p.stage === "cloture" || p.stage === "reception").length,
    contract,
    budget,
    committed,
    spent,
    invoiced,
    collected,
    yearRevenue,
    grossMargin,
    outstanding,
    overdue,
    weightedPipeline,
    headcount: employees.length,
    surface: projects.reduce((s, p) => s + p.surface, 0),
    clients: clients.length,
    suppliers: suppliers.length,
    openIncidents: incidents.filter((i) => i.status !== "closed").length,
    lowStock: stock.filter((s) => s.qty < s.minQty).length,
    assetsInService: assets.filter((a) => a.status === "in_service").length,
    assetsTotal: assets.length,
    quotesPending: quotes.filter((q) => q.status === "sent" || q.status === "internal_review").length,
    quotesValue: quotes
      .filter((q) => q.status === "sent" || q.status === "internal_review")
      .reduce((s, q) => s + q.amountHT, 0),
    reportsToday: siteReports.filter((r) => r.date === TODAY).length,
    /** Chantiers ayant transmis au moins un rapport sur les 7 derniers jours. */
    reportingProjects: new Set(
      siteReports.filter((r) => daysBetween(r.date, TODAY) <= 7).map((r) => r.projectId),
    ).size,
    adoptionRate: Math.round(
      (new Set(siteReports.filter((r) => daysBetween(r.date, TODAY) <= 7).map((r) => r.projectId)).size /
        activeProjects.length) *
        100,
    ),
    /** Effectif pointé le dernier jour ouvré complet. */
    headcountToday: attendanceWeek[4].present,
    absentToday: attendanceWeek[4].absent,
  };
})();

export const healthBreakdown = [
  { key: "on_track", label: "À l'heure", value: projects.filter((p) => p.health === "on_track").length, color: "var(--color-ok-500)" },
  { key: "at_risk", label: "Vigilance", value: projects.filter((p) => p.health === "at_risk").length, color: "var(--color-warn-500)" },
  { key: "critical", label: "Critique", value: projects.filter((p) => p.health === "critical").length, color: "var(--color-risk-500)" },
  { key: "not_started", label: "Non démarré", value: projects.filter((p) => p.health === "not_started").length, color: "var(--color-ink-300)" },
];

export const projectMarginRanking = projects
  .filter((p) => p.stage !== "etude")
  .map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    margin: Math.round(((p.contractAmount - p.budget) / p.contractAmount) * 1000) / 10,
    contract: p.contractAmount,
    health: p.health,
  }))
  .sort((a, b) => b.margin - a.margin);

export const upcomingDeadlines = projects
  .flatMap((p) =>
    p.milestones
      .filter((m) => m.status === "current" || m.status === "late" || m.status === "todo")
      .map((m) => ({
        id: `${p.id}-${m.id}`,
        projectId: p.id,
        projectName: p.name,
        code: p.code,
        label: m.label,
        date: m.date,
        amount: m.amount,
        status: m.status,
        days: daysBetween(TODAY, m.date),
      })),
  )
  .filter((m) => m.days <= 120)
  .sort((a, b) => a.days - b.days)
  .slice(0, 8);

export const expensesByProject = projects.map((p) => ({
  id: p.id,
  name: p.name,
  budget: p.budget,
  committed: p.committed,
  spent: p.spent,
  usage: p.budget ? Math.round((p.spent / p.budget) * 100) : 0,
}));

export const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

export const validationQueue = [
  { id: "vq-01", type: "Bon de commande", ref: "BC-2026-0423", label: "Grave concassée — 1 400 t", amount: 21_700_000, requester: "Kouassi N'Guessan", project: "Voirie Yopougon", at: "2026-09-16" },
  { id: "vq-02", type: "Bon de commande", ref: "BC-2026-0435", label: "Gasoil — 4 200 L", amount: 3_066_000, requester: "Patrick Mvondo", project: "Axe Nsimalen", at: "2026-09-20" },
  { id: "vq-03", type: "Dépense", ref: "DEP-2026-0318", label: "Location niveleuse — 12 jours", amount: 5_400_000, requester: "Salif Coulibaly", project: "Voirie Yopougon", at: "2026-09-18" },
  { id: "vq-04", type: "Devis", ref: "DEV-2026-0091", label: "Bloc d'imagerie — Clinique de la Cité", amount: 268_000_000, requester: "Pascal Ondoa", project: "Nouveau", at: "2026-09-15" },
  { id: "vq-05", type: "Facture fournisseur", ref: "ELE-2026-0712", label: "Élec Afrique — situation 2", amount: 18_400_000, requester: "Marthe Ngo Bell", project: "Voirie Yopougon", at: "2026-09-15" },
];
