import type { Metadata } from "next";
import { ReportingView } from "./reporting-view";

export const metadata: Metadata = {
  title: "Reporting",
  description: "Tableaux de bord, indicateurs cles et exports decisionnels.",
};

export default function Page() {
  return <ReportingView />;
}
