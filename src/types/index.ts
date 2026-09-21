/* ============================================================
   PILOTIS — Modèle de domaine
   Typage strict, partagé par toute l'application.
   ============================================================ */

export type Currency = "XAF" | "XOF" | "EUR" | "NGN" | "KES";

export type HealthStatus = "on_track" | "at_risk" | "critical" | "not_started";

export type ProjectStage =
  | "prospection"
  | "etude"
  | "preparation"
  | "execution"
  | "reception"
  | "garantie"
  | "cloture";

export type ProjectType =
  | "batiment"
  | "route"
  | "vrd"
  | "renovation"
  | "genie_civil"
  | "industriel";

export type RoleId =
  | "dg"
  | "chef_entreprise"
  | "directeur_technique"
  | "chef_projet"
  | "conducteur"
  | "chef_chantier"
  | "comptable"
  | "resp_financier"
  | "resp_commercial"
  | "resp_logistique"
  | "resp_achats"
  | "client";

export interface Role {
  id: RoleId;
  label: string;
  short: string;
  scope: "Direction" | "Opérations" | "Finance" | "Commerce" | "Externe";
  description: string;
  landing: string;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  roleId: RoleId;
  email: string;
  phone: string;
  avatarTone: string;
  agency: string;
}

export interface Client {
  id: string;
  name: string;
  type: "Particulier" | "Promoteur" | "Public" | "Entreprise" | "Diaspora";
  contact: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  since: string;
  projectIds: string[];
  totalContracted: number;
  totalPaid: number;
  satisfaction: number;
  tone: string;
}

export interface Milestone {
  id: string;
  label: string;
  date: string;
  amount?: number;
  status: "done" | "current" | "todo" | "late";
}

export interface Lot {
  id: string;
  name: string;
  budget: number;
  committed: number;
  spent: number;
  progress: number;
  lead: string;
  status: HealthStatus;
}

export interface Task {
  id: string;
  name: string;
  lotId: string;
  start: string;
  end: string;
  progress: number;
  assignee: string;
  dependsOn?: string[];
  critical?: boolean;
}

export interface RiskItem {
  id: string;
  label: string;
  probability: "Faible" | "Moyenne" | "Élevée";
  impact: "Faible" | "Moyen" | "Élevé" | "Critique";
  mitigation: string;
  owner: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientId: string;
  type: ProjectType;
  stage: ProjectStage;
  health: HealthStatus;
  city: string;
  country: string;
  address: string;
  coords: { lat: number; lng: number };
  /** Position relative sur la carte du portefeuille (0-100) */
  map: { x: number; y: number };
  contractAmount: number;
  budget: number;
  committed: number;
  spent: number;
  invoiced: number;
  collected: number;
  currency: Currency;
  progress: number;
  plannedProgress: number;
  startDate: string;
  endDate: string;
  forecastEndDate: string;
  managerId: string;
  teamIds: string[];
  supplierIds: string[];
  surface: number;
  lots: Lot[];
  tasks: Task[];
  milestones: Milestone[];
  risks: RiskItem[];
  tags: string[];
  description: string;
}

export interface SiteReport {
  id: string;
  projectId: string;
  date: string;
  author: string;
  weather: "Ensoleillé" | "Nuageux" | "Pluie" | "Orage" | "Harmattan";
  temperature: number;
  headcount: number;
  hoursWorked: number;
  tasksDone: string[];
  materialsUsed: { label: string; qty: number; unit: string }[];
  equipment: string[];
  observations: string;
  photos: number;
  incidents: number;
  status: "published" | "draft" | "synced_offline";
  progressDelta: number;
}

export interface Incident {
  id: string;
  projectId: string;
  date: string;
  type: "Accident" | "Casse" | "Vol" | "Retard fournisseur" | "Météo" | "Qualité";
  severity: "Mineur" | "Modéré" | "Grave" | "Critique";
  title: string;
  description: string;
  reporter: string;
  assignee: string;
  status: "open" | "in_progress" | "closed";
  impactDays: number;
}

