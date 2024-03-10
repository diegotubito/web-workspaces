import { useEffect, useState } from 'react';
import './InputFieldColumn.css';

export const InputFieldColumn = ({ items, setItems }) => {

   
   const onChangeHandler = (event, itemId, fieldId) => {
      const newValue = event.target.value;
      const updatedItems = updateItemField(itemId, fieldId, newValue);
      setItems(updatedItems);
   };

   const updateItemField = (itemId, fieldId, newValue) => {
      const updatedItems = items.map(item => {
         if (item._id === itemId) {
            return {
               ...item,
               fields: item.fields.map(field => {
                  if (field._id === fieldId) {
                     return { ...field, value: newValue };
                  }
                  return field;
               }),
            };
         }
         return item;
      });

      return updatedItems
   };


   return (
      <div className='input_field_column__container'>
         {/* Title */}
         <h1>Input Field Column</h1>

         {/* Traversing Items */}
         {items.map((item) => {

            {/* Traversing Fields */ }

            return (
               <div key={item._id} >

                  {item.title && <div>{item.title}</div>}

                  <div className='input_field_column__cell'
                     style={{
                        display: 'grid',
                        gridTemplateColumns: item.fields.map(field => `minmax(${field.minWidth}, ${field.maxWidth})`).join(' '),
                        alignItems: 'center',
                        gap: '5px',
                        width: '100%'
                     }}
                  >

                     {
                        item.fields.map((field) => {
                           return (
                              <div key={field._id} className='input borderless'>
                                 {
                                    field.type === 'selector' ?

                                       <select id="" className='input' onChange={console.log('changed')}>
                                          {field.selectorItems.map((selectorItem) => {
                                             return (
                                                <option
                                                   key={selectorItem._id}
                                                   value={selectorItem._id}
                                                >{selectorItem.title}</option>
                                             )
                                          }
                                          )}
                                       </select>
                                       : null
                                 }

                                 {
                                    field.type === 'text' ?

                                       <div className='input borderless'>
                                          <input
                                             // ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                                             className='input '
                                             type="text"
                                             placeholder='Description'
                                             value={field.value}
                                             onChange={(event) => onChangeHandler(event, item._id, field._id)}
                                             //    onBlur={(event) => onBlurHandler(event, field._id)}
                                             autoComplete='off'
                                          />

                                       </div> : null
                                 }
                              </div>
                           )
                        })
                     }

                  </div>

                  {item.footer && <div>{item.footer}</div>}

               </div>
            )

         })}

      </div>
   );
};
