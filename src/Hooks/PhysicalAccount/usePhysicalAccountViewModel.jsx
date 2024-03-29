import { useState } from "react";
import { usePhysicalAccountRepository } from "./usePhysicalAccountRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const usePhysicalAccountViewModel = () => {
   const { fetchAllAccounts } = usePhysicalAccountRepository()
   const { workspaceSession } = useWorkspaceSession()
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

   return { getAllAccounts, accounts }
}