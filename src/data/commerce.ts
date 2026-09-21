import type { Lead, PurchaseOrder, Quote, Supplier } from "@/types";

/* ------------------------------ Devis ------------------------------ */

export const quotes: Quote[] = [
  {
    id: "q-001",
    number: "DEV-2026-0087",
    clientId: "c-05",
    projectName: "Résidence de fonction Nkolo — Bonapriso",
    city: "Douala",
    type: "batiment",
    createdAt: "2026-09-08",
    validUntil: "2026-10-08",
    amountHT: 412_000_000,
    vat: 19.25,
    costPrice: 318_400_000,
    status: "sent",
    version: 2,
    ownerId: "u-07",
    probability: 65,
    lines: [
      { id: "ql-01", lot: "Gros œuvre", designation: "Fondations et infrastructure", unit: "ens", qty: 1, unitPrice: 78_000_000, cost: 61_200_000 },
      { id: "ql-02", lot: "Gros œuvre", designation: "Élévation R+2 béton armé", unit: "m²", qty: 820, unitPrice: 165_000, cost: 128_000 },
      { id: "ql-03", lot: "Second œuvre", designation: "Cloisons, enduits et revêtements", unit: "m²", qty: 820, unitPrice: 96_000, cost: 74_000 },
      { id: "ql-04", lot: "Techniques", designation: "Électricité, plomberie, climatisation", unit: "ens", qty: 1, unitPrice: 68_800_000, cost: 54_600_000 },
      { id: "ql-05", lot: "Extérieurs", designation: "VRD, clôture et paysagement", unit: "ens", qty: 1, unitPrice: 30_000_000, cost: 23_100_000 },
    ],
  },
  {
    id: "q-002",
    number: "DEV-2026-0091",
    clientId: "c-07",
    projectName: "Bloc d'imagerie médicale — Clinique de la Cité",
    city: "Douala",
    type: "batiment",
    createdAt: "2026-09-15",
    validUntil: "2026-10-30",
    amountHT: 268_000_000,
    vat: 19.25,
    costPrice: 206_400_000,
    status: "internal_review",
    version: 1,
    ownerId: "u-07",
    probability: 50,
    lines: [
      { id: "ql-11", lot: "Gros œuvre", designation: "Extension béton armé avec radier lourd", unit: "ens", qty: 1, unitPrice: 112_000_000, cost: 87_400_000 },
      { id: "ql-12", lot: "Techniques", designation: "Protection plombée et fluides médicaux", unit: "ens", qty: 1, unitPrice: 96_000_000, cost: 74_000_000 },
      { id: "ql-13", lot: "Finitions", designation: "Revêtements techniques et menuiseries", unit: "ens", qty: 1, unitPrice: 60_000_000, cost: 45_000_000 },
    ],
  },
  {
    id: "q-003",
    number: "DEV-2026-0079",
    clientId: "c-03",
    projectName: "Avenant piscine et pool-house — Villa Tchinda",
    city: "Douala",
    type: "renovation",
    createdAt: "2026-08-28",
    validUntil: "2026-09-27",
    amountHT: 18_400_000,
    vat: 19.25,
    costPrice: 13_100_000,
    status: "signed",
    version: 1,
    ownerId: "u-03",
    probability: 100,
    lines: [
      { id: "ql-21", lot: "Extérieurs", designation: "Pool-house 24 m² couvert", unit: "ens", qty: 1, unitPrice: 12_400_000, cost: 8_900_000 },
      { id: "ql-22", lot: "Extérieurs", designation: "Local technique et filtration", unit: "ens", qty: 1, unitPrice: 6_000_000, cost: 4_200_000 },
    ],
  },
  {
    id: "q-004",
    number: "DEV-2026-0094",
    clientId: "c-06",
    projectName: "Réhabilitation marché central de Kribi",
    city: "Kribi",
    type: "renovation",
    createdAt: "2026-09-18",
    validUntil: "2026-11-02",
    amountHT: 186_000_000,
    vat: 19.25,
    costPrice: 149_300_000,
    status: "draft",
    version: 1,
    ownerId: "u-07",
    probability: 35,
    lines: [
      { id: "ql-31", lot: "Démolition", designation: "Dépose des halles existantes", unit: "ens", qty: 1, unitPrice: 24_000_000, cost: 19_800_000 },
      { id: "ql-32", lot: "Gros œuvre", designation: "Charpente métallique et couverture", unit: "m²", qty: 1400, unitPrice: 78_000, cost: 63_500 },
      { id: "ql-33", lot: "VRD", designation: "Assainissement et dallage", unit: "ens", qty: 1, unitPrice: 52_800_000, cost: 40_600_000 },
    ],
  },
  {
    id: "q-005",
    number: "DEV-2026-0068",
    clientId: "c-01",
    projectName: "Les Palmiers Phase 2 — 36 logements",
    city: "Douala",
    type: "batiment",
    createdAt: "2026-07-22",
    validUntil: "2026-10-22",
    amountHT: 600_000_000,
    vat: 19.25,
    costPrice: 468_000_000,
    status: "sent",
    version: 3,
    ownerId: "u-07",
    probability: 75,
    lines: [
      { id: "ql-41", lot: "Gros œuvre", designation: "Structure R+3 — 36 logements", unit: "m²", qty: 4200, unitPrice: 82_000, cost: 64_500 },
      { id: "ql-42", lot: "Second œuvre", designation: "Cloisonnement et finitions", unit: "m²", qty: 4200, unitPrice: 41_000, cost: 31_800 },
      { id: "ql-43", lot: "Techniques", designation: "Lots techniques complets", unit: "ens", qty: 1, unitPrice: 83_400_000, cost: 65_000_000 },
    ],
  },
  {
    id: "q-006",
    number: "DEV-2026-0052",
    clientId: "c-08",
    projectName: "Extension entrepôt matières premières",
    city: "Douala",
    type: "industriel",
    createdAt: "2026-06-11",
    validUntil: "2026-08-11",
    amountHT: 342_000_000,
    vat: 19.25,
    costPrice: 261_000_000,
    status: "refused",
    version: 2,
    ownerId: "u-07",
    probability: 0,
    lines: [
      { id: "ql-51", lot: "Génie civil", designation: "Dallage lourd 3 200 m²", unit: "m²", qty: 3200, unitPrice: 48_000, cost: 37_200 },
      { id: "ql-52", lot: "Charpente", designation: "Structure métallique et bardage", unit: "ens", qty: 1, unitPrice: 188_400_000, cost: 142_000_000 },
    ],
  },
];

