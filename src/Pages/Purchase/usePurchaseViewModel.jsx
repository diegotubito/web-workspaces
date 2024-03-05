import { usePurchaseRepository } from './usePurchaseRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'

export const usePurchaseViewModel = () => {
   const { isLoading: purchaseItemIsLoading, fetchPurchaseItemsByWorkspace, error } = usePurchaseRepository()
   const { workspaceSession } = useWorkspaceSession()
   
   const getItems = async () => {
      console.log('loading purchase items')

      try {
         const response = await fetchPurchaseItemsByWorkspace(workspaceSession._id)
         console.log(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }
   
   return {
      purchaseItemIsLoading,
      getItems
   }
}