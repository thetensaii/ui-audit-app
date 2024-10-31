import { Issue } from "./Issue";

export interface IssuesRepository {
  getIssues: () => Promise<Issue[]>
}