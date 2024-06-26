import { useEffect, useState } from 'react';
import './InputFieldColumn.css';
import { InputFieldColumnTextType } from './InputFieldColumnTextType';
import { InputFieldColumnSelectorType } from './InputFieldColumnSelectorType';

import { InputFieldColumnRemove } from './InputFieldColumnRemove';
import { InputFieldColumnCurrencyType } from './InputFieldColumnCurrencyType';
import { InputFieldColumnQuantityType } from './InputFieldColumnQuantity';
import { formatCurrency } from '../../Utils/Common/formatCurrency';

export const InputFieldColumn = ({ title, items, setItems }) => {
   const [selectedOptionId, setSelectedOptionId] = useState()

   const settings = {
      inputHeight: '3rem',
      inputBorderColorEnabled: 'rgb(180, 180, 180)',
      inputBorderColorDisabled: 'rgb(220, 220, 220)',
   }

   const getGridValues = (item) => {
      const forInputs = item.fields.map(field => `minmax(${field.minWidth}, ${field.maxWidth})`).join(' ')
      const forInputsWithRemoveButton = forInputs + ' minmax(1rem, 1rem) minmax(1rem, 1rem)'

      return item.removeIsAllowed ? forInputsWithRemoveButton : forInputs
   }

   return (

      <div className='input_field_column__main'>
         {/* Title */}
         { title &&
            <h1 className='input_field_column__title'>{title}</h1>         
         }


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
                                             setSelectedOptionId={setSelectedOptionId}
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

                                    {
                                       field.type === 'quantity' ?
                                          <InputFieldColumnQuantityType
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
                           items.length > 1 && item.removeIsAllowed &&
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
