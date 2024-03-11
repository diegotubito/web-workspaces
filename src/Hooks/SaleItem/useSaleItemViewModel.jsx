import {useSaleItemRepository} from './useSaleItemRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useSaleItemViewModel = () => {
   const { getItemsByWorkspace, isLoading, error } = useSaleItemRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [saleItems, setSaleItems] = useState([])

   const getSaleItems = async () => {
      try {
         const response = await getItemsByWorkspace(workspaceSession._id)
         setSaleItems(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getSaleItems, saleItems, saleItemsIsLoading: isLoading, error }
}