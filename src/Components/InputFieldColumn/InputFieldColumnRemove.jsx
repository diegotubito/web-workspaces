import { ReactComponent as TrashIcon } from '../../Resources/Images/delete_icon.svg';

export const InputFieldColumnRemove = ({ settings, items, setItems, item }) => {

   const onRemoveButtonClicked = (_id) => {
      const index = items.findIndex((item) => { return item._id === _id })
      if (index !== -1) {
         const newItems = [...items];
         newItems.splice(index, 1);
         setItems(newItems);
      }
   }

   return (
      <TrashIcon
         style={{
            height: settings.inputHeight
         }}
         className='input_field_column__trash-button'
         onClick={() => onRemoveButtonClicked(item._id)} 
         />
   )
}