import {useSaleItemRepository} from './useSaleItemRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useState } from 'react'

export const useSaleItemViewModel = () => {
   const { getItemsByWorkspace, isLoading, error: saleItemError } = useSaleItemRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [saleItems, setSaleItems] = useState([])

   const [onGetSaleFailed, setOnGetSaleFailed] = useState(null)

   const getSaleItems = async () => {
      try {
         const response = await getItemsByWorkspace(workspaceSession._id)
         setSaleItems(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
         setOnGetSaleFailed(error)
      }
   }

   return { getSaleItems, saleItems, saleItemsIsLoading: isLoading, onGetSaleFailed, setOnGetSaleFailed }
}