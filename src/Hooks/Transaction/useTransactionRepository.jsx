import { useApiCall } from "../../Utils/ApiNetwork/apiCall";

export const useTransactionRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchTransactionByEntity = (workspace, entity, entityModel) => {
      return apiCall({
         path: `/api/v1/transaction-by-entity?workspace=${workspace}&entity=${entity}&entityModel=${entityModel}`,
         method: 'GET'
      })
   }

   const fetchTransactionByInstallment = (installmentId) => {
      return apiCall({
         path: `/api/v1/transaction-by-installment?installmentId=${installmentId}`,
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

   const transferFundsRepo = (workspace, user, body) => {
      return apiCall({
         path: `/api/v1/transaction-transfer-funds?workspace=${workspace}&user=${user}`,
         method: 'PUT',
         body: body
      })
   }

   return { fetchTransactionByEntity, isLoading, error, createNewPayment, disablePayment, fetchTransactionByInstallment, transferFundsRepo }
}