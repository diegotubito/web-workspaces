import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './ItemSelection.css'

export const ItemSelection = ({ index, orderItem, items, onSelectedItem }) => {
   const { t } = useTranslation()
   const [selectedItemId, setSelectedItemId] = useState()

   const handleSelection = (event) => {
      const _id = event.target.value;
      setSelectedItemId(_id)
      const selectedItemObject = items.find((i) => i._id === _id)
      onSelectedItem(selectedItemObject, index)
   }

   return (
      <select
         style={{
            width: '100%',
            border: '1px solid rgb(180, 180, 180)',
            height: '3rem'
         }}
         value={orderItem.saleItemId} // Ensure the value is the saleItemId
         onChange={(event) => handleSelection(event)}
      >
         {items.map((s) => (
            <option
               key={s._id}
               value={s._id}>{t(s.title)}
            </option>
         ))}
      </select>
   )
}