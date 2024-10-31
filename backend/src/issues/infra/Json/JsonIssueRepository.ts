import fs from "node:fs"

import { ElementRect, Issue, ScreenshotSize } from "../../domain/Issue";
import { IssueRepository } from "../../domain/IssueRepository";
import path from "node:path";
import { fileURLToPath } from "url";

type JsonIssue = {
  id: string,
  message: string,
  elementRect: ElementRect
  screenshotSize: ScreenshotSize
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export class JsonIssueRepository implements IssueRepository {
  private fileDbPath: string;
  constructor(dbFilename: string){
    this.fileDbPath = path.join(__dirname, `./files/${dbFilename}`)
  }

  public async save(issue: Issue): Promise<void> {
    const issues = this.getAll().filter(i => i.id !== issue.id)

    issues.push(this.convertIssueToJsonIssue(issue));

    // remplacer par add
    this.generateNewDBFile(issues);
    fs.writeFileSync(path.join(__dirname, `./files/uploads/${issue.id}.jpeg`), issue.screenshot)
  };

  public async getLast10(): Promise<Issue[]> {
    const issues = this.getAll().slice(-10).map(this.convertJsonIssueToIssue)

    return issues;
  }

  private getAll(): JsonIssue[] {
    try{
      const str = fs.readFileSync(this.fileDbPath, "utf-8")
      return JSON.parse(str)
    } catch(e: unknown) {
      return this.generateNewDBFile()
    }
  }

  private generateNewDBFile(issues?:JsonIssue[]): JsonIssue[] {
    issues = issues ?? []
    fs.writeFileSync(this.fileDbPath, JSON.stringify(issues, null, 2), "utf-8")

    return issues;
  }

  private convertIssueToJsonIssue(issue: Issue): JsonIssue {
    return {
      id: issue.id,
      message: issue.message,
      elementRect: issue.elementRect,
      screenshotSize: issue.screenshotSize
    }
  }

  private convertJsonIssueToIssue(jsonIssue: JsonIssue): Issue {
    const screenshot = fs.readFileSync(path.join(__dirname, `./files/uploads/${jsonIssue.id}.jpeg`))
    return new Issue(jsonIssue.id, jsonIssue.message, jsonIssue.screenshotSize, jsonIssue.elementRect, screenshot)
  }
}