import { useState } from "react";
import { useCashCountRepository } from "./useCashCountRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";

export const useCashCountViewModel = () => {
   const {
      fetchCashCountByWorkspaceAndAccountLastClosed: fetchCashCountByWorkspaceAndAccountLastClosedRepo,
      closeCashCount: closeCashCountRepo,
      createCashCount: createCashCountRepo,
      fetchCashCountByWorkspaceAndAccount: fetchCashCountByWorkspaceAndAccountRepo,
      isLoading
   } = useCashCountRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()
   const [cashCounts, setCashCounts] = useState([])
   const [onError, setOnError] = useState(null)
   const [onCashCountSuccess, setOnCashCountSuccess] = useState(null)
   const [lastClosedCashCount, setLastClosedCashCount] = useState()


   const getCashCountsByWorkspaceAndAccount = async (account) => {
      try {
         const response = await fetchCashCountByWorkspaceAndAccountRepo(workspaceSession._id, account._id)
         setCashCounts(response.cashCounts)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const fetchCashCountByWorkspaceAndAccountLastClosed = async (account) => {
      try {
         const response = await fetchCashCountByWorkspaceAndAccountLastClosedRepo(workspaceSession._id, account._id)
         setLastClosedCashCount(response.lastCashCount)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const createCashCount = async (account, counts) => {
      try {
         setOnCashCountSuccess(false)
         const body = {
            user: userSession.user._id,
            account: account._id,
            counts: counts
         }
         const response = await createCashCountRepo(body)
         setOnCashCountSuccess(true)
         setOnError(null)
      } catch (error) {
         setOnError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   const closeCashCount = async (cashCountId) => {
      try {
         setOnCashCountSuccess(false)
         const body = {
            correctedBy: userSession.user._id,
            cashCount: cashCountId
         }
         const response = await closeCashCountRepo(body)
         setOnCashCountSuccess(true)
         setOnError(null)
      } catch (error) {
         setOnError(error)
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return {
      fetchCashCountByWorkspaceAndAccountLastClosed,
      lastClosedCashCount,
      closeCashCount,
      createCashCount,
      onCashCountSuccess,
      getCashCountsByWorkspaceAndAccount,
      cashCounts,
      onError,
      setOnError,
      isLoading
   }
}