import type { Metadata } from "next";
import { DocumentsView } from "./documents-view";

export const metadata: Metadata = {
  title: "Documents",
  description: "Plans, contrats, rapports et pièces administratives.",
};

export default function Page() {
  return <DocumentsView />;
}
