import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useStakeholderRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchStakeholdersByWorkspaceAndType = (workspace, stakeholderType) => {
      return apiCall({
         path: `/api/v1/stakeholder-workspace-type?workspace=${workspace}&stakeholderType=${stakeholderType}`,
         method: 'GET'
      })
   }

   const fetchStakeholdersByWorkspaceAndTypePaginatedRepository = ( body) => {
      return apiCall({
         path: `/api/v1/search-stakeholder?workspace=${body.workspace}&stakeholderType=${body.stakeholderType}&search=${body.search}&page=${body.page}&limit=${body.limit}`,
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