import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspaceAndStakeholder = (workspace, stakeholder) => {
      return apiCall({
         path: `/api/v1/item-workspace-stakeholder?workspace=${workspace}&stakeholder=${stakeholder}`,
         method: 'GET'
      })
   }

   const fetchItemsByWorkspace = (workspace, stakeholder) => {
      return apiCall({
         path: `/api/v1/item-workspace?workspaceId=${workspace}&stakeholder=${stakeholder}`,
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