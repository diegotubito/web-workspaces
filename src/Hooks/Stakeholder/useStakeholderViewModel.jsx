import { useStakeholderRepository } from './useStakeholderRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useStakeholderViewModel = () => {
   const {
      fetchStakeholdersByWorkspaceAndType,
      fetchStakeholdersByWorkspaceAndTypePaginatedRepository,
      isLoading,
   } = useStakeholderRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [stakeholders, setStakeholders] = useState([])
   const [stakeholderEmptyList, setStakeholderEmptyList] = useState()

   const [onStakeholderFailed, setOnStakeholderFailed] = useState(null)

   const getStakeholdersByType = async (stakeholderType) => {

      try {
         const response = await fetchStakeholdersByWorkspaceAndType(workspaceSession._id, stakeholderType)
         setStakeholderEmptyList((response.stakeholders.length === 0))
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

   const fetchStakeholdersByWorkspaceAndTypePaginated = async (stakeholderType, search) => {

      try {
         const response = await fetchStakeholdersByWorkspaceAndTypePaginatedRepository(workspaceSession._id, stakeholderType, search, 1, 200)
         setStakeholderEmptyList((response.stakeholders.length === 0))
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
      isLoading,
      getStakeholdersByType,
      onStakeholderFailed,
      fetchStakeholdersByWorkspaceAndTypePaginated,
      stakeholderEmptyList
   }
}