import { useState } from "react";
import { useDiscountPerItemRepository } from "./useDiscountPerItemRepository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";

export const useDiscountPerItemViewModel = () => {
   const { fetchDiscountsPerItemByWorkspace: fetchDiscountsPerItemByWorkspaceRepo } = useDiscountPerItemRepository()
   const { workspaceSession } = useWorkspaceSession()
   const [discountsPerItem, setDiscountsPerItem] = useState([])

   const fetchDiscountsPerItemByWorkspace = async () => {
      try {
         const response = await fetchDiscountsPerItemByWorkspaceRepo(workspaceSession._id)
         setDiscountsPerItem(response.discountsPerItem)
      } catch (error) {
         console.log('Error title:', error.title); // This should show the custom error class name if available
         console.log('Error message:', error.message); // This should show the custom message
      }
   }

   return { fetchDiscountsPerItemByWorkspace, discountsPerItem, setDiscountsPerItem }
}