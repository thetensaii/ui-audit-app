import { Issue } from "../domain/Issue";
import { IssuesRepository } from "../domain/IssuesRepository";

export class GetIssuesService {
  constructor(private issuesRepository: IssuesRepository){}

  public async execute(): Promise<Issue[]> {
    return await this.issuesRepository.getIssues()
  }
}