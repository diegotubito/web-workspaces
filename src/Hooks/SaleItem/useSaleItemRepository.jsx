import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useSaleItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspaceAndStakeholder = (workspace, stakeholder) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace-stakeholder?workspace=${workspace}&stakeholder=${stakeholder}`,
         method: 'GET'
      })
   }

   const fetchPurchaseItemsByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace?workspaceId=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   return {
      getItemsByWorkspaceAndStakeholder,
      isLoading,
      error,
      fetchPurchaseItemsByWorkspace
   }
}