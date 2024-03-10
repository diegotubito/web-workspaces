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
      <div className='input_field_column__input input_field_column__borderless'>
         <input
            // ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
            className='input_field_column__input '
            type="text"
            placeholder='Description'
            value={field.value}
            onChange={(event) => onChangeHandler(event, item._id, field._id)}
            //    onBlur={(event) => onBlurHandler(event, field._id)}
            autoComplete='off'
         />

      </div>
   )
}