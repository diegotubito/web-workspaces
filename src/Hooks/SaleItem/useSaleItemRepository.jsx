import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useSaleItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspace = (workspace, stakeholder) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace-stakeholder?workspace=${workspace}&stakeholder=${stakeholder}`,
         method: 'GET'
      })
   }

   return {getItemsByWorkspace, isLoading, error}
}