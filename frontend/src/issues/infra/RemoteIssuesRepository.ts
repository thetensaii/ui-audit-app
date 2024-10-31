import { Issue } from "../domain/Issue";
import { IssuesRepository } from "../domain/IssuesRepository";
import z from "zod"

const screenshotSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

const elementRectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

const issueDTOSchema = z.object({
  id: z.string(),
  message: z.string(),
  elementRect: elementRectSchema,
  screenshotSize: screenshotSizeSchema,
  screenshot: z.object({
    data: z.number().array()
  }) 
})

const expectedResSchema = z.object({
  issues: issueDTOSchema.array()
})

type IssueDto = z.infer<typeof issueDTOSchema>

const convertIssueDtoToDomainIssue = (issueDto: IssueDto): Issue => {
  const uint8Array = new Uint8Array(issueDto.screenshot.data);

  const screenshotBlob = new Blob([uint8Array], { type: "image/jpeg" })
  return new Issue(issueDto.id, issueDto.message, issueDto.screenshotSize, issueDto.elementRect, screenshotBlob)
}

export class RemoteIssuesRepository implements IssuesRepository {
  public async getIssues(): Promise<Issue[]> {
    const res = await fetch("http://localhost:8080/issues", {
      method: "GET"
    })
    const issuesDto = await res.json()

    console.log("Issues DTO :", issuesDto)

    const issuesParsed = expectedResSchema.parse(issuesDto).issues
    console.log("Issues Parsed :", issuesParsed)


    return issuesParsed.map(convertIssueDtoToDomainIssue)
  }
}