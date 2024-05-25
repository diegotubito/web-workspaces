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
         const response = await fetchItemsByWorkspaceRepository(workspaceSession._id)
         const filtered = filterByStakeholder(response.items, stakeholder.items)
         setItems(filtered)
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

   const filterByStakeholder = (items, stakeholderItems) => {
      return items.filter(item => stakeholderItems.includes(item._id));
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

   const fetchSaleItemsByWorkspace = async (isForSale) => {
      try {
         const response = await fetchItemsByWorkspaceRepository(workspaceSession._id)
         const filterItems = filterByEnabledAndSaleType(response.items, isForSale)
         setItems(filterItems)
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

   const filterByEnabledAndSaleType = (items, isForSale) => {
      return items.filter((item) => item.isEnabled && item.isForSale === isForSale)
   }

   return {
      fetchItemsByWorkspaceAndStakeholder,
      fetchSaleItemsByWorkspace,
      items,
      setItems,
      saleItemsIsLoading: isLoading,
      onGetSaleFailed: onItemFailed,
      setOnGetSaleFailed: setOnItemFailed,
      fetchItemsByWorkspace
   }
}