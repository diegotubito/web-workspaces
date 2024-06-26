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

   const fetchTransactionByWorkspaceAndAccount = (workspace, account) => {
      return apiCall({
         path: `/api/v1/transaction-by-worspace-account?workspace=${workspace}&account=${account}`,
         method: 'GET'
      })
   }

   const fetchTransactionByWorkspaceAndAccountAndDate = (workspace, account, fromDate, toDate) => {
      return apiCall({
         path: `/api/v1/transaction-by-worspace-account-date?workspace=${workspace}&account=${account}&fromDate=${fromDate}&toDate=${toDate}`,
         method: 'GET'
      })
   }

   return { fetchTransactionByWorkspaceAndAccountAndDate, fetchTransactionByWorkspaceAndAccount, fetchTransactionByEntity, isLoading, error, createNewPayment, disablePayment, fetchTransactionByInstallment, transferFundsRepo }
}