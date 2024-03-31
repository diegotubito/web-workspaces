import { useTransactionRepository } from "./useTransactionRepository";
import { useState } from "react";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const useTransactionViewModel = () => {
   const { fetchTransactionByEntity, createNewPayment, disablePayment } = useTransactionRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [payments, setPayments] = useState([])
   const [onCreatePaymentSuccess, setOnCreatePaymentSuccess] = useState(false)

   const getPayments = async (purchaseOrderId) => {
      try {
         const response = await fetchTransactionByEntity(workspaceSession._id, purchaseOrderId, 'purchase_order')
         setPayments(response.transactions)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const createPayment = async (amount, orderId, paymentMethodId, accountId, currencyId) => {
      try {
         const body = {
            workspace: workspaceSession._id,
            user: userSession.user._id,
            amount: amount,
            entity: orderId,
            description: "pagando las deudas",
            paymentMethod: paymentMethodId,
            physicalAccount: accountId,
            currency: currencyId
         }
         console.log('bodyyyyy')  
         console.log(body)  
         const response = await createNewPayment(body)
         setOnCreatePaymentSuccess(true)
      } catch (error) {
         setOnCreatePaymentSuccess(false)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const removePayment = async (_id) => {
      try {
         const response = await disablePayment(_id)

      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getPayments, payments, createPayment, removePayment }
}