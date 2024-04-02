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
         console.error('Error:', error.title, error.message);
         setOnGetSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred", 
            action: 'pop',
            setError: setOnGetSaleFailed
         })
      }
   }

   return { getSaleItems, saleItems, saleItemsIsLoading: isLoading, onGetSaleFailed, setOnGetSaleFailed }
}