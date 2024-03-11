import { convertCurrencyStringToNumber, formatCurrency } from "../../Utils/Common/formatCurrency";

export const InputFieldColumnQuantityType = ({ settings, items, setItems, item, field, setTotal }) => {

   const onChangeHandler = (event, itemId, fieldId) => {
      const newValue = event.target.value;
      const updatedItems = updateItemField(itemId, fieldId, newValue);
      setItems(updatedItems);
   };

   const updateItemField = (itemId, fieldId, newValue) => {
      return items.map(item => {
         if (item._id === itemId) {
            let updatedFields = item.fields.map(field => {
               if (field._id === fieldId) {
                  // Allow empty string, a single '-', or a valid number
                  const isValidNumber = newValue === "" || /^-?\d+(\.\d+)?$/.test(newValue);
                  const valueToUpdate = isValidNumber ? newValue : field.value;

                  return { ...field, value: valueToUpdate };
               }
               return field;
            });

            // Verifica si hay que actualizar el total
            const quantityField = updatedFields.find(field => field.name === 'quantity');
            const subTotalField = updatedFields.find(field => field.name === 'sub_total');
            const totalFieldIndex = updatedFields.findIndex(field => field.name === 'total');

            if (quantityField && subTotalField && totalFieldIndex !== -1) {
               const quantity = convertCurrencyStringToNumber(quantityField.value);
               const subTotal = convertCurrencyStringToNumber(subTotalField.value);
               const total = parseFloat(subTotal * quantity).toFixed(2);

               updatedFields[totalFieldIndex].value = formatCurrency(total.toString());
            }

            return { ...item, fields: updatedFields };
         }
         return item;
      });
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
                  textAlign: 'center',
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
               maxLength={`${ field.maxLength ? field.maxLength : 5}`}
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