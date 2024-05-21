import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useCashCountRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchCashCountByWorkspaceAndAccount = (workspace, account) => {
      return apiCall({
         path: `/api/v1/cash-count-workspace-account?workspace=${workspace}&account=${account}`,
         method: 'GET'
      })
   }

   return { fetchCashCountByWorkspaceAndAccount, isLoading, error }
}