export const InputFieldColumnSelectorType = ({items, setItems, item:receivedItem, field: receivedField}) => {
   const handleSelectorChange = (event) => {
      const selectedOptionId = event.target.value
      const updatedItem = updateItemField(selectedOptionId)
      setItems(updatedItem)
   }

   const updateItemField = (selectedOptionId) => {
      const updatedItem = items.map((item) => {
         if (item._id === receivedItem._id) {
            return { ...item, fields: item.fields.map((field) => {
               if (field._id === receivedField._id) {
                  return { ...field, value: selectedOptionId }
               }
               return field

            })}
         } 
         return item
      })

      return updatedItem
   }

   return (
      <select id="" className='input_field_column__input' onChange={(event)=>handleSelectorChange(event)}>
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
   )
}