import { useItemRepository } from './useItemRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useItemViewModel = () => {
   const {
      getItemsByWorkspaceAndStakeholder,
      isLoading,
      error: saleItemError,
      fetchItemsByWorkspace: fetchItemsByWorkspaceRepository
   } = useItemRepository()

   const { workspaceSession } = useWorkspaceSession()
   const [items, setItems] = useState([])

   const [onItemFailed, setOnItemFailed] = useState(null)

   const fetchItemsByWorkspaceAndStakeholder = async (stakeholder) => {
      try {
         const response = await getItemsByWorkspaceAndStakeholder(workspaceSession._id, stakeholder)
         setItems(response.items)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnItemFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'pop',
            setError: setOnItemFailed
         })
      }
   }

   const fetchItemsByWorkspace = async () => {

      try {
         const response = await fetchItemsByWorkspaceRepository(workspaceSession._id)
         setItems(response.items)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnItemFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnItemFailed
         })
      }
   }

   return {
      fetchItemsByWorkspaceAndStakeholder,
      saleItems: items,
      saleItemsIsLoading: isLoading,
      onGetSaleFailed: onItemFailed,
      setOnGetSaleFailed: setOnItemFailed,
      fetchItemsByWorkspace
   }
}