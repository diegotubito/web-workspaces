import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useCurrencyRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchCurrenciesByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/currency-workspace?workspace=${workspace}`,
         method: 'GET'
      })
   }

   return { fetchCurrenciesByWorkspace, isLoading, error }
}