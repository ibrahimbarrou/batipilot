import type { Asset, StockItem } from "@/types";

export const assets: Asset[] = [
  { id: "a-01", code: "GT-01", name: "Grue à tour Potain MDT 219", family: "Engin", brand: "Potain", status: "in_service", projectId: "p-01", location: "Bonapriso, Douala", hours: 4820, nextMaintenance: "2026-10-15", dailyCost: 273_000, acquisitionValue: 186_000_000, owner: "Location" },
  { id: "a-02", code: "PEL-320", name: "Pelle hydraulique CAT 320", family: "Engin", brand: "Caterpillar", status: "maintenance", projectId: "p-02", location: "Atelier Yaoundé", hours: 11240, nextMaintenance: "2026-09-26", dailyCost: 148_000, acquisitionValue: 92_000_000, owner: "Propriété" },
  { id: "a-03", code: "NIV-140", name: "Niveleuse CAT 140K", family: "Engin", brand: "Caterpillar", status: "in_service", projectId: "p-04", location: "Yopougon, Abidjan", hours: 8760, nextMaintenance: "2026-11-04", dailyCost: 182_000, acquisitionValue: 124_000_000, owner: "Location" },
  { id: "a-04", code: "COM-V5", name: "Compacteur vibrant Bomag BW 213", family: "Engin", brand: "Bomag", status: "in_service", projectId: "p-02", location: "PK 4, axe Nsimalen", hours: 6410, nextMaintenance: "2026-10-28", dailyCost: 96_000, acquisitionValue: 58_000_000, owner: "Propriété" },
  { id: "a-05", code: "FOR-BG28", name: "Foreuse Bauer BG 28", family: "Engin", brand: "Bauer", status: "in_service", projectId: "p-05", location: "Akwa, Douala", hours: 2980, nextMaintenance: "2026-12-02", dailyCost: 412_000, acquisitionValue: 320_000_000, owner: "Location" },
  { id: "a-06", code: "BEN-04", name: "Camion benne Mercedes Actros", family: "Véhicule", brand: "Mercedes-Benz", status: "in_service", projectId: "p-04", location: "Yopougon, Abidjan", hours: 18400, nextMaintenance: "2026-10-09", dailyCost: 74_000, acquisitionValue: 46_000_000, owner: "Propriété" },
  { id: "a-07", code: "BEN-05", name: "Camion benne Renault Kerax", family: "Véhicule", brand: "Renault Trucks", status: "broken", location: "Atelier Douala", hours: 24100, nextMaintenance: "2026-09-24", dailyCost: 0, acquisitionValue: 38_000_000, owner: "Propriété" },
  { id: "a-08", code: "PMP-01", name: "Pompe à béton Putzmeister 36 m", family: "Engin", brand: "Putzmeister", status: "idle", location: "Dépôt Bassa", hours: 5210, nextMaintenance: "2026-11-18", dailyCost: 214_000, acquisitionValue: 148_000_000, owner: "Propriété" },
  { id: "a-09", code: "GEN-250", name: "Groupe électrogène 250 kVA", family: "Engin", brand: "SDMO", status: "in_service", projectId: "p-05", location: "Akwa, Douala", hours: 3640, nextMaintenance: "2026-10-20", dailyCost: 42_000, acquisitionValue: 28_000_000, owner: "Propriété" },
  { id: "a-10", code: "NAC-16", name: "Nacelle élévatrice 16 m", family: "Engin", brand: "Haulotte", status: "in_service", projectId: "p-09", location: "Zone Bassa, Douala", hours: 1980, nextMaintenance: "2026-12-11", dailyCost: 58_000, acquisitionValue: 32_000_000, owner: "Location" },
  { id: "a-11", code: "TOP-S9", name: "Station totale Leica TS09", family: "Mesure", brand: "Leica", status: "in_service", projectId: "p-06", location: "Kribi centre", hours: 0, nextMaintenance: "2027-03-01", dailyCost: 12_000, acquisitionValue: 9_800_000, owner: "Propriété" },
  { id: "a-12", code: "COF-B48", name: "Lot banches 48 panneaux", family: "Coffrage", brand: "Peri", status: "in_service", projectId: "p-01", location: "Bonapriso, Douala", hours: 0, nextMaintenance: "2027-01-15", dailyCost: 96_000, acquisitionValue: 74_000_000, owner: "Location" },
  { id: "a-13", code: "VIB-SET", name: "Lot vibreurs à béton (8 u)", family: "Outillage", brand: "Wacker Neuson", status: "in_service", projectId: "p-01", location: "Bonapriso, Douala", hours: 0, nextMaintenance: "2026-11-30", dailyCost: 8_000, acquisitionValue: 4_200_000, owner: "Propriété" },
  { id: "a-14", code: "PICK-12", name: "Pick-up Toyota Hilux", family: "Véhicule", brand: "Toyota", status: "rented_out", location: "Agence Kribi", hours: 96400, nextMaintenance: "2026-10-30", dailyCost: 32_000, acquisitionValue: 26_000_000, owner: "Propriété" },
];

