import type { Metadata } from "next";
import { TeamsView } from "./teams-view";

export const metadata: Metadata = {
  title: "Équipes",
  description: "Effectif, pointage, affectations et paie des journaliers.",
};

export default function Page() {
  return <TeamsView />;
}
