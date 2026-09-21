import type { Metadata } from "next";
import { QuotesView } from "./quotes-view";

export const metadata: Metadata = {
  title: "Devis",
  description: "Chiffrage, validation interne, signature électronique et conversion en projet.",
};

export default function QuotesPage() {
  return <QuotesView />;
}
