import { Namespace } from "@/types/namespace";
import { Project } from "@/types/project";
import { create } from "zustand";
import isEqual from "lodash.isequal";

type FilterStore = {
  projects: Project[];
  namespaces: Namespace[];

  toggleNamespace: (ns: Namespace) => void;
  toggleProject: (project: Project) => void;
};

// TODO this is the ugliest code in our project and it must be rewritten
export const useFilterStore = create<FilterStore>()((set) => ({
  projects: new Array<Project>(),
  namespaces: new Array<Namespace>(),

  toggleNamespace: (ns: Namespace) =>
    set((state) => {
      if (state.namespaces.some((sns) => isEqual(sns, ns))) {
        return {
          namespaces: state.namespaces.filter((sns) => !isEqual(sns, ns)),
          projects: state.projects.filter((p) => !isEqual(p.parent, ns)),
        };
      }

      return {
        namespaces: [...state.namespaces, ns],
      };
    }),

  toggleProject: (project: Project) =>
    set((state) => {
      if (state.projects.some((p) => p.id === project.id)) {
        return { projects: state.projects.filter((p) => p.id !== project.id) };
      }

      if (state.namespaces.some((ns) => isEqual(ns, project.parent))) {
        return { projects: [...state.projects, project] };
      }

      return {
        projects: [...state.projects, project],
        namespaces: [...state.namespaces, project.parent],
      };
    }),
}));
