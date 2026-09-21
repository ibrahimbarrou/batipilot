import type { Metadata } from "next";
import { ProjectsView } from "./projects-view";

export const metadata: Metadata = {
  title: "Projets",
  description: "Portefeuille de chantiers : cartes, liste, kanban, timeline, Gantt et carte.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
