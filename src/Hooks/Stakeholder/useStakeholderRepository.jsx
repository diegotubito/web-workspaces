import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useStakeholderRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const fetchStakeholdersByWorkspaceAndType = (workspace, stakeholderType) => {
      return apiCall({
         path: `/api/v1/stakeholder-workspace-type?workspace=${workspace}&stakeholderType=${stakeholderType}`,
         method: 'GET'
      })
   }

   return {
      fetchStakeholdersByWorkspaceAndType,
      isLoading,
      error,
   }
}