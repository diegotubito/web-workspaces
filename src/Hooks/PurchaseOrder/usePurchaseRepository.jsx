import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const usePurchaseRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const createPurchaseOrder = (body) => {
      return apiCall({
         path: `/api/v1/purchase-installments`,
         method: 'POST',
         body: body
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

   const updatePurchaseOrderStatus = (_id, status) => {
      return apiCall({
         path: `/api/v1/purchase-order-status?_id=${_id}&status=${status}`,
         method:'PUT'
      })
   }

   return {
      createPurchaseOrder,
      isLoading,
      error,
      fetchPurchaseOrdersByWorkspace,
      fetchPurchaseOrdersById,
      updatePurchaseOrderStatus
   }
}