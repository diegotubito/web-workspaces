import './DiscountSelection.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const DiscountSelection = ({ settings, isEnabled, index, orderItem, discounts, selectedDiscountPerItem}) => {
   const { t } = useTranslation()
 
   const handleSelection = (event) => {
      const _id = event.target.value;
      const selectedItemObject = discounts.find((i) => i._id === _id )
      selectedDiscountPerItem(selectedItemObject, index)
   }

   const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
         event.preventDefault()
         const form = event.target.form
         if (form) {
            const currentIndex = Array.prototype.indexOf.call(form.elements, event.target)
            if (currentIndex > -1 && currentIndex < form.elements.length - 1) {
               const nextElement = form.elements[currentIndex + 1]
               if (nextElement && nextElement.focus) {
                  nextElement.focus()
               }
            }
         }
      }
   }

   return (
      <select
         style={{
            width: '100%',
            border: '1px solid ' + `${isEnabled ? settings.inputBorderColorEnabled : settings.inputBorderColorDisabled}`,
            height: settings.inputHeight,
            borderRadius: settings.borderRadius
         }}
         value={orderItem.discountPerItemId || ""} // Ensure the value is the discount id or an empty string
         onChange={(event) => handleSelection(event)}
         onKeyDown={(event) => handleKeyDown(event)}
         disabled={!isEnabled}
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