import { useState } from "react";
import { useInstallmentRepository } from "./useInstallmentRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useInstallmentViewModel = () => {
   const { fetchInstallmentByWorkspaceAndOrderId, fetchInstallmentById, isLoading } = useInstallmentRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [installments, setInstallments] = useState([])
   const [installment, setInstallment] = useState([])
   const [ onInstallmentFailed, setOnInstallmentFailed] = useState()

   const getInstallments = async (orderId) => {
      try {
         const response = await fetchInstallmentByWorkspaceAndOrderId(workspaceSession._id, orderId)
         setInstallments(response.installments)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnInstallmentFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnInstallmentFailed
         })
      }
   }

   const getInstallmentById = async (_id) => {
      try {
         const response = await fetchInstallmentById(_id)
         setInstallment(response.installment)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnInstallmentFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnInstallmentFailed
         })
      }
   }

   return { getInstallments, installments, getInstallmentById, installment, onInstallmentFailed, isLoading }
}