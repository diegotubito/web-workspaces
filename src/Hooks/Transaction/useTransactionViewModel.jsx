import { useTransactionRepository } from "./useTransactionRepository";
import { useState } from "react";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const useTransactionViewModel = () => {
   const { fetchTransactionByWorkspaceAndAccountAndDate: fetchTransactionByWorkspaceAndAccountAndDateRepo, fetchTransactionByWorkspaceAndAccount: fetchTransactionByWorkspaceAndAccountRepo, fetchTransactionByEntity, createNewPayment, disablePayment, fetchTransactionByInstallment, isLoading, transferFundsRepo } = useTransactionRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [payments, setPayments] = useState([])
   const [onTransactionError, setOnTransactionError] = useState(null)
   const [transactionIsLoading, setTransactionIsLoading] = useState(false)
   const [onCreatedTransactionSuccess, setOnCreatedTransactionSuccess] = useState(false)
   const [onTransactionSuccess, setOnTransactionSuccess] = useState(false)

   const [onTransactionFailed, setOnTransactionFailed] = useState()

   const [onTransferError, setOnTransferError] = useState(null)
   const [transferSucceed, setTransferSucceed] = useState()

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

   const fetchTransactionByWorkspaceAndAccount = async (account) => {
      try {
         setTransactionIsLoading(true)
         const response = await fetchTransactionByWorkspaceAndAccountRepo(workspaceSession._id, account._id)
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

   const fetchTransactionByWorkspaceAndAccountAndDates = async (account, fromDate, toDate) => {
      try {
         setTransactionIsLoading(true)
         const response = await fetchTransactionByWorkspaceAndAccountAndDateRepo(workspaceSession._id, account._id, fromDate, toDate)
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
  
   const createPayment = async (type, entityModel, amount, installment, accountId, balanceId, description, installmentId, exchangeRate, stakeholder) => {
      if (Number(exchangeRate * amount) > (installment?.remainingAmount ?? 0)) {
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
            entity: installment.order._id,
            entityModel: entityModel,
            description: description,
            account: accountId,
            balance: balanceId,
            installment: installmentId,
            exchangeRate: exchangeRate,
            stakeholder: installment.stakeholder
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

   const transferFunds = async (fromAccountId, fromBalanceObject, toAccountId, toBalanceObject, amount, convertionRate) => {

      if (!fromAccountId || !fromBalanceObject || !toAccountId || !toBalanceObject || !amount) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'All fields are required.'
         })
      }

      if (fromBalanceObject._id === toBalanceObject._id) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'Balances must be different.'
         })
      }

      if (fromBalanceObject.paymentMethod._id !== toBalanceObject.paymentMethod._id) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'Payment method must be equal.'
         })
      }

      try {
         const body = {
            workspace: workspaceSession._id,
            user: userSession.user._id,
            fromAccountId: fromAccountId,
            fromBalanceId: fromBalanceObject._id,
            toAccountId: toAccountId,
            toBalanceId: toBalanceObject._id,
            amount: amount,
            convertionRate: convertionRate
         }
         const response = await transferFundsRepo(workspaceSession._id, userSession.user._id, body)
         setTransferSucceed(true)
         setOnTransferError(null)
      } catch (error) {
         setOnTransferError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return {
      getPayments,
      payments,
      createPayment,
      removePayment,
      getPaymentsByInstallment,
      transactionIsLoading,
      onTransactionError,
      setOnTransactionError,
      onCreatedTransactionSuccess,
      onTransactionSuccess,
      onTransactionFailed,
      isLoading,
      transferFunds,
      onTransferError,
      setOnTransferError,
      transferSucceed,
      setTransferSucceed,
      fetchTransactionByWorkspaceAndAccount,
      fetchTransactionByWorkspaceAndAccountAndDates
   }
}