import { useTransactionRepository } from "./useTransactionRepository";
import { useState } from "react";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const useTransactionViewModel = () => {
   const { fetchTransactionByEntity, createNewPayment, disablePayment, fetchTransactionByInstallment, isLoading } = useTransactionRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [payments, setPayments] = useState([])
   const [onTransactionError, setOnTransactionError] = useState(null)
   const [transactionIsLoading, setTransactionIsLoading] = useState(false)
   const [onCreatedTransactionSuccess, setOnCreatedTransactionSuccess] = useState(false)
   const [onTransactionSuccess, setOnTransactionSuccess] = useState(false)

   const [onTransactionFailed, setOnTransactionFailed] = useState()

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

   const createPayment = async (type, entityModel, amount, remainingAmount, orderId, paymentMethodId, accountId, balanceId, description, installmentId, exchangeRate) => {
      if (Number(exchangeRate * amount) > remainingAmount) {
         setOnTransactionError({
            title: 'Validation Error',
            message: 'Amount exceeds remaining amount'
         })
         return
      }

      if (!balanceId) {
         setOnTransactionError({
            title: 'Validation Error',
            message: 'You need to espicify a balance'
         })
         return
      }

      try {
         setTransactionIsLoading(true)
         const body = {
            workspace: workspaceSession._id,
            user: userSession.user._id,
            amount: amount,
            type: type,
            entity: orderId,
            entityModel: entityModel,
            description: description,
            paymentMethod: paymentMethodId,
            account: accountId,
            balance: balanceId,
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
         console.error('Error:', error.title, error.message);
         setOnTransactionFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnTransactionFailed
         })
      } finally {
         setTransactionIsLoading(true)
      }
   }

   return { getPayments, payments, createPayment, removePayment, getPaymentsByInstallment, transactionIsLoading, onTransactionError, setOnTransactionError, onCreatedTransactionSuccess, onTransactionSuccess, onTransactionFailed, isLoading }
}