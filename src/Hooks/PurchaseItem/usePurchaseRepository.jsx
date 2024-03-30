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

   const fetchPurchaseOrdersByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/purchase-order-workspace?workspace=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   const fetchPurchaseOrdersById = (_id) => {
      return apiCall({
         path: `/api/v1/purchase-order?_id=${_id}`,
         method: 'GET'
      })
   }

   return {
      fetchPurchaseItemsByWorkspace,
      createPurchaseOrder,
      isLoading,
      error,
      fetchPurchaseOrdersByWorkspace,
      fetchPurchaseOrdersById
   }
}