import type { Expense, Invoice, SupplierInvoice } from "@/types";

/* ---------------------------- Dépenses ---------------------------- */

export const expenses: Expense[] = [
  { id: "d-001", projectId: "p-01", date: "2026-09-19", label: "Ciment CPJ 42.5 — 480 sacs", category: "Matériaux", lotId: "l-02", amount: 3_360_000, supplierId: "s-01", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Idriss Sanogo" },
  { id: "d-002", projectId: "p-01", date: "2026-09-18", label: "Paie journaliers semaine 38", category: "Main-d'oeuvre", lotId: "l-02", amount: 1_842_000, status: "validated", paymentMethod: "Mobile Money", hasReceipt: true, author: "Jean-Marie Ateba" },
  { id: "d-003", projectId: "p-04", date: "2026-09-18", label: "Location niveleuse — 12 jours", category: "Matériel", lotId: "l-33", amount: 5_400_000, supplierId: "s-10", status: "pending", paymentMethod: "Virement", hasReceipt: true, author: "Salif Coulibaly" },
  { id: "d-004", projectId: "p-02", date: "2026-09-17", label: "Gasoil groupe & engins — 4 200 L", category: "Frais généraux", lotId: "l-12", amount: 3_066_000, supplierId: "s-08", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Patrick Mvondo" },
  { id: "d-005", projectId: "p-05", date: "2026-09-17", label: "Béton prêt à l'emploi C30/37 — 180 m³", category: "Matériaux", lotId: "l-42", amount: 14_760_000, supplierId: "s-02", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Christelle Abena" },
  { id: "d-006", projectId: "p-03", date: "2026-09-16", label: "Carrelage grès cérame 60×60 — 320 m²", category: "Matériaux", lotId: "l-23", amount: 4_160_000, supplierId: "s-05", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Cédric Fotso" },
  { id: "d-007", projectId: "p-06", date: "2026-09-16", label: "Buses béton Ø800 — 64 ml", category: "Matériaux", lotId: "l-52", amount: 7_680_000, supplierId: "s-04", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Serge Onana" },
  { id: "d-008", projectId: "p-04", date: "2026-09-15", label: "Sous-traitance pose candélabres — situation 2", category: "Sous-traitance", lotId: "l-34", amount: 18_400_000, supplierId: "s-09", status: "pending", paymentMethod: "Virement", hasReceipt: true, author: "Aïcha Diallo" },
  { id: "d-009", projectId: "p-01", date: "2026-09-15", label: "Acier HA 12 — 8,4 t", category: "Matériaux", lotId: "l-02", amount: 6_552_000, supplierId: "s-07", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Idriss Sanogo" },
  { id: "d-010", projectId: "p-02", date: "2026-09-14", label: "Paie tâcherons terrassement", category: "Main-d'oeuvre", lotId: "l-12", amount: 4_280_000, status: "validated", paymentMethod: "Mobile Money", hasReceipt: true, author: "Bertrand Essomba" },
  { id: "d-011", projectId: "p-09", date: "2026-09-12", label: "Peinture époxy sol technique", category: "Matériaux", lotId: "l-83", amount: 2_940_000, supplierId: "s-05", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Éric Tamba" },
  { id: "d-012", projectId: "p-05", date: "2026-09-11", label: "Forage pieux — sous-traitance spécialisée", category: "Sous-traitance", lotId: "l-41", amount: 32_600_000, supplierId: "s-03", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Christelle Abena" },
  { id: "d-013", projectId: "p-07", date: "2026-09-10", label: "Honoraires bureau d'études fluides", category: "Frais généraux", lotId: "l-61", amount: 5_800_000, status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Aïcha Diallo" },
  { id: "d-014", projectId: "p-04", date: "2026-09-09", label: "Grave concassée 0/31,5 — 620 t", category: "Matériaux", lotId: "l-33", amount: 9_300_000, supplierId: "s-03", status: "rejected", paymentMethod: "Virement", hasReceipt: false, author: "Kouassi N'Guessan" },
  { id: "d-015", projectId: "p-01", date: "2026-09-08", label: "Location grue à tour — mois de septembre", category: "Matériel", lotId: "l-02", amount: 8_200_000, supplierId: "s-10", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Cédric Fotso" },
  { id: "d-016", projectId: "p-06", date: "2026-09-07", label: "Paie journaliers semaine 36", category: "Main-d'oeuvre", lotId: "l-52", amount: 1_395_000, status: "validated", paymentMethod: "Mobile Money", hasReceipt: true, author: "Serge Onana" },
  { id: "d-017", projectId: "p-03", date: "2026-09-05", label: "Menuiseries aluminium — acompte 40 %", category: "Sous-traitance", lotId: "l-23", amount: 6_400_000, supplierId: "s-06", status: "validated", paymentMethod: "Virement", hasReceipt: true, author: "Cédric Fotso" },
  { id: "d-018", projectId: "p-02", date: "2026-09-04", label: "Réparation pelle CAT 320 — boîte de transfert", category: "Matériel", lotId: "l-12", amount: 4_850_000, supplierId: "s-10", status: "pending", paymentMethod: "Virement", hasReceipt: true, author: "Yves Kamga" },
];

/* ------------------------- Factures clients ------------------------ */

export const invoices: Invoice[] = [
  { id: "f-001", number: "FAC-2026-0184", projectId: "p-01", clientId: "c-01", type: "Situation", issueDate: "2026-09-05", dueDate: "2026-10-05", amount: 142_000_000, paid: 0, status: "sent", retention: 5, label: "Situation n°9 — septembre 2026" },
  { id: "f-002", number: "FAC-2026-0179", projectId: "p-02", clientId: "c-02", type: "Situation", issueDate: "2026-07-31", dueDate: "2026-08-30", amount: 186_000_000, paid: 0, status: "overdue", retention: 5, label: "Situation n°7 — travaux de terrassement" },
  { id: "f-003", number: "FAC-2026-0171", projectId: "p-04", clientId: "c-04", type: "Situation", issueDate: "2026-06-30", dueDate: "2026-07-30", amount: 232_000_000, paid: 0, status: "overdue", retention: 5, label: "Situation n°8 — collecteurs" },
  { id: "f-004", number: "FAC-2026-0168", projectId: "p-04", clientId: "c-04", type: "Situation", issueDate: "2026-08-31", dueDate: "2026-09-30", amount: 140_000_000, paid: 0, status: "sent", retention: 5, label: "Situation n°9 — chaussée zone A" },
  { id: "f-005", number: "FAC-2026-0162", projectId: "p-03", clientId: "c-03", type: "Situation", issueDate: "2026-09-12", dueDate: "2026-09-26", amount: 37_400_000, paid: 0, status: "sent", retention: 0, label: "Situation second œuvre" },
  { id: "f-006", number: "FAC-2026-0155", projectId: "p-06", clientId: "c-06", type: "Situation", issueDate: "2026-08-31", dueDate: "2026-09-30", amount: 94_000_000, paid: 47_000_000, status: "partial", retention: 5, label: "Situation n°6 — collecteur principal" },
  { id: "f-007", number: "FAC-2026-0149", projectId: "p-09", clientId: "c-05", type: "Solde", issueDate: "2026-09-18", dueDate: "2026-10-18", amount: 86_000_000, paid: 0, status: "sent", retention: 5, label: "Solde à la réception provisoire" },
  { id: "f-008", number: "FAC-2026-0141", projectId: "p-05", clientId: "c-05", type: "Situation", issueDate: "2026-08-14", dueDate: "2026-09-13", amount: 210_000_000, paid: 210_000_000, status: "paid", retention: 5, label: "Situation n°4 — fondations spéciales" },
  { id: "f-009", number: "FAC-2026-0133", projectId: "p-07", clientId: "c-07", type: "Acompte", issueDate: "2026-07-10", dueDate: "2026-08-09", amount: 123_000_000, paid: 123_000_000, status: "paid", retention: 0, label: "Acompte de démarrage — études" },
  { id: "f-010", number: "FAC-2026-0128", projectId: "p-01", clientId: "c-01", type: "Situation", issueDate: "2026-08-05", dueDate: "2026-09-04", amount: 118_000_000, paid: 118_000_000, status: "paid", retention: 5, label: "Situation n°8 — août 2026" },
  { id: "f-011", number: "FAC-2026-0119", projectId: "p-02", clientId: "c-02", type: "Situation", issueDate: "2026-06-30", dueDate: "2026-07-30", amount: 164_000_000, paid: 164_000_000, status: "paid", retention: 5, label: "Situation n°6" },
  { id: "f-012", number: "FAC-2026-0192", projectId: "p-06", clientId: "c-06", type: "Situation", issueDate: "2026-09-21", dueDate: "2026-10-21", amount: 58_200_000, paid: 0, status: "draft", retention: 5, label: "Situation n°7 — brouillon" },
];

/* ------------------------ Factures fournisseurs -------------------- */

export const supplierInvoices: SupplierInvoice[] = [
  { id: "sf-001", number: "CIM-2026-8841", supplierId: "s-01", projectId: "p-01", date: "2026-09-19", dueDate: "2026-10-19", amount: 3_360_000, status: "matched", orderId: "bc-004" },
  { id: "sf-002", number: "BET-2026-2210", supplierId: "s-02", projectId: "p-05", date: "2026-09-17", dueDate: "2026-10-17", amount: 14_760_000, status: "validated", orderId: "bc-002" },
  { id: "sf-003", number: "GRV-2026-0455", supplierId: "s-03", projectId: "p-04", date: "2026-09-14", dueDate: "2026-10-14", amount: 9_300_000, status: "to_match" },
  { id: "sf-004", number: "LOC-2026-1187", supplierId: "s-10", projectId: "p-01", date: "2026-09-08", dueDate: "2026-10-08", amount: 8_200_000, status: "paid", orderId: "bc-006" },
  { id: "sf-005", number: "ACR-2026-3390", supplierId: "s-07", projectId: "p-01", date: "2026-09-15", dueDate: "2026-11-14", amount: 6_552_000, status: "validated", orderId: "bc-001" },
  { id: "sf-006", number: "ELE-2026-0712", supplierId: "s-09", projectId: "p-04", date: "2026-09-15", dueDate: "2026-10-30", amount: 18_400_000, status: "to_match" },
  { id: "sf-007", number: "PRE-2026-6604", supplierId: "s-04", projectId: "p-06", date: "2026-09-16", dueDate: "2026-10-16", amount: 7_680_000, status: "matched", orderId: "bc-005" },
];

/* --------------------------- Séries temps -------------------------- */

export const revenueSeries = [
  { month: "Oct 25", facture: 268, encaisse: 241, depense: 198 },
  { month: "Nov 25", facture: 312, encaisse: 274, depense: 231 },
  { month: "Déc 25", facture: 356, encaisse: 302, depense: 268 },
  { month: "Jan 26", facture: 298, encaisse: 331, depense: 242 },
  { month: "Fév 26", facture: 341, encaisse: 288, depense: 254 },
  { month: "Mar 26", facture: 389, encaisse: 352, depense: 291 },
  { month: "Avr 26", facture: 412, encaisse: 366, depense: 318 },
  { month: "Mai 26", facture: 398, encaisse: 402, depense: 305 },
  { month: "Juin 26", facture: 447, encaisse: 381, depense: 342 },
  { month: "Juil 26", facture: 468, encaisse: 412, depense: 358 },
  { month: "Août 26", facture: 421, encaisse: 389, depense: 331 },
  { month: "Sep 26", facture: 462, encaisse: 344, depense: 349 },
];

export const marginSeries = [
  { month: "Avr 26", previsionnelle: 22.4, reelle: 21.1 },
  { month: "Mai 26", previsionnelle: 22.4, reelle: 21.8 },
  { month: "Juin 26", previsionnelle: 22.1, reelle: 20.6 },
  { month: "Juil 26", previsionnelle: 22.1, reelle: 19.9 },
  { month: "Août 26", previsionnelle: 21.8, reelle: 19.4 },
  { month: "Sep 26", previsionnelle: 21.8, reelle: 18.7 },
];

/** Prévisionnel de trésorerie glissant sur 13 semaines (M FCFA) */
export const cashForecast = Array.from({ length: 13 }, (_, i) => {
  const base = [
    { enc: 148, dec: 132 }, { enc: 96, dec: 141 }, { enc: 212, dec: 128 },
    { enc: 74, dec: 156 }, { enc: 188, dec: 134 }, { enc: 132, dec: 149 },
    { enc: 246, dec: 138 }, { enc: 88, dec: 162 }, { enc: 174, dec: 141 },
    { enc: 205, dec: 133 }, { enc: 119, dec: 158 }, { enc: 231, dec: 146 },
    { enc: 167, dec: 139 },
  ][i];
  return { week: `S${38 + i > 52 ? 38 + i - 52 : 38 + i}`, encaissements: base.enc, decaissements: base.dec };
});

export const cashPosition = (() => {
  let solde = 342;
  return cashForecast.map((w) => {
    solde = solde + w.encaissements - w.decaissements;
    return { ...w, solde: Math.round(solde) };
  });
})();

export const expenseByCategory = [
  { name: "Matériaux", value: 1_842_000_000, color: "var(--color-brand-600)" },
  { name: "Main-d'œuvre", value: 986_000_000, color: "var(--color-brand-400)" },
  { name: "Sous-traitance", value: 742_000_000, color: "var(--color-signal-400)" },
  { name: "Matériel", value: 418_000_000, color: "var(--color-ok-500)" },
  { name: "Frais généraux", value: 264_000_000, color: "var(--color-ink-400)" },
];

export const agingBuckets = [
  { bucket: "Non échu", amount: 403_600_000 },
  { bucket: "1 à 30 j", amount: 140_000_000 },
  { bucket: "31 à 60 j", amount: 186_000_000 },
  { bucket: "61 à 90 j", amount: 232_000_000 },
  { bucket: "+ de 90 j", amount: 0 },
];
