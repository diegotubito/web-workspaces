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

   const getOrders = async (type) => {
      try {
         const response = await fetchOrdersByWorkspace(workspaceSession._id, type)
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

   const createOrder = async (type, items, totalAmount, stakeholder, selectedPaymentItem, selectedCurrency, installmentNumber, selectedSalePriceListId) => {
      if (stakeholder === null || stakeholder === undefined) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "Select a stakeholder.",
            action: 'none',
            setError: setOnOrderFailed
         })
         return
      }

      if (items.length === 0) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "At least, add one item.",
            action: 'none',
            setError: setOnOrderFailed
         })
         return
      }

      if (selectedSalePriceListId === null || selectedSalePriceListId === undefined) {
         setOnOrderFailed({
            title: "Validation Error",
            message: "Select a sale price.",
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

      const body = {
         user: userSession.user._id,
         workspace: workspaceSession._id,
         date: Date.now(),
         stakeholder: stakeholder,
         items: mapItems(items, selectedSalePriceListId),
         totalAmount: totalAmount,
         status: 'pending_approval',
         paymentMethod: selectedPaymentItem,
         currency: selectedCurrency._id,
         numberOfInstallments: installmentNumber,
         type: type,
         exchangeRate: selectedCurrency.exchangeRate
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

   const mapItems = (items, priceListId) => {
      let result = []

      items.forEach((item) => {
         const newItem = {
            item: item.saleItemId,
            description: item.note,
            quantity: item.quantity,
            price: item.price,
            discount: item.discountPerItemId,
            discountRate: item.discount,
            priceList: priceListId,
            priceListRate: item.priceListRate,
            total: item.total
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