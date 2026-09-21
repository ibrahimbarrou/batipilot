import type { ActivityItem, AlertItem, Channel, DocumentItem, Message } from "@/types";

export const alerts: AlertItem[] = [
  {
    id: "al-01",
    severity: "critical",
    title: "Voirie Yopougon — dérive planning de 17 points",
    detail: "Avancement réel 38 % contre 55 % prévus. Fin projetée au 28 mai 2027, soit 179 jours de retard.",
    projectId: "p-04",
    at: "2026-09-21 07:40",
    cta: "Ouvrir le plan de rattrapage",
    href: "/projets/p-04",
  },
  {
    id: "al-02",
    severity: "critical",
    title: "372 M FCFA de factures échues depuis plus de 30 jours",
    detail: "AGEROUTE (232 M) et MINTP (186 M) : relances envoyées, aucun règlement reçu.",
    at: "2026-09-21 07:40",
    cta: "Voir le recouvrement",
    href: "/finance/factures",
  },
  {
    id: "al-03",
    severity: "warning",
    title: "Lot second œuvre — Les Palmiers à 86 % du budget",
    detail: "Consommé 94,3 M sur 109,2 M engagés alors que l'avancement du lot est à 38 %.",
    projectId: "p-01",
    at: "2026-09-21 06:15",
    cta: "Analyser le lot",
    href: "/projets/p-01",
  },
  {
    id: "al-04",
    severity: "warning",
    title: "Rupture de stock imminente — acier HA 12",
    detail: "4,2 t en stock pour un seuil de 6 t. Consommation hebdomadaire moyenne : 3,4 t.",
    at: "2026-09-21 05:30",
    cta: "Lancer une commande",
    href: "/materiel",
  },
  {
    id: "al-05",
    severity: "warning",
    title: "2 bons de commande en attente de validation",
    detail: "BC-2026-0423 (21,7 M) et BC-2026-0435 (3,1 M) dépassent le seuil de délégation.",
    at: "2026-09-20 17:02",
    cta: "Valider les commandes",
    href: "/fournisseurs",
  },
  {
    id: "al-06",
    severity: "info",
    title: "Rapport journalier non saisi — Extension Clinique",
    detail: "Aucun rapport enregistré après 18 h pour le chantier DLA-2026-011.",
    projectId: "p-07",
    at: "2026-09-20 18:00",
    cta: "Relancer le chef de chantier",
    href: "/chantiers",
  },
  {
    id: "al-07",
    severity: "info",
    title: "Devis DEV-2026-0068 expire dans 31 jours",
    detail: "Les Palmiers Phase 2 — 600 M FCFA, probabilité 75 %.",
    at: "2026-09-20 09:12",
    cta: "Relancer le client",
    href: "/devis",
  },
];

export const activities: ActivityItem[] = [
  { id: "ac-01", at: "2026-09-21 16:42", actor: "Jean-Marie Ateba", action: "a publié le rapport journalier", target: "Les Palmiers — 21/09", projectId: "p-01", kind: "chantier" },
  { id: "ac-02", at: "2026-09-21 15:58", actor: "Nadège Tchoumi", action: "a validé le paiement fournisseur", target: "BET-2026-2210 — 14,8 M FCFA", kind: "finance" },
  { id: "ac-03", at: "2026-09-21 14:20", actor: "Salif Coulibaly", action: "a déclaré un incident grave", target: "Réseau CIE non répertorié — PK 3+200", projectId: "p-04", kind: "chantier" },
  { id: "ac-04", at: "2026-09-21 12:05", actor: "Valérie Tchinda", action: "a commenté une photo depuis le portail client", target: "Enduits étage — chambre 2", projectId: "p-03", kind: "client" },
  { id: "ac-05", at: "2026-09-21 11:14", actor: "Pascal Ondoa", action: "a fait passer une opportunité en négociation", target: "Résidence de fonction Nkolo — 412 M", kind: "commercial" },
  { id: "ac-06", at: "2026-09-21 10:32", actor: "Idriss Sanogo", action: "a émis un bon de commande", target: "BC-2026-0437 — Décor & Matériaux", kind: "achat" },
  { id: "ac-07", at: "2026-09-21 09:47", actor: "Cédric Fotso", action: "a publié le rapport hebdomadaire client", target: "Villa Tchinda — semaine 38", projectId: "p-03", kind: "client" },
  { id: "ac-08", at: "2026-09-21 08:30", actor: "Aminata Bamba", action: "a clôturé une fiche sécurité", target: "Causerie EPI — chantier Yopougon", projectId: "p-04", kind: "rh" },
  { id: "ac-09", at: "2026-09-20 18:22", actor: "Hamed Ouédraogo", action: "a mis à jour l'avancement", target: "Terrassement en taupe — 44 %", projectId: "p-05", kind: "chantier" },
  { id: "ac-10", at: "2026-09-20 17:02", actor: "Kouassi N'Guessan", action: "a soumis une demande d'achat", target: "Grave concassée — 1 400 t", projectId: "p-04", kind: "achat" },
  { id: "ac-11", at: "2026-09-20 15:40", actor: "Marthe Ngo Bell", action: "a rapproché une facture fournisseur", target: "CIM-2026-8841 — Cimencam", kind: "finance" },
  { id: "ac-12", at: "2026-09-20 14:11", actor: "Sylvie Mballa", action: "a déposé un plan en indice C", target: "Coffrage niveau 4 — bât. A", projectId: "p-01", kind: "doc" },
  { id: "ac-13", at: "2026-09-20 11:35", actor: "Serge Nkolo", action: "a validé la situation n°4", target: "Siège Nkolo Holding — 210 M", projectId: "p-05", kind: "client" },
  { id: "ac-14", at: "2026-09-19 16:50", actor: "Yves Kamga", action: "a transféré un engin", target: "Nacelle 16 m → Entrepôt Bassa", kind: "chantier" },
];

