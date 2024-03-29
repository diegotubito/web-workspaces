import { useApiCall } from "../../Utils/ApiNetwork/apiCall";

export const useTransactionRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchTransactionByEntity = (workspace, entity, entityModel) => {
      return apiCall({
         path: `/api/v1/transaction-by-entity?workspace=${workspace}&entity=${entity}&entityModel=${entityModel}`,
         method: 'GET'
      })
   }

   return { fetchTransactionByEntity, isLoading, error }
}