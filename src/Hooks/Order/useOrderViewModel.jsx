import { useOrderRepository } from './useOrderRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useState } from 'react'
import { convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'

export const useOrderViewModel = () => {
   const {
      isLoading: itemIsLoading,
      fetchItemsByWorkspace,
      fetchOrdersByWorkspace,
      createOrder: createOrderRepository,
      error: itemError,
      fetchOrdersById,
      updateOrderStatusFromRepo,
      isLoading
   } = useOrderRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [onOrderFailed, setOnOrderFailed] = useState(null)
   const [onOrderSuccess, setOnOrderSuccess] = useState(false)
   const [ orders, setOrders] = useState([])
   const [order, setOrder] = useState({})

   const getOrders = async () => {
      try {
         const response = await fetchOrdersByWorkspace(workspaceSession._id)
         setOrders(response.orders)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnOrderFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnOrderFailed
         })
      }
   }

   const getOrderById = async (_id) => {
      try {
         const response = await fetchOrdersById(_id)
         setOrder(response.order)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnOrderFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnOrderFailed
         })
      }
   }

   const updateOrderStatus = async (_id, status) => {
      try {
         const response = await updateOrderStatusFromRepo(_id, status)
         setOnOrderSuccess(true)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnOrderFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnOrderFailed
         })
      }
   }

   const createOrder = async (items, totalAmount, stakeholder, selectedPaymentItem, selectedCurrency, installmentNumber) => {
      if (items.length === 0) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "At least, add one item.",
            action: 'none',
            setError: setOnOrderFailed
         })
         return
      }

      if (!totalAmount) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "Amount must not be zero",
            action: 'none',
            setError: setOnOrderFailed
         })
         return
      }

      if (!stakeholder) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "Stakeholder needed",
            action: 'none',
            setError: setOnOrderFailed
         })
         return
      }

      const body = {
         user: userSession.user._id,
         workspace: workspaceSession._id,
         date: Date.now(),
         stakeholder: stakeholder,
         items: mapItems(items),
         totalAmount: totalAmount,
         status: 'pending_approval',
         paymentMethod: selectedPaymentItem,
         currency: selectedCurrency,
         numberOfInstallments: installmentNumber
      }

      try {
         const response = await createOrderRepository(body)
         setOnOrderSuccess(true)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnOrderFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'pop',
            setError: setOnOrderFailed
         })
      }
   }

   const mapItems = (items) => {
      let result = []

      items.forEach((item) => {
         let auxItem = null;
         const itemIndex = item.fields.findIndex((field) => field.type === 'selector');
         // Si encontramos un índice válido, asignamos el valor correspondiente a purchaseItem
         if (itemIndex !== -1) {
            auxItem = item.fields[itemIndex].value;
         }
         // Si purchaseItem es una cadena vacía, lo ajustamos a null
         if (auxItem === '') {
            auxItem = null;
         }


         let description = null
         const descriptionIndex = item.fields.findIndex((field) => field.name === 'description')
         if (descriptionIndex !== -1 && itemIndex === -1) {
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
            item: auxItem,
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
      itemIsLoading,
      createOrder,
      onOrderFailed,
      onOrderSuccess,
      setOnOrderSuccess,
      getOrders,
      orders,
      setOrders,
      getOrderById,
      order,
      updateOrderStatus,
      isLoading
   }
}