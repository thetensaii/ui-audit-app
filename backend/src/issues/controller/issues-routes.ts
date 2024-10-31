import { FastifyInstance } from "fastify";
import z from "zod"
import { AddNewIssueService } from "../service/AddNewIssueService"
import { JsonIssueRepository } from "../infra/Json/JsonIssueRepository";
import { GetLast10IssuesService } from "../service/GetLast10IssuesService";

const screenshotSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

const stringToScreenshotSizeSchema = z.string()
    .transform( ( str, ctx ) => {
        try {
            return screenshotSizeSchema.parse(JSON.parse(str))
        } catch ( e ) {
            ctx.addIssue( { code: 'custom', message: 'Invalid JSON' } )
            return z.NEVER
        }
    } )

const elementRectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

const stringToElementRectSchema = z.string()
    .transform( ( str, ctx ) => {
        try {
            return elementRectSchema.parse(JSON.parse(str))
        } catch ( e ) {
            ctx.addIssue( { code: 'custom', message: 'Invalid JSON' } )
            return z.NEVER
        }
    } )

const issueDTOSchema = z.object({
  message: z.string(),
  elementRectString: z.string(),
  screenshotSizeString: z.string(),
  screenshot: z.object({
    data: z.instanceof(Buffer)
  })
})



const issuesRoutes = async (fastify: FastifyInstance, options: Object) => {

  fastify.post('/issues', async (request, reply) => {
    try {
      const reqData = issueDTOSchema.parse(request.body)
      const elementRect = stringToElementRectSchema.parse(reqData.elementRectString)
      const screenshotSize = stringToScreenshotSizeSchema.parse(reqData.screenshotSizeString)

      const jsonIssueRepository = new JsonIssueRepository("issues.json")
      const addNewIssueService = new AddNewIssueService(jsonIssueRepository)
      const id = await addNewIssueService.execute(reqData.message, screenshotSize, elementRect, reqData.screenshot.data)
      
      return { id }
    } catch (error) {
      console.log(error)
      reply.status(500)
    }
  })

  fastify.get("/issues", async () => {
    const jsonIssueRepository = new JsonIssueRepository("issues.json")

    const getLast10IssuesService = new GetLast10IssuesService(jsonIssueRepository);
    const issues = await getLast10IssuesService.execute()
    return {
      issues: issues.map((i) => ({
        id: i.id,
        message: i.message,
        elementRect: i.elementRect,
        screenshotSize: i.screenshotSize,
        screenshot: i.screenshot
      }))
    }

  })

}



export default issuesRoutes;