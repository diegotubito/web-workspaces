import { useSaleRepository } from './useSaleRepository'
import { useWorkspaceSession } from '../../Utils/Contexts/workspaceSessionContext'
import { useUserSession } from '../../Utils/Contexts/userSessionContext'
import { useState } from 'react'
import { convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'

export const useSaleViewModel = () => {
   const {
      isLoading: saleItemIsLoading,
      fetchSaleItemsByWorkspace,
      fetchSaleOrdersByWorkspace,
      createSaleOrder: createSaleOrderRepository,
      error: saleItemError,
      fetchSaleOrdersById,
      updateSaleOrderStatus,
      isLoading
   } = useSaleRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [onSaleFailed, setOnSaleFailed] = useState(null)
   const [onSaleSuccess, setOnSaleSuccess] = useState(false)
   const [orders, setOrders] = useState([])
   const [order, setOrder] = useState({})
   const [onSaleOrderSuccess, setOnSaleOrderSuccess] = useState(false)

   const getSaleOrders = async () => {
      try {
         const response = await fetchSaleOrdersByWorkspace(workspaceSession._id)
         setOrders(response.orders)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnSaleFailed
         })
      }
   }

   const getSaleOrderById = async (_id) => {
      try {
         const response = await fetchSaleOrdersById(_id)
         setOrder(response.order)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnSaleFailed
         })
      }
   }

   const updateOrderStatus = async (_id, status) => {
      try {
         const response = await updateSaleOrderStatus(_id, status)
         setOnSaleOrderSuccess(true)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnSaleFailed
         })
      }
   }

   const createSaleOrder = async (items, totalAmount, stakeholder, selectedPaymentItem, selectedCurrency, installmentNumber) => {
      if (items.length === 0) {
         return setOnSaleFailed({
            title: "Validation Error",
            message: "At least, add one item.",
            action: 'none',
            setError: setOnSaleFailed
         })
      }

      if (!totalAmount) {
         return setOnSaleFailed({
            title: "Validation Error",
            message: "Amount must not be zero",
            action: 'none',
            setError: setOnSaleFailed
         })
      }

      if(!stakeholder) {
         return setOnSaleFailed({
            title: "Validation Error",
            message: "Customer not selected",
            action: "none",
            setError: setOnSaleFailed
         })
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
         const response = await createSaleOrderRepository(body)
         setOnSaleSuccess(true)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnSaleFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'pop',
            setError: setOnSaleFailed
         })
      }
   }

   const mapItems = (items) => {
      let result = []

      items.forEach((item) => {
         let saleItem = null;

         if (!item.fields) { return }
         
         const saleItemIndex = item.fields.findIndex((field) => field.type === 'selector');
         
         // Si encontramos un índice válido, asignamos el valor correspondiente a purchaseItem
         if (saleItemIndex !== -1) {
            saleItem = item.fields[saleItemIndex].value;
         }
         // Si purchaseItem es una cadena vacía, lo ajustamos a null
         if (saleItem === '') {
            saleItem = null;
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
            item: saleItem,
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
      saleItemIsLoading,
      createSaleOrder,
      onSaleFailed,
      onSaleSuccess,
      setOnSaleSuccess,
      getSaleOrders,
      orders,
      setOrders,
      getSaleOrderById,
      order,
      updateOrderStatus,
      onSaleOrderSuccess,
      isLoading
   }
}