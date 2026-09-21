import type { Metadata } from "next";
import { MessagesView } from "./messages-view";

export const metadata: Metadata = {
  title: "Communication",
  description: "Messagerie par chantier, notifications et journal d'activité.",
};

export default function Page() {
  return <MessagesView />;
}
