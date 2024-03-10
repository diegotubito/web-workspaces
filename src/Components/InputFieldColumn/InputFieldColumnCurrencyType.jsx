import { convertCurrencyStringToNumber, formatCurrency } from "../../Utils/Common/formatCurrency";

export const InputFieldColumnCurrencyType = ({ settings, items, setItems, item, field }) => {

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

                     newValue = formatCurrency(newValue)

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
                  border: '1px solid rgb(180, 180, 180)',
                  height: settings.inputHeight,
                  textAlign: 'center',
               }}
               type="text"
               placeholder='$ 0.00'
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