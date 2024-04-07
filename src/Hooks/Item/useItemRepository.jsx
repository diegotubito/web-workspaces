import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspaceAndStakeholder = (workspace, stakeholder) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace-stakeholder?workspace=${workspace}&stakeholder=${stakeholder}`,
         method: 'GET'
      })
   }

   const fetchItemsByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace?workspaceId=${workspace}`,
         method: 'GET'
      })
   }

   return {
      getItemsByWorkspaceAndStakeholder,
      isLoading,
      error,
      fetchItemsByWorkspace
   }
}