/* --------------------------- Fournisseurs -------------------------- */

export const suppliers: Supplier[] = [
  { id: "s-01", name: "Cimencam Distribution", category: "Ciment & liants", city: "Douala", country: "Cameroun", contact: "Alain Mbarga", phone: "+237 233 40 12 90", email: "ventes@cimencam-dist.cm", paymentTerms: "30 jours fin de mois", rating: { delay: 4.6, quality: 4.8, price: 3.9 }, ordersCount: 128, volume: 642_000_000, outstanding: 24_600_000, status: "active", certified: true, tone: "bg-brand-700" },
  { id: "s-02", name: "Béton Express Littoral", category: "Béton prêt à l'emploi", city: "Douala", country: "Cameroun", contact: "Félix Owona", phone: "+237 677 21 09 44", email: "commandes@betonexpress.cm", paymentTerms: "30 jours", rating: { delay: 4.2, quality: 4.7, price: 4.1 }, ordersCount: 96, volume: 518_000_000, outstanding: 41_200_000, status: "active", certified: true, tone: "bg-ink-700" },
  { id: "s-03", name: "Carrière de Bingerville", category: "Granulats", city: "Abidjan", country: "Côte d'Ivoire", contact: "Yao Kouamé", phone: "+225 27 22 48 11 03", email: "commercial@carriere-bingerville.ci", paymentTerms: "45 jours", rating: { delay: 3.4, quality: 4.1, price: 4.4 }, ordersCount: 74, volume: 396_000_000, outstanding: 62_400_000, status: "watch", certified: false, tone: "bg-warn-600" },
  { id: "s-04", name: "Préfa Sud Kribi", category: "Préfabriqués béton", city: "Kribi", country: "Cameroun", contact: "Nicole Etoundi", phone: "+237 696 12 34 56", email: "contact@prefasud.cm", paymentTerms: "30 jours", rating: { delay: 4.4, quality: 4.5, price: 4.0 }, ordersCount: 41, volume: 184_000_000, outstanding: 7_680_000, status: "active", certified: true, tone: "bg-ok-600" },
  { id: "s-05", name: "Décor & Matériaux SARL", category: "Revêtements & finitions", city: "Douala", country: "Cameroun", contact: "Josiane Kemajou", phone: "+237 691 88 02 17", email: "j.kemajou@decormateriaux.cm", paymentTerms: "Comptant", rating: { delay: 4.8, quality: 4.4, price: 3.6 }, ordersCount: 63, volume: 142_000_000, outstanding: 0, status: "active", certified: true, tone: "bg-signal-500" },
  { id: "s-06", name: "AluVerre Industries", category: "Menuiserie aluminium", city: "Douala", country: "Cameroun", contact: "Samuel Ngoula", phone: "+237 675 44 21 08", email: "devis@aluverre.cm", paymentTerms: "40 % à la commande", rating: { delay: 3.1, quality: 4.6, price: 3.8 }, ordersCount: 29, volume: 98_000_000, outstanding: 9_600_000, status: "watch", certified: true, tone: "bg-brand-500" },
  { id: "s-07", name: "Aciéries du Wouri", category: "Acier & ferraillage", city: "Douala", country: "Cameroun", contact: "Paul Etame", phone: "+237 233 39 77 21", email: "vente@acieries-wouri.cm", paymentTerms: "60 jours", rating: { delay: 4.5, quality: 4.9, price: 3.7 }, ordersCount: 112, volume: 586_000_000, outstanding: 38_400_000, status: "active", certified: true, tone: "bg-ink-600" },
  { id: "s-08", name: "Pétro Services CM", category: "Carburants & lubrifiants", city: "Douala", country: "Cameroun", contact: "Rachid Bello", phone: "+237 699 02 18 45", email: "b2b@petroservices.cm", paymentTerms: "15 jours", rating: { delay: 4.9, quality: 4.5, price: 3.4 }, ordersCount: 204, volume: 312_000_000, outstanding: 12_800_000, status: "active", certified: true, tone: "bg-risk-600" },
  { id: "s-09", name: "Élec Afrique Travaux", category: "Sous-traitance électricité", city: "Abidjan", country: "Côte d'Ivoire", contact: "Marc Assamoi", phone: "+225 05 77 12 90", email: "m.assamoi@elecafrique.ci", paymentTerms: "30 jours", rating: { delay: 3.8, quality: 4.3, price: 4.2 }, ordersCount: 18, volume: 164_000_000, outstanding: 18_400_000, status: "active", certified: false, tone: "bg-brand-600" },
  { id: "s-10", name: "LocaEngins Afrique", category: "Location de matériel", city: "Douala", country: "Cameroun", contact: "Hervé Nguema", phone: "+237 678 55 00 12", email: "location@locaengins.cm", paymentTerms: "30 jours", rating: { delay: 4.1, quality: 3.9, price: 3.5 }, ordersCount: 87, volume: 268_000_000, outstanding: 13_050_000, status: "active", certified: true, tone: "bg-ok-700" },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: "bc-001", number: "BC-2026-0412", supplierId: "s-07", projectId: "p-01", date: "2026-09-10", expectedDate: "2026-09-24", amount: 6_552_000, status: "delivered", requester: "Jean-Marie Ateba", validator: "Bertrand Essomba", lines: [{ designation: "Acier HA 12 — barres 12 m", qty: 8.4, unit: "t", unitPrice: 780_000 }] },
  { id: "bc-002", number: "BC-2026-0418", supplierId: "s-02", projectId: "p-05", date: "2026-09-14", expectedDate: "2026-09-17", amount: 14_760_000, status: "invoiced", requester: "Hamed Ouédraogo", validator: "Cédric Fotso", lines: [{ designation: "Béton C30/37 pompé", qty: 180, unit: "m³", unitPrice: 82_000 }] },
  { id: "bc-003", number: "BC-2026-0423", supplierId: "s-03", projectId: "p-04", date: "2026-09-16", expectedDate: "2026-09-29", amount: 21_700_000, status: "to_validate", requester: "Kouassi N'Guessan", lines: [{ designation: "Grave concassée 0/31,5", qty: 1400, unit: "t", unitPrice: 15_500 }] },
  { id: "bc-004", number: "BC-2026-0425", supplierId: "s-01", projectId: "p-01", date: "2026-09-17", expectedDate: "2026-09-19", amount: 3_360_000, status: "invoiced", requester: "Jean-Marie Ateba", validator: "Idriss Sanogo", lines: [{ designation: "Ciment CPJ 42.5 — sacs 50 kg", qty: 480, unit: "sac", unitPrice: 7_000 }] },
  { id: "bc-005", number: "BC-2026-0427", supplierId: "s-04", projectId: "p-06", date: "2026-09-13", expectedDate: "2026-09-16", amount: 7_680_000, status: "delivered", requester: "Serge Onana", validator: "Aïcha Diallo", lines: [{ designation: "Buses béton armé Ø800", qty: 64, unit: "ml", unitPrice: 120_000 }] },
  { id: "bc-006", number: "BC-2026-0430", supplierId: "s-10", projectId: "p-01", date: "2026-09-01", expectedDate: "2026-09-01", amount: 8_200_000, status: "invoiced", requester: "Cédric Fotso", validator: "Nadège Tchoumi", lines: [{ designation: "Location grue à tour — mois", qty: 1, unit: "mois", unitPrice: 8_200_000 }] },
  { id: "bc-007", number: "BC-2026-0433", supplierId: "s-06", projectId: "p-03", date: "2026-09-19", expectedDate: "2026-11-07", amount: 16_000_000, status: "validated", requester: "Cédric Fotso", validator: "Sylvie Mballa", lines: [{ designation: "Menuiseries aluminium sur mesure", qty: 1, unit: "ens", unitPrice: 16_000_000 }] },
  { id: "bc-008", number: "BC-2026-0435", supplierId: "s-08", projectId: "p-02", date: "2026-09-20", expectedDate: "2026-09-22", amount: 3_066_000, status: "to_validate", requester: "Patrick Mvondo", lines: [{ designation: "Gasoil — livraison citerne", qty: 4200, unit: "L", unitPrice: 730 }] },
  { id: "bc-009", number: "BC-2026-0437", supplierId: "s-05", projectId: "p-09", date: "2026-09-21", expectedDate: "2026-09-25", amount: 2_940_000, status: "draft", requester: "Éric Tamba", lines: [{ designation: "Peinture époxy sol — kit 20 L", qty: 14, unit: "kit", unitPrice: 210_000 }] },
];

