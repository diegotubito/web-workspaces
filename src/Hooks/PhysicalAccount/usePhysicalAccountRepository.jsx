import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const usePhysicalAccountRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchAllAccounts = (workspace) => {
      return apiCall({
         path: `/api/v1/workspace_accounts_by_workspace?workspaceId=${workspace}`,
         method: 'GET'
      })
   }

   return { fetchAllAccounts, isLoading, error }
}