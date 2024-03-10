export const InputFieldColumnTextType = ({settings, items, setItems, item, field}) => {

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

         <div>

            <input
               // ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
               style={{
                  width: '100%',
                  border: '1px solid ' + `${field.isEnabled ? settings.inputBorderColorEnabled : settings.inputBorderColorDisabled}`,
                  height: settings.inputHeight,
                  userSelect: `${field.isEnabled ? 'revert' : 'none'}`,
                  outline: `${field.isEnabled ? 'revert' : 'none'}`
               }}
               type="text"
               placeholder={field.placeholder}
               value={field.value}
               onChange={(event) => onChangeHandler(event, item._id, field._id)}
               //    onBlur={(event) => onBlurHandler(event, field._id)}
               autoComplete='off'
               readOnly={!field.isEnabled}
               maxLength={`${field.maxLength ? field.maxLength : 300}`}
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