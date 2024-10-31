import { ElementRect, ScreenshotSize } from "../domain/Issue";
import { IssueFactory } from "../domain/IssueFactory";
import { IssueRepository } from "../domain/IssueRepository";

export class AddNewIssueService {
  constructor(private issueRepository: IssueRepository){}

  async execute(message: string, screenshotSize: ScreenshotSize, elementRect: ElementRect, screenshotData: Buffer): Promise<string>{
    const issueFactory = new IssueFactory()

    const issue = issueFactory.createIssue(message, screenshotSize, elementRect, screenshotData)

    await this.issueRepository.save(issue);

    return issue.id;
  }
}