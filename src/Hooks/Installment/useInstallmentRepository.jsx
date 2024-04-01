import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useInstallmentRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchInstallmentByWorkspaceAndOrderId = (workspace, orderId) => {
      return apiCall({
         path: `/api/v1/installment-purchase-order?workspace=${workspace}&orderId=${orderId}`,
         method: 'GET'
      })
   }

   return { fetchInstallmentByWorkspaceAndOrderId, isLoading, error }
}