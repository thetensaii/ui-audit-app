import { Ref, ref } from "vue"
import { RemoteIssuesRepository } from "../../infra/RemoteIssuesRepository"
import { GetIssuesService } from "../../service/GetIssuesService"
import { convertIssueToUIIssue } from "../utils/function"

export const useGetIssues = (): Ref<UIIssue[]> => {

  const issues = ref<UIIssue[]>([])

  const getIssues = async () => {
    const remoteIssuesRepository = new RemoteIssuesRepository()
    const getIssuesService= new GetIssuesService(remoteIssuesRepository);
  
    const domainIssues = await getIssuesService.execute()
    const uiIssues = domainIssues.map(convertIssueToUIIssue)
    
    issues.value = uiIssues;
  }

  getIssues();

  return issues
}