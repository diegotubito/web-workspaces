import { useEffect, useState } from 'react'
import './PurchaseListView.css'

export const PurchaseListView = ({ items, selectedItem, setSelectedItem }) => {
   const itemDidSelect = (itemIndex) => {
     if (itemIndex === selectedItem) {
      setSelectedItem(null)
     } else {
      setSelectedItem(itemIndex)
     }
   }

   const getBackgroundColor = (itemIndex, fieldIndex) => {
      let result = ''
      
      if (itemIndex === selectedItem) {
         return 'var(--highlightBlue)'
      } else {
         if (fieldIndex%2===0) {
            result = 'var(--grayPair)'
         } else {
            result = 'var(--grayEven)'
         }
      }

      return result
   }

   const getForegroundColor = (itemIndex, fieldIndex) => {
      let result = 'yellow'

      if (itemIndex === selectedItem) {
         result = 'white'
      } else {
         if (fieldIndex % 2 === 0) {
            result = 'dark'
         } else {
            result = 'dark'
         }
      }

      return result
   }


   return (

      <div style={{
         fontSize: 'small',
         gap: '1px',
         background: 'none'
      }}
         className='purchase_order__container'
      >
         {items.map((item, itemIndex) => {
            return (
               <div
                  onClick={() => itemDidSelect(itemIndex)}
                  style={{
                     display: 'grid',
                     gridTemplateColumns: 'minmax(5rem, 1fr) minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(10rem, 1fr)',
                     gap: '1px',
                    
                  }}
                  
                  key={item._id}
                  className='purchase_order__cell'
                 
               >

                  {item.fields.map((field, fieldIndex) => {
                     return (
                        <span key={field._id} style={{
                           overflow: 'auto',
                           padding: '0.7rem',
                           background: getBackgroundColor(itemIndex, fieldIndex),
                           color: getForegroundColor(itemIndex, fieldIndex),
                        }} >{field.value} </span>
                     )
                  })}

               </div>
            )
         })}
      </div>
   )
}