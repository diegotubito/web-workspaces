import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useSaleItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const getItemsByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/sale-item-workspace?workspaceId=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   return {getItemsByWorkspace, isLoading, error}
}