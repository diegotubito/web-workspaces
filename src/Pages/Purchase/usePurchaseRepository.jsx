import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const usePurchaseRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchPurchaseItemsByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/purchase-item-workspace?workspaceId=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   return { fetchPurchaseItemsByWorkspace, isLoading, error }
}