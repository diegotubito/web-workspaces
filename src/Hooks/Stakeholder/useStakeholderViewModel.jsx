import { useStakeholderRepository } from './useStakeholderRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useStakeholderViewModel = () => {
   const {
      fetchStakeholdersByWorkspaceAndType,
      error: purchaseItemError,
      isLoading: stakeholderIsLoading,
   } = useStakeholderRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [stakeholders, setStakeholders] = useState([])

   const [onStakeholderFailed, setOnStakeholderFailed] = useState([])

   const getStakeholdersByType = async () => {

      try {
         const response = await fetchStakeholdersByWorkspaceAndType(workspaceSession._id, 'SUPPLIER')
         setStakeholders(response.stakeholders)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnStakeholderFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnStakeholderFailed
         })
      }
   }

   return {
      stakeholders,
      stakeholderIsLoading,
      getStakeholdersByType,
      setOnStakeholderFailed
   }
}