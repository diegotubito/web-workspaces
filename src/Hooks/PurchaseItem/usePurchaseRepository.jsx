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

   const createPurchaseOrder = (body) => {
      return apiCall({
         path: `/api/v1/purchase-order`,
         method: 'POST',
         body: body,
         isLogin: true
      })
   }

   return { fetchPurchaseItemsByWorkspace, createPurchaseOrder, isLoading, error }
}