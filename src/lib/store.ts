"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoleId } from "@/types";

/* ------------------------------------------------------------------
   État applicatif partagé (Zustand).
   Aucun backend : la session est simulée et persistée localement.
------------------------------------------------------------------- */

interface SessionState {
  authenticated: boolean;
  roleId: RoleId;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  signIn: (roleId?: RoleId) => void;
  signOut: () => void;
  setRole: (roleId: RoleId) => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      authenticated: true,
      roleId: "dg",
      sidebarCollapsed: false,
      commandOpen: false,
      signIn: (roleId = "dg") => set({ authenticated: true, roleId }),
      signOut: () => set({ authenticated: false }),
      setRole: (roleId) => set({ roleId }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
    }),
    { name: "pilotis-session", partialize: (s) => ({ roleId: s.roleId, sidebarCollapsed: s.sidebarCollapsed }) },
  ),
);

/* ---------------------- Préférences d'affichage -------------------- */

export type ProjectView = "grid" | "list" | "kanban" | "timeline" | "gantt" | "map";

interface UiState {
  projectView: ProjectView;
  setProjectView: (v: ProjectView) => void;
  projectFilter: string;
  setProjectFilter: (v: string) => void;
  healthFilter: string;
  setHealthFilter: (v: string) => void;
}

export const useUi = create<UiState>()((set) => ({
  projectView: "grid",
  setProjectView: (projectView) => set({ projectView }),
  projectFilter: "",
  setProjectFilter: (projectFilter) => set({ projectFilter }),
  healthFilter: "all",
  setHealthFilter: (healthFilter) => set({ healthFilter }),
}));
