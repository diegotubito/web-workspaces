import { usePurchaseRepository } from './usePurchaseRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useState } from 'react'
import { convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'

export const usePurchaseViewModel = () => {
   const {
      isLoading: purchaseItemIsLoading,
      fetchPurchaseItemsByWorkspace,
      fetchPurchaseOrdersByWorkspace,
      createPurchaseOrder: createPurchaseOrderRepository,
      error: purchaseItemError,
      fetchPurchaseOrdersById,
      updatePurchaseOrderStatus
   } = usePurchaseRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [purchaseItems, setPurchaseItems] = useState([])
   const [onPurchaseFailed, setOnPurchaseFailed] = useState(null)
   const [onPurchaseSuccess, setOnPurchaseSuccess] = useState(false)
   const [ orders, setOrders] = useState([])
   const [order, setOrder] = useState({})
   const [onPurchaseOrderSuccess, setOnPurchaseOrderSuccess] = useState(false)

   const getPurchaseItems = async () => {

      try {
         const response = await fetchPurchaseItemsByWorkspace(workspaceSession._id)
         setPurchaseItems(response.items)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const getPurchaseOrders = async () => {
      try {
         const response = await fetchPurchaseOrdersByWorkspace(workspaceSession._id)
         setOrders(response.orders)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
         setOnPurchaseFailed(error)
      }
   }

   const getPurchaseOrderById = async (_id) => {
      try {
         const response = await fetchPurchaseOrdersById(_id)
         setOrder(response.order)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
         setOnPurchaseFailed(error)
      }
   }

   const updateOrderStatus = async (_id, status) => {
      try {
         const response = await updatePurchaseOrderStatus(_id, status)
         setOnPurchaseOrderSuccess(true)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const createPurchaseOrder = async (items, totalAmount, purchaseItemId, selectedPaymentItem, selectedCurrency, installmentNumber) => {
      if (!totalAmount) {
         setOnPurchaseFailed({
            title: "Validation Error",
            message: "Amount must not be zero",
            action: 'none',
            setError: setOnPurchaseFailed
         })
         return
      }

      const body = {
         user: userSession.user._id,
         workspace: workspaceSession._id,
         date: Date.now(),
         purchaseItem: purchaseItemId,
         items: mapItems(items),
         totalAmount: totalAmount,
         status: 'pending_approval',
         paymentMethod: selectedPaymentItem,
         currency: selectedCurrency,
         numberOfInstallments: installmentNumber
      }

      try {
         const response = await createPurchaseOrderRepository(body)
         setOnPurchaseSuccess(true)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnPurchaseFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'pop',
            setError: setOnPurchaseFailed
         })
      }
   }

   const mapItems = (items) => {
      let result = []

      items.forEach((item) => {
         let saleItem = null
         const saleItemIndex = item.fields.findIndex((field) => field.type === 'selector')
         if (saleItemIndex !== -1) {
            saleItem = item.fields[saleItemIndex].value
         }

         let description = null
         const descriptionIndex = item.fields.findIndex((field) => field.name === 'description')
         if (descriptionIndex !== -1 && saleItemIndex === -1) {
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
            saleItem: saleItem,
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
      setOnPurchaseFailed,
      onPurchaseSuccess,
      setOnPurchaseSuccess,
      getPurchaseOrders,
      orders,
      setOrders,
      getPurchaseOrderById,
      order,
      updateOrderStatus,
      onPurchaseOrderSuccess
   }
}