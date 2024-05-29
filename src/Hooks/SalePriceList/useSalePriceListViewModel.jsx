import { useState } from "react";
import { useSalePriceListRepository } from "./useSalePriceListRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useSalePriceListViewModel = () => {
   const { fetchSalePricesByWorkspace: fetchSalePricesByWorkspaceRepo } = useSalePriceListRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [salePrices, setSalePrices] = useState([])

   const fetchSalePricesByWorkspace = async () => {
      try {
         const response = await fetchSalePricesByWorkspaceRepo(workspaceSession._id)
         setSalePrices(response.salePrices)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { fetchSalePricesByWorkspace, salePrices, setSalePrices }
}