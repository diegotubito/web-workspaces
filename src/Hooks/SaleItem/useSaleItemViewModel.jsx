import {useSaleItemRepository} from './useSaleItemRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useSaleItemViewModel = () => {
   const { 
      getItemsByWorkspaceAndStakeholder,
      isLoading,
      error: saleItemError,
      fetchPurchaseItemsByWorkspace 
   } = useSaleItemRepository()

   const { workspaceSession } = useWorkspaceSession()
   const [saleItems, setSaleItems] = useState([])

   const [onGetSaleFailed, setOnGetSaleFailed] = useState(null)

   const fetchItemsByWorkspaceAndStakeholder = async (stakeholder) => {
      try {
         const response = await getItemsByWorkspaceAndStakeholder(workspaceSession._id, stakeholder)
         setSaleItems(response.items)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnGetSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred", 
            action: 'pop',
            setError: setOnGetSaleFailed
         })
      }
   }

   const getPurchaseItems = async () => {

      try {
         const response = await fetchPurchaseItemsByWorkspace(workspaceSession._id)
         setSaleItems(response.items)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnGetSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnGetSaleFailed
         })
      }
   }

   return { fetchItemsByWorkspaceAndStakeholder, saleItems, saleItemsIsLoading: isLoading, onGetSaleFailed, setOnGetSaleFailed, getPurchaseItems }
}