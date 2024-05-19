import { useState } from "react";
import { usePhysicalAccountRepository } from "./usePhysicalAccountRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const usePhysicalAccountViewModel = () => {
   const { transferFundsRepo, fetchAllAccounts, fetchAllAccountsByAssigneeRepo, fetchAllAccountsByAssigneeTransferRepo, isLoading } = usePhysicalAccountRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [accounts, setAccounts] = useState([])
   const [transferSucceed, setTransferSucceed] = useState()

   const [onTransferError, setOnTransferError] = useState(null)

   const getAllAccounts = async () => {
      try {
         const response = await fetchAllAccounts(workspaceSession._id)
         setAccounts(response.accounts)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const fetchAllAccountsByAssignee = async () => {
      try {
         const response = await fetchAllAccountsByAssigneeRepo(workspaceSession._id, userSession.user._id)
         setAccounts(response.accounts)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const fetchAllAccountsByAssigneeTransfer = async () => {
      try {
         const response = await fetchAllAccountsByAssigneeTransferRepo(workspaceSession._id, userSession.user._id)
         setAccounts(response.accounts)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
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

      if (fromBalanceObject.currency._id !== toBalanceObject.currency._id) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'Currencies must be equal.'
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

   return { transferFunds, getAllAccounts, accounts, fetchAllAccountsByAssignee, fetchAllAccountsByAssigneeTransfer, transferSucceed, onTransferError, setOnTransferError, isLoading }
}