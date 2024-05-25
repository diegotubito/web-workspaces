import { useEffect, useState } from "react"
import { useItemViewModel } from "../../../Hooks/Item/useItemViewModel";
import { useTranslation } from 'react-i18next';

export const SaleItemSelector = ({selectedSaleItem, setSelectedSaleItem}) => {
   const { t } = useTranslation()
   
   const { 
      fetchItemsByWorkspaceAndStakeholder,
      saleItems,
      saleItemsIsLoading,
      onGetSaleFailed,
      setOnGetSaleFailed,
      fetchItemsByWorkspace 
   } = useItemViewModel()

   useEffect(() => {
      fetchItemsByWorkspace()
   }, [])

   const onSelectedItem = (event) => {
      const value = event.target.value
      const item = saleItems.find((item) => item._id === value)
      setSelectedSaleItem(item)
   }

   return (
      <div>
         <div>
            <h3 className='purchase_view__form-title'>{t('Select Sale Item')}</h3>
            <select className="form-select" onChange={onSelectedItem}>
               {saleItems.map((item) => {
                  return (
                     <option key={item._id} value={item._id}>{item.title} {item.description}</option>
                  )
               }
               )}
            </select>
         </div>
      </div>
   )
}