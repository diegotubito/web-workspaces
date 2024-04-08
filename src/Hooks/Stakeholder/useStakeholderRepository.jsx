import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useStakeholderRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchStakeholdersByWorkspaceAndType = (workspace, stakeholderType) => {
      return apiCall({
         path: `/api/v1/stakeholder-workspace-type?workspace=${workspace}&stakeholderType=${stakeholderType}`,
         method: 'GET'
      })
   }

   const fetchStakeholdersByWorkspaceAndTypePaginatedRepository = (workspace, stakeholderType, search, page, limit) => {
      /*search, page = 1, limit = 10 */
      return apiCall({
         path: `/api/v1/search-stakeholder?workspace=${workspace}&stakeholderType=${stakeholderType}&search=${search}&page=${page}&limit=${limit}`,
         method: 'GET'
      })
   }

   return {
      fetchStakeholdersByWorkspaceAndType,
      fetchStakeholdersByWorkspaceAndTypePaginatedRepository,
      isLoading,
      error,
   }
}