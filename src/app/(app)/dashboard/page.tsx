import type { Metadata } from "next";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Vue consolidée du portefeuille : avancement, marge, trésorerie et alertes.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
