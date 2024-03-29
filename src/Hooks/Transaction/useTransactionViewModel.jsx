import { useTransactionRepository } from "./useTransactionRepository";
import { useState } from "react";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useTransactionViewModel = () => {
   const { fetchTransactionByEntity } = useTransactionRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [payments, setPayments] = useState([])

   const getPayments = async (purchaseOrderId) => {
      try {
         const response = await fetchTransactionByEntity(workspaceSession._id, purchaseOrderId, 'purchase_order')
         setPayments(response.transactions)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getPayments, payments }
}