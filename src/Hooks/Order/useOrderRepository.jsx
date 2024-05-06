import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useOrderRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const createOrder = (body) => {
      return apiCall({
         path: `/api/v1/order-installments`,
         method: 'POST',
         body: body
      })
   }

   const fetchOrdersByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/order-workspace?workspace=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   const fetchOrdersById = (_id) => {
      return apiCall({
         path: `/api/v1/order?_id=${_id}`,
         method: 'GET'
      })
   }

   const updateOrderStatusFromRepo = (_id, status) => {
      return apiCall({
         path: `/api/v1/order-status?_id=${_id}&status=${status}`,
         method:'PUT'
      })
   }

   return {
      createOrder,
      isLoading,
      error,
      fetchOrdersByWorkspace,
      fetchOrdersById,
      updateOrderStatusFromRepo
   }
}