export const channels: Channel[] = [
  { id: "ch-01", name: "Les Palmiers — coordination", kind: "project", projectId: "p-01", members: 9, unread: 3, lastAt: "2026-09-21 16:48", preview: "Jean-Marie : la livraison béton de demain est confirmée pour 7h." },
  { id: "ch-02", name: "Yopougon — cellule de crise", kind: "project", projectId: "p-04", members: 6, unread: 7, lastAt: "2026-09-21 16:12", preview: "Aïcha : réunion avec la CIE calée jeudi 10h, ordre du jour en pièce jointe." },
  { id: "ch-03", name: "Mme Tchinda — Villa Japoma", kind: "client", projectId: "p-03", members: 3, unread: 1, lastAt: "2026-09-21 12:05", preview: "Valérie : superbe, merci ! On valide la faïence proposée." },
  { id: "ch-04", name: "Direction & chefs de projet", kind: "team", members: 7, unread: 0, lastAt: "2026-09-21 09:20", preview: "Armand : revue de portefeuille lundi 8h, chacun prépare ses 3 alertes." },
  { id: "ch-05", name: "Nadège Tchoumi", kind: "direct", members: 2, unread: 2, lastAt: "2026-09-21 15:58", preview: "Nadège : j'ai besoin de ton arbitrage sur l'affacturage AGEROUTE." },
  { id: "ch-06", name: "Siège Nkolo — technique", kind: "project", projectId: "p-05", members: 8, unread: 0, lastAt: "2026-09-20 18:30", preview: "Christelle : note de calcul du rabattement mise à jour, indice B." },
  { id: "ch-07", name: "Achats & logistique", kind: "team", members: 5, unread: 0, lastAt: "2026-09-20 17:10", preview: "Idriss : Cimencam confirme le prix cadre jusqu'à décembre." },
];

export const messages: Message[] = [
  { id: "ms-01", channelId: "ch-01", author: "Cédric Fotso", initials: "CF", tone: "bg-ok-600", at: "2026-09-21 15:02", body: "Point sur le niveau 4 bât. A : les banches sont en place, on peut couler jeudi si le béton arrive à l'heure." },
  { id: "ms-02", channelId: "ch-01", author: "Idriss Sanogo", initials: "IS", tone: "bg-ink-600", at: "2026-09-21 15:18", body: "Commande passée chez Béton Express, 68 m³ de C25/30 pour jeudi 7h. Confirmation écrite reçue." },
  { id: "ms-03", channelId: "ch-01", author: "Jean-Marie Ateba", initials: "JA", tone: "bg-brand-700", at: "2026-09-21 16:48", body: "Parfait. J'ai prévu 6 personnes au coulage et le vibreur de secours est sur place.", attachments: ["planning-coulage-N4.pdf"] },
  { id: "ms-04", channelId: "ch-01", author: "Armand Nkodo", initials: "AN", tone: "bg-brand-800", at: "2026-09-21 16:52", body: "Très bien. Pensez à prendre les photos avant/après pour le rapport client de vendredi.", own: true },

  { id: "ms-05", channelId: "ch-02", author: "Salif Coulibaly", initials: "SC", tone: "bg-signal-600", at: "2026-09-21 14:20", body: "Câble MT découvert au PK 3+200, travaux arrêtés sur 80 ml. J'ai balisé la zone et prévenu la CIE." },
  { id: "ms-06", channelId: "ch-02", author: "Aïcha Diallo", initials: "AD", tone: "bg-brand-500", at: "2026-09-21 16:12", body: "Réunion CIE jeudi 10h. Je prépare une demande de sujétions imprévues, impact estimé à 6 jours et 14 M FCFA." },

  { id: "ms-07", channelId: "ch-03", author: "Cédric Fotso", initials: "CF", tone: "bg-ok-600", at: "2026-09-21 09:47", body: "Bonjour Madame Tchinda, le rapport de la semaine 38 est publié avec 9 nouvelles photos de l'étage." },
  { id: "ms-08", channelId: "ch-03", author: "Valérie Tchinda", initials: "VT", tone: "bg-signal-500", at: "2026-09-21 12:05", body: "Superbe, merci ! On valide la faïence proposée pour la salle de bain 1. Quand prévoyez-vous la pose ?" },
];

