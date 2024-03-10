import { useEffect, useState } from 'react';
import './InputFieldColumn.css';
import { InputFieldColumnTextType } from './InputFieldColumnTextType';
import { InputFieldColumnSelectorType } from './InputFieldColumnSelectorType';
import { ReactComponent as TrashIcon } from '../../Resources/Images/delete_icon.svg';

export const InputFieldColumn = ({ items, setItems }) => {
   const settings = {
      inputHeight: '3rem'
   }


   const onRemoveButtonClicked = (_id) => {
      const index = items.findIndex((item) => { return item._id === _id })
      if (index !== -1) {
         const newItems = [...items];
         newItems.splice(index, 1);
         setItems(newItems);
      }
   }

   const getGridValues = (item) => {
      const result = item.fields.map(field => `minmax(${field.minWidth}, ${field.maxWidth})`).join(' ') + ' minmax(1rem, 1rem)'
      return result + ' minmax(1rem, 1rem)'
   }

   return (

      <div className='input_field_column__main'>
         {/* Title */}
         <h1>Input Field Column</h1>


         <div className='input_field_column__container'>

            {/* Traversing Items */}
            {items.map((item) => {

               {/* Traversing Fields */ }

               return (
                  <div key={item._id} >

                     {item.title && <div>{item.title}</div>}


                     <div
                        style={{
                           display: 'grid',
                           gridTemplateColumns: getGridValues(item),
                           alignItems: 'basement',
                           gap: '5px',
                           width: '100%'
                        }}
                     >

                        {
                           item.fields.map((field) => {
                              return (
                                 <div key={field._id}>
                                    {
                                       field.type === 'selector' ?
                                          <InputFieldColumnSelectorType
                                             settings={settings}
                                             items={items}
                                             setItems={setItems}
                                             field={field}
                                             item={item}
                                          /> : null
                                    }


                                    {
                                       field.type === 'text' ?
                                          <InputFieldColumnTextType
                                             settings={settings}
                                             items={items}
                                             setItems={setItems}
                                             field={field}
                                             item={item}
                                          /> : null
                                    }
                                 </div>
                              )
                           })
                        }

                        {
                           items.length > 1 &&
                           <TrashIcon
                              style={{
                                 height: settings.inputHeight
                              }}
                              className='input_field_column__trash-button'
                              onClick={() => onRemoveButtonClicked(item._id)} />
                        }

                     </div>
                     {item.footer && <div>{item.footer}</div>}
                  </div>
               )
            })}
         </div>
      </div>
   );
};
