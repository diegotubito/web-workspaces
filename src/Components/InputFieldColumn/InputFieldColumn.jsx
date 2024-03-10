import { useEffect, useState } from 'react';
import './InputFieldColumn.css';
import { InputFieldColumnTextType } from './InputFieldColumnTextType';
import { InputFieldColumnSelectorType } from './InputFieldColumnSelectorType';

export const InputFieldColumn = ({ items, setItems }) => {

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
                           gridTemplateColumns: item.fields.map(field => `minmax(${field.minWidth}, ${field.maxWidth})`).join(' '),
                           alignItems: 'center',
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
                                             items={items}
                                             setItems={setItems}
                                             field={field}
                                             item={item}
                                          /> : null
                                    }


                                    {
                                       field.type === 'text' ?
                                          <InputFieldColumnTextType
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

                     </div>

                     {item.footer && <div>{item.footer}</div>}

                  </div>
               )

            })}

         </div>

      </div>
   );
};
