import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './PriceListSelection.css'

export const PriceListSelection = ({ selectedSalePriceList, salePrices, onSelectedPriceList }) => {
   const { t } = useTranslation()
  
   const handleSelection = (event) => {
      const _id = event.target.value;
      const selectedItemObject = salePrices.find((i) => i._id === _id)
      onSelectedPriceList(selectedItemObject)
   }

   return (
      <div>
         <h1 className='add_sale_item__title'>{'Price List'}</h1>
         <select className="add_sale_item__price-list-selector" value={selectedSalePriceList} onChange={handleSelection}>
            {salePrices.map((item) => (
               <option
                  key={item._id}
                  value={item._id}>{t(item.name)}
               </option>
            ))}
         </select>
      </div>
   )
}