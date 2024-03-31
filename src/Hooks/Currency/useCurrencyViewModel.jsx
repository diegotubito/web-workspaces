import { useState } from "react";
import { useCurrencyRepository } from "./useCurrencyRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useCurrencyViewModel = () => {
   const { fetchCurrenciesByWorkspace } = useCurrencyRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [currencies, setCurrencies] = useState([])

   const getCurrencies = async () => {
      try {
         const response = await fetchCurrenciesByWorkspace(workspaceSession._id)
         setCurrencies(response.currencies)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { getCurrencies, currencies }
}