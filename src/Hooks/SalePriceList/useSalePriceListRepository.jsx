import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useSalePriceListRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchSalePricesByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/sale_price?workspace=${workspace}`,
         method: 'GET'
      })
   }

   return { fetchSalePricesByWorkspace, isLoading, error }
}