import { Issue } from "../../domain/Issue";

export const convertIssueToUIIssue = (issue:Issue): UIIssue => ({
  ...issue,
  screenshotUrl: URL.createObjectURL(issue.screenshot)
})