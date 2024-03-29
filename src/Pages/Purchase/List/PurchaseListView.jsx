import { useEffect, useState } from 'react'
import './PurchaseListView.css'

export const PurchaseListView = ({ gap, items, setItems, selectionMode }) => {
   useEffect(() => {
      console.log('items updated')
   }, [items])

   const itemDidSelect = (item) => {
      if (selectionMode === 'none') { return }
      
      const updatedItems = items.map((i) => {
         if (i._id === item._id) {
            return { ...i, isSelected: !item.isSelected }
         } else {
            if (selectionMode === 'single') {
               return { ...i, isSelected: false}
            } else {
               return i
            }
         }
      })
      setItems(updatedItems)
   }

   const getBackgroundColor = (item, fieldIndex) => {
      let result = ''

      if (item.isSelected) {
         result = 'var(--primary)'
      } else {
         if (fieldIndex % 2 === 0) {
            result = 'var(--grayPair)'
         } else {
            result = 'var(--grayEven)'
         }
      }

      return result
   }

   const getForegroundColor = (item) => item.isSelected ? 'var(--white)' : 'dark'

   const getGridValues = (item) => {
      const forInputs = item.fields.map(field => `minmax(${field.minWidth}, ${field.maxWidth})`).join(' ')
      const forInputsWithRemoveButton = forInputs + ' minmax(1rem, 1rem) minmax(1rem, 1rem)'

      return item.removeIsAllowed ? forInputsWithRemoveButton : forInputs
   }

   return (

      <div style={{
         fontSize: 'small',
         gap: gap,
         background: 'none'
      }}
         className='purchase_order__container'
      >
         {items.map((item) => {
            return (
               <div
                  className='purchase_order__cell'
                  key={`${item._id}-${item.isSelected}`}
                  onClick={() => itemDidSelect(item)}
                  style={{
                     display: 'grid',
                     gridTemplateColumns: getGridValues(item),
                     gap: gap,
                     color: getForegroundColor(item),
                  }}
               >

                  {item.fields.map((field, fieldIndex) => {
                     return (
                        <span
                           key={field._id}
                           style={{
                              overflow: 'auto',
                              padding: '0.7rem',
                              textAlign: field.alignment,
                              background: getBackgroundColor(item, fieldIndex),
                           }}
                        > {field.value} </span>
                     )
                  })}

               </div>
            )
         })}
      </div>
   )
}