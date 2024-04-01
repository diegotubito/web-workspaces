import { useState } from "react";
import { useInstallmentRepository } from "./useInstallmentRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useInstallmentViewModel = () => {
   const { fetchInstallmentByWorkspaceAndOrderId } = useInstallmentRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [installments, setInstallments] = useState([])

   const getInstallments = async (orderId) => {
      try {
         const response = await fetchInstallmentByWorkspaceAndOrderId(workspaceSession._id, orderId)
         setInstallments(response.installments)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getInstallments, installments }
}