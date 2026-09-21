import {
  Banknote,
  Boxes,
  Building2,
  FileSignature,
  FolderOpen,
  Gauge,
  HardHat,
  LineChart,
  MessagesSquare,
  Settings,
  Target,
  Truck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: "alerts" | "messages" | "validations";
  description: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    label: "Pilotage",
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: Gauge, description: "Vue consolidée de l'entreprise" },
      { href: "/projets", label: "Projets", icon: Building2, description: "Portefeuille, planning et budgets" },
      { href: "/chantiers", label: "Suivi chantier", icon: HardHat, badge: "alerts", description: "Rapports, photos et incidents" },
    ],
  },
  {
    label: "Gestion",
    items: [
      { href: "/finance", label: "Finance", icon: Banknote, description: "Budgets, factures et trésorerie" },
      { href: "/devis", label: "Devis", icon: FileSignature, description: "Chiffrage, validation et signature" },
      { href: "/fournisseurs", label: "Fournisseurs", icon: Truck, badge: "validations", description: "Achats, commandes et évaluations" },
      { href: "/materiel", label: "Matériel", icon: Boxes, description: "Inventaire, stocks et maintenance" },
    ],
  },
  {
    label: "Développement",
    items: [
      { href: "/crm", label: "CRM", icon: Target, description: "Prospection et pipeline commercial" },
      { href: "/equipes", label: "Équipes", icon: Users, description: "Employés, affectations et présences" },
    ],
  },
  {
    label: "Ressources",
    items: [
      { href: "/messages", label: "Communication", icon: MessagesSquare, badge: "messages", description: "Messagerie et notifications" },
      { href: "/documents", label: "Documents", icon: FolderOpen, description: "Plans, contrats et rapports" },
      { href: "/reporting", label: "Reporting", icon: LineChart, description: "Analyses et exports" },
      { href: "/parametres", label: "Paramètres", icon: Settings, description: "Entreprise, rôles et abonnement" },
    ],
  },
];

export const flatNav: NavItem[] = navigation.flatMap((g) => g.items);

export const clientNavigation = [
  { href: "/portail", label: "Mon chantier" },
  { href: "/portail/photos", label: "Photos" },
  { href: "/portail/documents", label: "Documents" },
  { href: "/portail/paiements", label: "Paiements" },
  { href: "/portail/messages", label: "Messages" },
];
