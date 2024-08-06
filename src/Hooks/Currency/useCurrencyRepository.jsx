import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useCurrencyRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchCurrenciesByWorkspace = () => {
      return apiCall({
         path: `/api/v1/currency`,
         method: 'GET'
      })
   }

   return { fetchCurrenciesByWorkspace, isLoading, error }
}