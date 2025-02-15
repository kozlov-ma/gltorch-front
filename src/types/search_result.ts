import { Project } from "./project";

export type SearchResult = {
  id: string;
  path: string;
  filename: string;
  data: string;
  startLine: number;
  project: Project;
};
