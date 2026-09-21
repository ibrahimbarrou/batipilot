import type { Metadata } from "next";
import { SuppliersView } from "./suppliers-view";

export const metadata: Metadata = {
  title: "Fournisseurs",
  description: "Répertoire fournisseurs, bons de commande, réceptions et évaluations.",
};

export default function SuppliersPage() {
  return <SuppliersView />;
}