export interface Expense {
  id: string;
  projectId: string;
  date: string;
  label: string;
  category: "Main-d'oeuvre" | "Matériaux" | "Matériel" | "Sous-traitance" | "Frais généraux";
  lotId: string;
  amount: number;
  supplierId?: string;
  status: "validated" | "pending" | "rejected";
  paymentMethod: "Mobile Money" | "Virement" | "Espèces" | "Chèque";
  hasReceipt: boolean;
  author: string;
}

export interface Invoice {
  id: string;
  number: string;
  projectId: string;
  clientId: string;
  type: "Situation" | "Acompte" | "Solde" | "Avenant";
  issueDate: string;
  dueDate: string;
  amount: number;
  paid: number;
  status: "draft" | "sent" | "partial" | "paid" | "overdue";
  retention: number;
  label: string;
}

export interface SupplierInvoice {
  id: string;
  number: string;
  supplierId: string;
  projectId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "to_match" | "matched" | "validated" | "paid";
  orderId?: string;
}

export interface QuoteLine {
  id: string;
  lot: string;
  designation: string;
  unit: string;
  qty: number;
  unitPrice: number;
  cost: number;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  projectName: string;
  city: string;
  type: ProjectType;
  createdAt: string;
  validUntil: string;
  amountHT: number;
  vat: number;
  costPrice: number;
  status: "draft" | "internal_review" | "sent" | "signed" | "refused" | "expired";
  version: number;
  ownerId: string;
  lines: QuoteLine[];
  probability: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  city: string;
  country: string;
  contact: string;
  phone: string;
  email: string;
  paymentTerms: string;
  rating: { delay: number; quality: number; price: number };
  ordersCount: number;
  volume: number;
  outstanding: number;
  status: "active" | "watch" | "blocked";
  certified: boolean;
  tone: string;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  projectId: string;
  date: string;
  expectedDate: string;
  amount: number;
  status: "draft" | "to_validate" | "validated" | "delivered" | "invoiced";
  lines: { designation: string; qty: number; unit: string; unitPrice: number }[];
  requester: string;
  validator?: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  family: "Engin" | "Véhicule" | "Outillage" | "Coffrage" | "Mesure";
  brand: string;
  status: "in_service" | "maintenance" | "idle" | "rented_out" | "broken";
  projectId?: string;
  location: string;
  hours: number;
  nextMaintenance: string;
  dailyCost: number;
  acquisitionValue: number;
  owner: "Propriété" | "Location";
}

export interface StockItem {
  id: string;
  ref: string;
  label: string;
  unit: string;
  warehouse: string;
  qty: number;
  minQty: number;
  unitCost: number;
  category: string;
  lastMove: string;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  source: "Recommandation" | "Site web" | "Appel d'offres" | "Salon" | "Diaspora" | "Terrain";
  need: string;
  budget: number;
  probability: number;
  stage: "prospect" | "visite" | "etude" | "devis" | "negociation" | "gagne" | "perdu";
  ownerId: string;
  createdAt: string;
  nextAction: string;
  nextActionDate: string;
  tone: string;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  job: string;
  contract: "Permanent" | "Journalier" | "Tâcheron" | "Stage";
  projectId?: string;
  phone: string;
  dailyRate: number;
  since: string;
  status: "present" | "absent" | "leave" | "mission";
  qualifications: string[];
  tone: string;
  agency: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: "Plans" | "Contrats" | "Rapports" | "Factures" | "Administratif" | "PV";
  projectId?: string;
  format: "PDF" | "DWG" | "XLSX" | "DOCX" | "JPG";
  size: string;
  version: string;
  updatedAt: string;
  author: string;
  shared: ("Interne" | "Client" | "Sous-traitant")[];
  expiresAt?: string;
}

export interface ActivityItem {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  projectId?: string;
  kind: "finance" | "chantier" | "commercial" | "achat" | "rh" | "doc" | "client";
}

export interface AlertItem {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  projectId?: string;
  at: string;
  cta: string;
  href: string;
}

export interface Message {
  id: string;
  channelId: string;
  author: string;
  initials: string;
  tone: string;
  at: string;
  body: string;
  attachments?: string[];
  own?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  kind: "project" | "direct" | "client" | "team";
  projectId?: string;
  members: number;
  unread: number;
  lastAt: string;
  preview: string;
}
