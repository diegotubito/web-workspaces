import { useState } from "react";
import { usePhysicalAccountRepository } from "./usePhysicalAccountRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const usePhysicalAccountViewModel = () => {
   const { fetchAllAccounts, fetchAllAccountsByAssigneeRepo, fetchAllAccountsByAssigneeTransferRepo } = usePhysicalAccountRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [accounts, setAccounts] = useState([])

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

   return { getAllAccounts, accounts, fetchAllAccountsByAssignee, fetchAllAccountsByAssigneeTransfer }
}