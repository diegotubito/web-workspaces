import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useSaleRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const createSaleOrder = (body) => {
      return apiCall({
         path: `/api/v1/sale-installments`,
         method: 'POST',
         body: body
      })
   }

   const fetchSaleOrdersByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/sale-order-workspace?workspace=${workspace}`,
         method: 'GET',
         isLogin: true
      })
   }

   const fetchSaleOrdersById = (_id) => {
      return apiCall({
         path: `/api/v1/sale-order?_id=${_id}`,
         method: 'GET'
      })
   }

   const updateSaleOrderStatus = (_id, status) => {
      return apiCall({
         path: `/api/v1/sale-order-status?_id=${_id}&status=${status}`,
         method: 'PUT'
      })
   }

   return {
      createSaleOrder,
      isLoading,
      error,
      fetchSaleOrdersByWorkspace,
      fetchSaleOrdersById,
      updateSaleOrderStatus
   }
}