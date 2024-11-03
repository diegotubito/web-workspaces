import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspaceAndStakeholder = (workspace, stakeholder) => {
      console.log(stakeholder)
      return apiCall({
         path: `/api/v1/item-workspace-stakeholder?workspace=${workspace}&stakeholder=${stakeholder._id}`,
         method: 'GET'
      })
   }

   const fetchItemsByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/item-workspace?workspaceId=${workspace}`,
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