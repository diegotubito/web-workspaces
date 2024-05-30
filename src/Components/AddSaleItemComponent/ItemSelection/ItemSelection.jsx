import { useTranslation } from 'react-i18next';
import './ItemSelection.css'

export const ItemSelection = ({ settings, isEnabled, index, orderItem, items, onSelectedItem }) => {
   const { t } = useTranslation()

   const handleSelection = (event) => {
      const _id = event.target.value;
      const selectedItemObject = items.find((i) => i._id === _id)
      onSelectedItem(selectedItemObject, index)
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
            border: '1px solid ' + `${isEnabled ? settings.inputBorderColorEnabled : settings.inputBorderColorDisabled}`,
            width: '100%',
            height: settings.inputHeight,
            borderRadius: settings.borderRadius
         }}
         value={orderItem.saleItemId} // Ensure the value is the saleItemId
         onChange={handleSelection}
         onKeyDown={handleKeyDown} // Add this line
         disabled={!isEnabled}
      >
         <option value="" disabled>
            {t('Select an item')}
         </option>
         {items.map((s) => (
            <option
               key={s._id}
               value={s._id}>{t(s.title)}
            </option>
         ))}
      </select>
   )
}
