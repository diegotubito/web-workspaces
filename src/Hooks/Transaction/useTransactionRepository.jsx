import { useApiCall } from "../../Utils/ApiNetwork/apiCall";

export const useTransactionRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchTransactionByEntity = (workspace, entity, entityModel) => {
      return apiCall({
         path: `/api/v1/transaction-by-entity?workspace=${workspace}&entity=${entity}&entityModel=${entityModel}`,
         method: 'GET'
      })
   }

   const createNewPayment = (body) => {
      return apiCall({
         path: `/api/v1/transaction-payment`,
         method: 'POST',
         body: body
      })
   }

   const disablePayment = (_id) => {
      return apiCall({
         path: `/api/v1/transaction-disable?_id=${_id}`,
         method: 'PUT'
      })
   }

   return { fetchTransactionByEntity, isLoading, error, createNewPayment, disablePayment }
}