export const documents: DocumentItem[] = [
  { id: "doc-01", name: "Plan de coffrage niveau 4 — bât. A", category: "Plans", projectId: "p-01", format: "DWG", size: "4,2 Mo", version: "Ind. C", updatedAt: "2026-09-20", author: "Sylvie Mballa", shared: ["Interne", "Sous-traitant"] },
  { id: "doc-02", name: "Marché de travaux — Les Palmiers", category: "Contrats", projectId: "p-01", format: "PDF", size: "1,8 Mo", version: "v1", updatedAt: "2025-08-28", author: "Pauline Ngassa", shared: ["Interne", "Client"] },
  { id: "doc-03", name: "Rapport hebdomadaire S38 — Villa Tchinda", category: "Rapports", projectId: "p-03", format: "PDF", size: "6,4 Mo", version: "v1", updatedAt: "2026-09-21", author: "Cédric Fotso", shared: ["Interne", "Client"] },
  { id: "doc-04", name: "PV de réception provisoire — Entrepôt Bassa", category: "PV", projectId: "p-09", format: "PDF", size: "920 Ko", version: "v2", updatedAt: "2026-09-18", author: "Cédric Fotso", shared: ["Interne", "Client"] },
  { id: "doc-05", name: "Attestation d'assurance décennale 2026", category: "Administratif", format: "PDF", size: "640 Ko", version: "v1", updatedAt: "2026-01-15", author: "Pauline Ngassa", shared: ["Interne"], expiresAt: "2026-12-31" },
  { id: "doc-06", name: "Attestation fiscale — 3e trimestre", category: "Administratif", format: "PDF", size: "380 Ko", version: "v1", updatedAt: "2026-07-08", author: "Marthe Ngo Bell", shared: ["Interne"], expiresAt: "2026-10-08" },
  { id: "doc-07", name: "Plan d'exécution collecteur tronçon 2", category: "Plans", projectId: "p-06", format: "DWG", size: "3,1 Mo", version: "Ind. B", updatedAt: "2026-08-30", author: "Franck Ekedi", shared: ["Interne"] },
  { id: "doc-08", name: "Situation n°9 — Les Palmiers", category: "Factures", projectId: "p-01", format: "PDF", size: "740 Ko", version: "v1", updatedAt: "2026-09-05", author: "Marthe Ngo Bell", shared: ["Interne", "Client"] },
  { id: "doc-09", name: "Note de calcul rabattement de nappe", category: "Rapports", projectId: "p-05", format: "PDF", size: "2,6 Mo", version: "Ind. B", updatedAt: "2026-09-20", author: "Christelle Abena", shared: ["Interne"] },
  { id: "doc-10", name: "Métré quantitatif — Phase 2", category: "Rapports", projectId: "p-08", format: "XLSX", size: "1,2 Mo", version: "v4", updatedAt: "2026-09-12", author: "Christelle Abena", shared: ["Interne"] },
  { id: "doc-11", name: "Contrat de sous-traitance — Élec Afrique", category: "Contrats", projectId: "p-04", format: "PDF", size: "1,1 Mo", version: "v1", updatedAt: "2026-06-24", author: "Aïcha Diallo", shared: ["Interne", "Sous-traitant"] },
  { id: "doc-12", name: "Plan de masse — Villa Tchinda", category: "Plans", projectId: "p-03", format: "PDF", size: "2,2 Mo", version: "Ind. A", updatedAt: "2025-10-30", author: "Sylvie Mballa", shared: ["Interne", "Client"] },
  { id: "doc-13", name: "Rapport d'audit sécurité — Yopougon", category: "Rapports", projectId: "p-04", format: "PDF", size: "3,4 Mo", version: "v1", updatedAt: "2026-09-14", author: "Aminata Bamba", shared: ["Interne"] },
  { id: "doc-14", name: "Photos réception quai 2", category: "PV", projectId: "p-09", format: "JPG", size: "18,6 Mo", version: "v1", updatedAt: "2026-09-19", author: "Éric Tamba", shared: ["Interne", "Client"] },
];

export const notifications = [
  { id: "n-01", title: "Incident grave déclaré", body: "Yopougon — réseau CIE non répertorié", at: "2026-09-21 14:20", unread: true, kind: "critical" as const },
  { id: "n-02", title: "Validation requise", body: "BC-2026-0423 — 21,7 M FCFA", at: "2026-09-21 10:32", unread: true, kind: "warning" as const },
  { id: "n-03", title: "Paiement validé", body: "Béton Express — 14,8 M FCFA", at: "2026-09-21 15:58", unread: true, kind: "info" as const },
  { id: "n-04", title: "Message client", body: "Valérie Tchinda a répondu sur le portail", at: "2026-09-21 12:05", unread: false, kind: "info" as const },
  { id: "n-05", title: "Rapport publié", body: "Les Palmiers — rapport du 21/09", at: "2026-09-21 16:42", unread: false, kind: "info" as const },
];
