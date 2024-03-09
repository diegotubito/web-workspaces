import { usePurchaseRepository } from './usePurchaseRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const usePurchaseViewModel = () => {
   const { isLoading: purchaseItemIsLoading, fetchPurchaseItemsByWorkspace, error } = usePurchaseRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [purchaseItems, setPurchaseItems] = useState([])
   
   const getPurchaseItems = async () => {
   
      try {
         const response = await fetchPurchaseItemsByWorkspace(workspaceSession._id)
         setPurchaseItems(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }
   
   return {
      purchaseItemIsLoading,
      getPurchaseItems,
      purchaseItems
   }
}