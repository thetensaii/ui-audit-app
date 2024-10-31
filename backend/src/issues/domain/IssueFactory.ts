import crypto from "node:crypto"
import { ElementRect, Issue, ScreenshotSize } from "./Issue";

export class IssueFactory {
  constructor(){}

  public createIssue(message: string, screenshotSize: ScreenshotSize, elementRect: ElementRect, screenshot: Buffer): Issue {
    const newId = crypto.randomUUID();
    const issue = new Issue(newId, message, screenshotSize, elementRect, screenshot);

    return issue;
  }
}