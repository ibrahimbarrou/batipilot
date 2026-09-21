import type { Metadata } from "next";
import { SiteView } from "./site-view";

export const metadata: Metadata = {
  title: "Suivi de chantier",
  description: "Journal de chantier, photos certifiées, incidents et géolocalisation.",
};

export default function SitePage() {
  return <SiteView />;
}
