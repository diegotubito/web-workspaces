import { useTransactionRepository } from "./useTransactionRepository";
import { useState } from "react";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const useTransactionViewModel = () => {
   const { fetchTransactionByEntity, createNewPayment, disablePayment, fetchTransactionByInstallment } = useTransactionRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [payments, setPayments] = useState([])
   const [onTransactionError, setOnTransactionError] = useState(null)
   const [transactionIsLoading, setTransactionIsLoading] = useState(false)
   const [onCreatedTransactionSuccess, setOnCreatedTransactionSuccess] = useState(false)
   const [onTransactionSuccess, setOnTransactionSuccess] = useState(false)

   const getPayments = async (purchaseOrderId) => {
      try {
         setTransactionIsLoading(true)
         const response = await fetchTransactionByEntity(workspaceSession._id, purchaseOrderId, 'purchase_order')
         setPayments(response.transactions)
         setOnTransactionError(null)
      } catch (error) {
         setOnTransactionError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      } finally {
         setTransactionIsLoading(false)
      }
   }

   const getPaymentsByInstallment = async (installmentId) => {
      try {
         setTransactionIsLoading(true)
         const response = await fetchTransactionByInstallment(installmentId)
         setPayments(response.transactions)
         setOnTransactionError(null)
      } catch (error) {
         setOnTransactionError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
         
      } finally {
         setTransactionIsLoading(false)
      }
   }

   const createPayment = async (amount, orderId, paymentMethodId, accountId, currencyId, description, installmentId, exchangeRate) => {
      try {
         setTransactionIsLoading(true)
         const body = {
            workspace: workspaceSession._id,
            user: userSession.user._id,
            amount: amount,
            entity: orderId,
            description: description,
            paymentMethod: paymentMethodId,
            physicalAccount: accountId,
            currency: currencyId,
            installment: installmentId,
            exchangeRate: exchangeRate
         }
         const response = await createNewPayment(body)
         setOnTransactionError(null)
         setOnCreatedTransactionSuccess(true)
      } catch (error) {
         setOnTransactionError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      } finally {
         setTransactionIsLoading(false)
      }
   }

   const removePayment = async (_id) => {
      try {
         setTransactionIsLoading(true)
         const response = await disablePayment(_id)
         setOnTransactionError(null)
         setOnTransactionSuccess(true)
      } catch (error) {
         setOnTransactionError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      } finally {
         setTransactionIsLoading(true)
      }
   }

   return { getPayments, payments, createPayment, removePayment, getPaymentsByInstallment, transactionIsLoading, onTransactionError, setOnTransactionError, onCreatedTransactionSuccess, onTransactionSuccess }
}