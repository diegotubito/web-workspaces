import { formatCurrency } from "../../Utils/Common/formatCurrency"

export const InputFieldColumnSelectorType = ({ settings, items, setItems, item: receivedItem, field: receivedField, setSelectedOptionId }) => {
   const handleSelectorChange = (event) => {
      const selectedOptionId = event.target.value
      const updatedItem = updateItemField(selectedOptionId)
      setItems(updatedItem)
      setSelectedOptionId(selectedOptionId)
   }

   const updateItemField = (selectedOptionId) => {
      const updatedItem = items.map((item) => {
         if (item._id === receivedItem._id) {
            return {
               ...item, fields: item.fields.map((field) => {
                  if (field._id === receivedField._id) {
                     return { ...field, value: selectedOptionId }
                  }

                  // setting default values for sub_total when selecting a new option
                  if (field.name === "sub_total") {
                     const option = receivedField.selectorItems.filter((option) => option._id === selectedOptionId)[0]
                     return { ...field, value: formatCurrency(String(option.price*100)) }
                  }

                  //setting default value for total  when selecting a new option
                  if (field.name === "total") {
                     const option = receivedField.selectorItems.filter((option) => option._id === selectedOptionId)[0]
                     return { ...field, value: formatCurrency(String(option.price * 100)) }
                  }

                  // setting default values for sub_total  when selecting a new option
                  if (field.name === "quantity") {
                     return { ...field, value: 1 }
                  }

                  return field

               })
            }
         }
         return item
      })

      return updatedItem
   }

   return (
      <div className='input_field_column__cell-height'>

         <select
            style={{
               width: '100%',
               border: '1px solid rgb(180, 180, 180)',
               height: settings.inputHeight
            }}
            id=""
            onChange={(event) => handleSelectorChange(event)}
            disabled={!receivedField.isEnabled}
            >
            {receivedField.selectorItems.map((selectorItem) => {
               return (
                  <option
                     key={selectorItem._id}
                     value={selectorItem._id}
                  >{selectorItem.title}</option>
               )
            }
            )}
         </select>

         {receivedField.errorMessage && <div
            style={{
               color: 'red',
            }}
         >{receivedField.errorMessage}</div>}

      </div>
   )
}