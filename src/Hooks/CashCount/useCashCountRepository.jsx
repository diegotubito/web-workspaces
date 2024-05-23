import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useCashCountRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchCashCountByWorkspaceAndAccount = (workspace, account) => {
      return apiCall({
         path: `/api/v1/cash-count-workspace-account?workspace=${workspace}&account=${account}`,
         method: 'GET'
      })
   }

   const createCashCount = (body) => {
      return apiCall({
         path: `/api/v1/cash-count`,
         method: 'POST',
         body: body
      })
   }

   const closeCashCount = (body) => {
      return apiCall({
         path: `/api/v1/cash-count-close`,
         method: 'POST',
         body: body
      })
   }

   return { closeCashCount, createCashCount, fetchCashCountByWorkspaceAndAccount, isLoading, error }
}