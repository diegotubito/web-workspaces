import { useState } from "react";
import { useCashCountRepository } from "./useCashCountRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useCashCountViewModel = () => {
   const { fetchCashCountByWorkspaceAndAccount: fetchCashCountByWorkspaceAndAccountRepo } = useCashCountRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [cashCounts, setCashCounts] = useState([])

   const getCashCountsByWorkspaceAndAccount = async (account) => {
      try {
         const response = await fetchCashCountByWorkspaceAndAccountRepo(workspaceSession._id, account._id)
         setCashCounts(response.cashCounts)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getCashCountsByWorkspaceAndAccount, cashCounts }
}