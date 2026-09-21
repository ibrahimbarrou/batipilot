"use client";

import * as React from "react";
import {
  CalendarRange,
  Download,
  GanttChartSquare,
  LayoutGrid,
  List,
  Map,
  Plus,
  Search,
  SlidersHorizontal,
  Trello,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/data-display";
import { PageHeader, Toolbar } from "@/components/shared/page-header";
import {
  GanttChart,
  PortfolioMap,
  ProjectCard,
  ProjectKanban,
  ProjectTable,
  ProjectTimeline,
  ViewSwitch,
} from "@/components/shared/project-views";
import { projects } from "@/data";
import { useUi, type ProjectView } from "@/lib/store";
import { formatMoneyCompact } from "@/lib/utils";

const VIEWS = [
  { id: "grid" as const, label: "Cartes", icon: LayoutGrid },
  { id: "list" as const, label: "Liste", icon: List },
  { id: "kanban" as const, label: "Kanban", icon: Trello },
  { id: "timeline" as const, label: "Timeline", icon: CalendarRange },
  { id: "gantt" as const, label: "Gantt", icon: GanttChartSquare },
  { id: "map" as const, label: "Carte", icon: Map },
];

export function ProjectsView() {
  const view = useUi((s) => s.projectView);
  const setView = useUi((s) => s.setProjectView);
  const [query, setQuery] = React.useState("");
  const [health, setHealth] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [ganttProject, setGanttProject] = React.useState(projects[0].id);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (health !== "all" && p.health !== health) return false;
      if (type !== "all" && p.type !== type) return false;
      if (!q) return true;
      return `${p.name} ${p.code} ${p.city} ${p.tags.join(" ")}`.toLowerCase().includes(q);
    });
  }, [query, health, type]);

  const totals = React.useMemo(
    () => ({
      contract: filtered.reduce((s, p) => s + p.contractAmount, 0),
      spent: filtered.reduce((s, p) => s + p.spent, 0),
    }),
    [filtered],
  );

  const selectedGantt = projects.find((p) => p.id === ganttProject) ?? projects[0];

  return (
    <>
      <PageHeader
        eyebrow="Portefeuille"
        title="Projets"
        description="Tous les chantiers de l'entreprise, de l'étude à la clôture — budget, avancement et délais sur une même ligne."
        meta={
          <>
            <Badge variant="brand">{filtered.length} projets affichés</Badge>
            <Badge variant="neutral">Marché cumulé {formatMoneyCompact(totals.contract)}</Badge>
            <Badge variant="neutral">Réalisé {formatMoneyCompact(totals.spent)}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Download />
              Exporter
            </Button>
            <Button>
              <Plus />
              Nouveau projet
            </Button>
          </>
        }
      />

      <Toolbar
        right={
          <ViewSwitch<ProjectView>
            value={view}
            onChange={setView}
            options={VIEWS.map((v) => ({ id: v.id as ProjectView, label: v.label, icon: v.icon }))}
          />
        }
      >
        <div className="w-full sm:w-64">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un chantier…"
            icon={<Search />}
          />
        </div>

        <Select value={health} onValueChange={setHealth}>
          <SelectTrigger className="w-[9.5rem]">
            <SelectValue placeholder="Santé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes santés</SelectItem>
            <SelectItem value="on_track">À l&apos;heure</SelectItem>
            <SelectItem value="at_risk">Vigilance</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
            <SelectItem value="not_started">Non démarré</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[9.5rem]">
            <SelectValue placeholder="Type d'ouvrage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="batiment">Bâtiment</SelectItem>
            <SelectItem value="route">Route</SelectItem>
            <SelectItem value="vrd">VRD</SelectItem>
            <SelectItem value="renovation">Rénovation</SelectItem>
            <SelectItem value="industriel">Industriel</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm">
          <SlidersHorizontal />
          Plus de filtres
        </Button>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search />}
          title="Aucun chantier ne correspond"
          description="Modifiez vos filtres ou lancez une nouvelle recherche sur l'ensemble du portefeuille."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setHealth("all");
                setType("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          }
          className="rounded-lg border border-dashed border-line bg-surface"
        />
      ) : view === "grid" ? (
        <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : view === "list" ? (
        <ProjectTable projects={filtered} />
      ) : view === "kanban" ? (
        <ProjectKanban projects={filtered} />
      ) : view === "timeline" ? (
        <div className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          <ProjectTimeline projects={filtered} />
        </div>
      ) : view === "gantt" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-ink-500">Planning détaillé :</span>
            <Select value={ganttProject} onValueChange={setGanttProject}>
              <SelectTrigger className="w-[22rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filtered.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="neutral">{selectedGantt.tasks.length} tâches</Badge>
          </div>
          <GanttChart project={selectedGantt} />
        </div>
      ) : (
        <PortfolioMap projects={filtered} />
      )}
    </>
  );
}
