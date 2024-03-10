export const InputFieldColumnTextType = ({items, setItems, item, field}) => {

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
      <div>

         <div className='input_field_column__cell-height'>

            <input
               // ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
               style={{
                  width: '100%',
                  border: '1px solid rgb(180, 180, 180)',
                  height: '3rem'
               }}
               type="text"
               placeholder='Description'
               value={field.value}
               onChange={(event) => onChangeHandler(event, item._id, field._id)}
               //    onBlur={(event) => onBlurHandler(event, field._id)}
               autoComplete='off'
            />

            {field.errorMessage && <div 
            style={{
               color: 'red',
            }}
            >{field.errorMessage}</div>}

         </div>


      </div>
   )
}