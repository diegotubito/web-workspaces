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
                              <div key={field._id} className='input'
                                
                              
                              >
                                 <div>{field.type}</div>
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
