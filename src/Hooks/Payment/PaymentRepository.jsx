import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const usePaymentRepository = () => {
   const { apiCall, error, isLoading } = useApiCall()

   const fetchPaymentMethods = (workspace) => {
      return apiCall({
         path: `/api/v1/payment-method?workspace=${workspace}`,
         method: 'GET'
      })
   }

   return { isLoading, error, fetchPaymentMethods }
}