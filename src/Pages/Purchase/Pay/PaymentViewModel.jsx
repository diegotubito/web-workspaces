import { useState } from "react"
import { useWorkspaceSession } from "../../../Utils/Contexts/workspaceSessionContext"
import { usePaymentRepository } from "./PaymentRepository"

export const usePaymentViewModel = () => {
   const { workspaceSession } = useWorkspaceSession()
   const { fetchPaymentMethods } = usePaymentRepository()
   const [paymentMethods, setPaymentMethods] = useState([])

   const fetchAllMethods = async () => {
      try {
         const response = await fetchPaymentMethods(workspaceSession._id)
         setPaymentMethods(response.methods)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { fetchAllMethods, paymentMethods }
}