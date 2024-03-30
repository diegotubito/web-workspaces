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
         path: `/api/v1/transaction`,
         method: 'POST',
         body: body
      })
   }

   return { fetchTransactionByEntity, isLoading, error, createNewPayment }
}