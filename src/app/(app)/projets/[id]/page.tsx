import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectById, projects } from "@/data";
import { ProjectDetail } from "./project-detail";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projectById(id);
  return {
    title: project ? project.name : "Projet introuvable",
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectById(id);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
