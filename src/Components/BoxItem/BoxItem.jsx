import { Button } from 'react-bootstrap';
import './BoxItem.css'
import { useState } from 'react';
import { ReactComponent as TrashIcon } from '../../Resources/Images/delete_icon.svg';
import { ReactComponent as EditIcon } from '../../Resources/Images/edit_note.svg';
import { AmountField } from '../../Components/AmountField/AmountField';

export const BoxItem = () => {
   const [secondaryItems, setSecondaryItems] = useState([
      {
         _id: Date.now().toString(), // Ensuring _id is a string
         description: 'here comes the description',
         quantity: 1,
         price: 1500.55,
         subTotal: 1500.55,
      }
   ])

   const addSecondaryItem = () => {
      const newSecondaryItem = {
         _id: Date.now().toString(),
         description: 'New item description',
         quantity: 1,
         price: 100.00,
         subTotal: 100.00,
      };

      setSecondaryItems(currentItems => [...currentItems, newSecondaryItem]);
   };

   const onNewItem = () => {
      addSecondaryItem()
   }

   const onEditButtonClicked = () => {

   }

   const onRemoveButtonClicked = (event) => {
      console.log(event.target.value)
   }


   return (
      <div className='box_item__container'>
         <Button className='box_item__newButton' onClick={() => onNewItem()}>+</Button>

         <div className='box_item__container-list'>
            {secondaryItems.map((item) => (
               <div className='box_item__container-list-cell'>
                  <input type="text" className="input" placeholder='Description'/>
                  <input type="number" className="input center" placeholder='Quantity'/>
                  <input type="number" className="input center" placeholder='Price'/>
                  <input type="number" className="input center" placeholder='Total' />
                  <div className="box_item__container-list-cell-buttons">
                     <EditIcon className='blueButton' onClick={() => onEditButtonClicked(item._id)}/>
                     <TrashIcon className='redButton' onClick={() => onRemoveButtonClicked(item._id)} />
                  </div>

               </div>
            ))}
         </div>
      </div>

   )
}