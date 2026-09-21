import type { Metadata } from "next";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = {
  title: "Parametres",
  description: "Entreprise, utilisateurs, roles, modules, integrations et abonnement.",
};

export default function Page() {
  return <SettingsView />;
}