/* ---------------------------- Prospection -------------------------- */

export const leads: Lead[] = [
  { id: "ld-01", company: "Sunshine Properties", contact: "Amina Bello", phone: "+237 677 90 11 22", email: "a.bello@sunshineprop.cm", city: "Douala", source: "Recommandation", need: "Résidence 24 logements haut standing", budget: 780_000_000, probability: 45, stage: "etude", ownerId: "u-07", createdAt: "2026-08-12", nextAction: "Restitution de l'étude de faisabilité", nextActionDate: "2026-09-25", tone: "bg-brand-600" },
  { id: "ld-02", company: "M. Kouam (diaspora Canada)", contact: "Vincent Kouam", phone: "+1 514 220 88 41", email: "v.kouam@outlook.com", city: "Yaoundé", source: "Diaspora", need: "Villa R+1 avec suivi à distance", budget: 145_000_000, probability: 70, stage: "devis", ownerId: "u-07", createdAt: "2026-08-29", nextAction: "Relance après envoi du devis", nextActionDate: "2026-09-23", tone: "bg-signal-500" },
  { id: "ld-03", company: "SODECI Infrastructures", contact: "Kader Traoré", phone: "+225 27 21 03 44 10", email: "k.traore@sodeci-infra.ci", city: "Abidjan", source: "Appel d'offres", need: "Réseau d'adduction d'eau — 18 km", budget: 1_640_000_000, probability: 30, stage: "negociation", ownerId: "u-04", createdAt: "2026-07-04", nextAction: "Audition technique devant la commission", nextActionDate: "2026-10-02", tone: "bg-ok-600" },
  { id: "ld-04", company: "Hôtel Bella Vista", contact: "Sandrine Mefo", phone: "+237 694 12 00 55", email: "direction@bellavista.cm", city: "Kribi", source: "Site web", need: "Rénovation de 40 chambres et lobby", budget: 320_000_000, probability: 25, stage: "visite", ownerId: "u-07", createdAt: "2026-09-09", nextAction: "Visite technique sur site", nextActionDate: "2026-09-26", tone: "bg-warn-600" },
  { id: "ld-05", company: "Coopérative Agro Nkongsamba", contact: "Pierre Fouda", phone: "+237 675 33 21 08", email: "p.fouda@agronkong.cm", city: "Nkongsamba", source: "Terrain", need: "Hangar de stockage 1 800 m²", budget: 268_000_000, probability: 20, stage: "prospect", ownerId: "u-07", createdAt: "2026-09-17", nextAction: "Qualification du besoin par téléphone", nextActionDate: "2026-09-24", tone: "bg-ink-600" },
  { id: "ld-06", company: "Groupe Nkolo Holding", contact: "Serge Nkolo", phone: "+237 677 90 12 34", email: "s.nkolo@nkoloholding.com", city: "Douala", source: "Recommandation", need: "Résidence de fonction Bonapriso", budget: 412_000_000, probability: 65, stage: "negociation", ownerId: "u-07", createdAt: "2026-08-01", nextAction: "Négociation finale des conditions de paiement", nextActionDate: "2026-09-29", tone: "bg-brand-500" },
  { id: "ld-07", company: "Clinique de la Cité", contact: "Dr. Estelle Njike", phone: "+237 694 55 21 60", email: "direction@cliniquecite.cm", city: "Douala", source: "Recommandation", need: "Bloc d'imagerie médicale", budget: 268_000_000, probability: 50, stage: "devis", ownerId: "u-07", createdAt: "2026-09-02", nextAction: "Validation interne du devis avant envoi", nextActionDate: "2026-09-24", tone: "bg-risk-600" },
  { id: "ld-08", company: "Mairie de Buea", contact: "Ernest Fru", phone: "+237 233 32 21 09", email: "technique@mairiebuea.cm", city: "Buea", source: "Appel d'offres", need: "Voirie communale 6 km", budget: 540_000_000, probability: 15, stage: "prospect", ownerId: "u-04", createdAt: "2026-09-15", nextAction: "Retrait du dossier d'appel d'offres", nextActionDate: "2026-09-30", tone: "bg-ink-700" },
  { id: "ld-09", company: "Immobilière du Wouri", contact: "Carine Manga", phone: "+237 699 45 12 78", email: "c.manga@immowouri.cm", city: "Douala", source: "Salon", need: "Immeuble mixte commerce + bureaux", budget: 920_000_000, probability: 35, stage: "etude", ownerId: "u-07", createdAt: "2026-08-20", nextAction: "Chiffrage préliminaire", nextActionDate: "2026-10-05", tone: "bg-brand-800" },
  { id: "ld-10", company: "SCI Les Palmiers", contact: "Georges Ewane", phone: "+237 699 12 45 78", email: "g.ewane@lespalmiers.cm", city: "Douala", source: "Recommandation", need: "Phase 2 — 36 logements", budget: 600_000_000, probability: 75, stage: "negociation", ownerId: "u-07", createdAt: "2026-07-22", nextAction: "Arbitrage sur le planning de démarrage", nextActionDate: "2026-09-28", tone: "bg-ok-700" },
  { id: "ld-11", company: "Brasseries Réunies du Littoral", contact: "Hervé Moukoko", phone: "+237 233 42 88 00", email: "h.moukoko@brl-cm.com", city: "Douala", source: "Recommandation", need: "Extension entrepôt matières premières", budget: 342_000_000, probability: 0, stage: "perdu", ownerId: "u-07", createdAt: "2026-06-11", nextAction: "Débriefing perte — prix 8 % au-dessus", nextActionDate: "2026-09-22", tone: "bg-ink-500" },
  { id: "ld-12", company: "M. et Mme Tchinda", contact: "Valérie Tchinda", phone: "+33 6 42 18 77 09", email: "valerie.tchinda@gmail.com", city: "Douala", source: "Diaspora", need: "Avenant piscine et pool-house", budget: 18_400_000, probability: 100, stage: "gagne", ownerId: "u-03", createdAt: "2026-08-28", nextAction: "Intégration de l'avenant au planning", nextActionDate: "2026-09-22", tone: "bg-signal-600" },
];

export const pipelineStages = [
  { id: "prospect", label: "Prospect" },
  { id: "visite", label: "Visite" },
  { id: "etude", label: "Étude" },
  { id: "devis", label: "Devis envoyé" },
  { id: "negociation", label: "Négociation" },
  { id: "gagne", label: "Gagné" },
  { id: "perdu", label: "Perdu" },
] as const;

export const conversionFunnel = [
  { stage: "Prospects", value: 148 },
  { stage: "Visites", value: 96 },
  { stage: "Études", value: 61 },
  { stage: "Devis", value: 42 },
  { stage: "Négociation", value: 24 },
  { stage: "Gagnés", value: 14 },
];

export function supplierById(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}

export function quoteById(id: string): Quote | undefined {
  return quotes.find((q) => q.id === id);
}
