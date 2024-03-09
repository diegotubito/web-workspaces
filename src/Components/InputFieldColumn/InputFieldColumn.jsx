import './InputFieldColumn.css';

export const InputFieldColumn = ({ items }) => {
   return (
      <div className='input_field_column__container'>
         {/* Title */}
         <h1>Input Field Column</h1>

         {/* Traversing Items */}
         {items.map((item) => {

            {/* Traversing Fields */ }

            return (
               <div key={item._id} >
                  
                  { item.title && <div>{item.title}</div>}

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
                              <div key={field._id} className='input'>
                                 {
                                    field.type === 'selector' ? 
                                       
                                       <select id="" style={{ width: '100%', boxSizing: 'border-box' }} className='input' onChange={console.log('changed')}>
                                          {field.selectorItems.map((selectorItem) => {
                                             return (
                                                <option key={selectorItem._id} value={selectorItem._id}>{selectorItem.title}.</option>
                                             )
                                          }
                                          )}
                                       </select>
                                     : null
                                 }

                                 {
                                    field.type === 'text' ? <div> tipo text </div> : null
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
