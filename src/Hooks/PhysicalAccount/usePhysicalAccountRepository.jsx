import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const usePhysicalAccountRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchAllAccounts = (workspace) => {
      return apiCall({
         path: `/api/v1/workspace_accounts_by_workspace?workspaceId=${workspace}`,
         method: 'GET'
      })
   }

   const fetchAllAccountsByAssigneeRepo = (workspace, userId) => {
      return apiCall({
         path: `/api/v1/workspace_accounts_by_workspace_assignee?workspaceId=${workspace}&userId=${userId}`,
         method: 'GET'
      })
   }

   const fetchAllAccountsByAssigneeTransferRepo = (workspace, userId) => {
      return apiCall({
         path: `/api/v1/workspace_accounts_by_workspace_assignee_transfer?workspaceId=${workspace}&userId=${userId}`,
         method: 'GET'
      })
   }

   const fetchAllAccountsByAssigneeBalancesRepo = (workspace, userId) => {
      return apiCall({
         path: `/api/v1/workspace_accounts_by_workspace_assignee_balances?workspaceId=${workspace}&userId=${userId}`,
         method: 'GET'
      })
   }

   return { fetchAllAccountsByAssigneeBalancesRepo, fetchAllAccountsByAssigneeTransferRepo, fetchAllAccountsByAssigneeRepo, fetchAllAccounts, isLoading, error }
}