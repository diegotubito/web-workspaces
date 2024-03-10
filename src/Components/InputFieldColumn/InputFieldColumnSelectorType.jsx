export const InputFieldColumnSelectorType = ({ settings, items, setItems, item: receivedItem, field: receivedField }) => {
   const handleSelectorChange = (event) => {
      const selectedOptionId = event.target.value
      const updatedItem = updateItemField(selectedOptionId)
      setItems(updatedItem)
   }

   const updateItemField = (selectedOptionId) => {
      const updatedItem = items.map((item) => {
         if (item._id === receivedItem._id) {
            return {
               ...item, fields: item.fields.map((field) => {
                  if (field._id === receivedField._id) {
                     return { ...field, value: selectedOptionId }
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