import './DiscountSelection.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const DiscountSelection = ({index, orderItem, discounts, selectedDiscountPerItem}) => {
   const { t } = useTranslation()
   const [selectedItemId, setSelectedItemId] = useState()

   const handleSelection = (event) => {
      const _id = event.target.value;
      setSelectedItemId(_id)
      const selectedItemObject = discounts.find((i) => i._id === _id )
      selectedDiscountPerItem(selectedItemObject, index)
   }

   return (
      <select
         style={{
            width: '100%',
            border: '1px solid rgb(180, 180, 180)',
            height: '3rem'
         }}
         value={orderItem.discountPerItemId || ""} // Ensure the value is the discount id or an empty string
         onChange={(event) => handleSelection(event)}
      >
         <option value="">Ninguna</option> {/* Optional first option */}
         {discounts.map((s) => (
            <option
               key={s._id}
               value={s._id}>{t(s.name)}
            </option>
         ))}
      </select>
   )
}