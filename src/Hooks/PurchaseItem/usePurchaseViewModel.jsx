import { usePurchaseRepository } from './usePurchaseRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useState } from 'react'
import { convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'

export const usePurchaseViewModel = () => {
   const {
      isLoading: purchaseItemIsLoading,
      fetchPurchaseItemsByWorkspace,
      createPurchaseOrder: createPurchaseOrderRepository,
      error: purchaseItemError
   } = usePurchaseRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [purchaseItems, setPurchaseItems] = useState([])
   const [onPurchaseFailed, setOnPurchaseFailed] = useState(null)

   const getPurchaseItems = async () => {

      try {
         const response = await fetchPurchaseItemsByWorkspace(workspaceSession._id)
         setPurchaseItems(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const createPurchaseOrder = async (items, totalAmount) => {

      const body = {
         user: userSession.user._id,
         workspace: workspaceSession._id,
         date: Date.now(),
         items: mapItems(items),
         totalAmount: totalAmount,
         status: 'pending_approval'
      }

      try {
         const response = await createPurchaseOrderRepository(body)
         
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
         setOnPurchaseFailed(error)
      }
   }

   const mapItems = (items) => {
      let result = []

      items.forEach((item) => {
         let purchaseItem = null
         const purchaseItemIndex = item.fields.findIndex((field) => field.type === 'selector')
         if (purchaseItemIndex !== -1) {
            purchaseItem = item.fields[purchaseItemIndex].value
         }

         let description = null
         const descriptionIndex = item.fields.findIndex((field) => field.name === 'description')
         if (descriptionIndex !== -1 && purchaseItemIndex === -1) {
            description = item.fields[descriptionIndex].value
         }

         let quantity = null
         const quantityIndex = item.fields.findIndex((field) => field.name === 'quantity')
         if (quantityIndex !== -1) {
            quantity = item.fields[quantityIndex].value
         }

         let subTotal = null
         const subTotalIndex = item.fields.findIndex((field) => field.name === 'sub_total')
         if (subTotalIndex !== -1) {
            subTotal = item.fields[subTotalIndex].value
            subTotal = convertCurrencyStringToNumber(subTotal)
         }

         let total = null
         const totalIndex = item.fields.findIndex((field) => field.name === 'total')
         if (totalIndex !== -1) {
            total = item.fields[totalIndex].value
            total = convertCurrencyStringToNumber(total)
         }

         const newItem = {
            purchaseItem: purchaseItem,
            description: description,
            quantity: quantity,
            subTotal: subTotal,
            total: total
         }
         result = [...result, newItem]
      })

      return result
   }

   return {
      purchaseItemIsLoading,
      getPurchaseItems,
      purchaseItems,
      createPurchaseOrder,
      onPurchaseFailed,
      setOnPurchaseFailed
   }
}