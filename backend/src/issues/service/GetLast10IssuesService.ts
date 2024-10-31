import { Issue } from "../domain/Issue";
import { IssueRepository } from "../domain/IssueRepository";

export class GetLast10IssuesService {

  constructor(private issuesRepository: IssueRepository){}

  public async execute(): Promise<Issue[]> {
    const issues = await this.issuesRepository.getLast10();
    return issues;
  }
}