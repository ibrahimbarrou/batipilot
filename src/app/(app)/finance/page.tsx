import type { Metadata } from "next";
import { FinanceView } from "./finance-view";

export const metadata: Metadata = {
  title: "Finance",
  description: "Budgets, dépenses, factures, recouvrement et trésorerie prévisionnelle.",
};

export default function FinancePage() {
  return <FinanceView />;
}
