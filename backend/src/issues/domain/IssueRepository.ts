import { Issue } from "./Issue";

export interface IssueRepository {
  save: (issue:Issue) => Promise<void>,
  getLast10:() => Promise<Issue[]>
  
}