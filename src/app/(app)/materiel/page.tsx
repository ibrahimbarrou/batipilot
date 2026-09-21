import type { Metadata } from "next";
import { AssetsView } from "./assets-view";

export const metadata: Metadata = {
  title: "Matériel",
  description: "Inventaire du parc, stocks par dépôt, affectations et maintenance préventive.",
};

export default function AssetsPage() {
  return <AssetsView />;
}
