import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useDiscountPerItemRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchDiscountsPerItemByWorkspace = (workspace) => {
      return apiCall({
         path: `/api/v1/discount_per_item?workspace=${workspace}`,
         method: 'GET'
      })
   }

   return { fetchDiscountsPerItemByWorkspace, isLoading, error }
}