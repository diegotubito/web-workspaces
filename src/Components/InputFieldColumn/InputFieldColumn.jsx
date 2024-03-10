import { useEffect, useState } from 'react';
import './InputFieldColumn.css';
import { InputFieldColumnTextType } from './InputFieldColumnTextType';
import { InputFieldColumnSelectorType } from './InputFieldColumnSelectorType';

import { InputFieldColumnRemove } from './InputFieldColumnRemove';
import { InputFieldColumnCurrencyType } from './InputFieldColumnCurrencyType';

export const InputFieldColumn = ({ items, setItems }) => {
   const settings = {
      inputHeight: '3rem'
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

                                    {
                                       field.type === 'currency' ?
                                       <InputFieldColumnCurrencyType
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
                           <InputFieldColumnRemove 
                              settings={settings}
                              items={items}
                              setItems={setItems}
                              item={item}
                           />
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