export const stock: StockItem[] = [
  { id: "st-01", ref: "CIM-425", label: "Ciment CPJ 42.5 — sac 50 kg", unit: "sac", warehouse: "Dépôt Bassa", qty: 640, minQty: 400, unitCost: 7_000, category: "Liants", lastMove: "2026-09-19" },
  { id: "st-02", ref: "ACR-HA12", label: "Acier HA 12 — barre 12 m", unit: "t", warehouse: "Dépôt Bassa", qty: 4.2, minQty: 6, unitCost: 780_000, category: "Acier", lastMove: "2026-09-20" },
  { id: "st-03", ref: "ACR-HA10", label: "Acier HA 10 — barre 12 m", unit: "t", warehouse: "Dépôt Bassa", qty: 7.8, minQty: 5, unitCost: 765_000, category: "Acier", lastMove: "2026-09-18" },
  { id: "st-04", ref: "GRV-0315", label: "Grave concassée 0/31,5", unit: "t", warehouse: "Chantier Yopougon", qty: 184, minQty: 250, unitCost: 15_500, category: "Granulats", lastMove: "2026-09-21" },
  { id: "st-05", ref: "SAB-002", label: "Sable de rivière lavé", unit: "m³", warehouse: "Chantier Bonapriso", qty: 96, minQty: 60, unitCost: 12_000, category: "Granulats", lastMove: "2026-09-20" },
  { id: "st-06", ref: "BUS-800", label: "Buse béton armé Ø800", unit: "ml", warehouse: "Chantier Kribi", qty: 48, minQty: 30, unitCost: 120_000, category: "Préfabriqué", lastMove: "2026-09-16" },
  { id: "st-07", ref: "GAI-ICTA", label: "Gaine ICTA Ø20 — couronne 100 m", unit: "u", warehouse: "Dépôt Bassa", qty: 28, minQty: 40, unitCost: 18_500, category: "Électricité", lastMove: "2026-09-21" },
  { id: "st-08", ref: "PEI-EPX", label: "Peinture époxy sol — kit 20 L", unit: "kit", warehouse: "Dépôt Bassa", qty: 6, minQty: 10, unitCost: 210_000, category: "Finitions", lastMove: "2026-09-12" },
  { id: "st-09", ref: "CAR-6060", label: "Carrelage grès cérame 60×60", unit: "m²", warehouse: "Chantier Japoma", qty: 240, minQty: 100, unitCost: 13_000, category: "Finitions", lastMove: "2026-09-16" },
  { id: "st-10", ref: "GAS-001", label: "Gasoil — cuve de chantier", unit: "L", warehouse: "Chantier Nsimalen", qty: 2_840, minQty: 2_000, unitCost: 730, category: "Carburant", lastMove: "2026-09-17" },
  { id: "st-11", ref: "EPI-CAS", label: "Casque de chantier certifié", unit: "u", warehouse: "Dépôt Bassa", qty: 84, minQty: 60, unitCost: 8_500, category: "EPI", lastMove: "2026-09-15" },
  { id: "st-12", ref: "EPI-GIL", label: "Gilet haute visibilité", unit: "u", warehouse: "Dépôt Bassa", qty: 42, minQty: 80, unitCost: 4_200, category: "EPI", lastMove: "2026-09-19" },
];

export const maintenancePlan = [
  { assetId: "a-02", label: "Révision 11 000 h — boîte de transfert", date: "2026-09-26", cost: 4_850_000, status: "En cours" },
  { assetId: "a-07", label: "Diagnostic moteur — immobilisation", date: "2026-09-24", cost: 6_200_000, status: "À planifier" },
  { assetId: "a-06", label: "Vidange & freins", date: "2026-10-09", cost: 820_000, status: "Planifié" },
  { assetId: "a-01", label: "Contrôle réglementaire grue", date: "2026-10-15", cost: 1_400_000, status: "Planifié" },
  { assetId: "a-09", label: "Entretien 4 000 h", date: "2026-10-20", cost: 640_000, status: "Planifié" },
  { assetId: "a-04", label: "Révision hydraulique", date: "2026-10-28", cost: 2_100_000, status: "Planifié" },
];

export const stockMovements = [
  { id: "mv-01", date: "2026-09-21", ref: "GAI-ICTA", label: "Sortie chantier Les Palmiers", qty: -12, unit: "u", by: "Grâce Nnomo" },
  { id: "mv-02", date: "2026-09-21", ref: "GRV-0315", label: "Consommation couche de forme", qty: -84, unit: "t", by: "Kouassi N'Guessan" },
  { id: "mv-03", date: "2026-09-20", ref: "ACR-HA12", label: "Sortie ferraillage niveau 4", qty: -1.8, unit: "t", by: "Jean-Marie Ateba" },
  { id: "mv-04", date: "2026-09-19", ref: "CIM-425", label: "Réception BC-2026-0425", qty: 480, unit: "sac", by: "Grâce Nnomo" },
  { id: "mv-05", date: "2026-09-19", ref: "EPI-GIL", label: "Dotation nouveaux journaliers", qty: -18, unit: "u", by: "Aminata Bamba" },
  { id: "mv-06", date: "2026-09-18", ref: "SAB-002", label: "Transfert vers chantier Japoma", qty: -24, unit: "m³", by: "Yves Kamga" },
];
