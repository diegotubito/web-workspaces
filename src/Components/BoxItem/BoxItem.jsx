import { Button } from 'react-bootstrap';
import './BoxItem.css'
import { useState } from 'react';
import { ReactComponent as TrashIcon } from '../../Resources/Images/delete_icon.svg';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

export const BoxItem = () => {
   const { t } = useTranslation()
   const inputRefs = useRef([]);
   const [items, setItems] = useState([
      {
         _id: Date.now().toString(), // Ensuring _id is a string
         description: '',
         quantity: 1,
         price: 0,
         subTotal: 0,
         descriptionErrorMessage: '',
         quantityErrorMessage: '',
         priceErrorMessage: '',
      }
   ])

   const addSecondaryItem = () => {
      let newItem = {
         _id: Date.now().toString(),
         description: '',
         quantity: 1,
         price: 0,
         subTotal: 0,
      };

      setItems(currentItems => [...currentItems, newItem]);
   };

   const onNewItem = () => {
      addSecondaryItem()
   }

   const focusOn = (index) => {
      inputRefs.current[0].focus()
   }

   const onRemoveButtonClicked = (_id) => {
      const index = items.findIndex((item) => { return item._id === _id })
      if (index !== -1) {
         const newItems = [...items];
         newItems.splice(index, 1);
         setItems(newItems);
      }
   }

   const validateDescription = (_id) => {
      const index = items.findIndex((item) => item._id === _id);

      let descriptionErrorMessage = '';
      if (items[index].description.trim() === '') {
         descriptionErrorMessage = 'Description is required';
      }

      const newItems = [...items]
      newItems[index] = { ...items[index], descriptionErrorMessage: descriptionErrorMessage }
      setItems(newItems)
   }

   const validateQuantity = (_id) => {
      const index = items.findIndex((item) => item._id === _id);

      let quantityErrorMessage = '';
      if (items[index].quantity < 1) {
         quantityErrorMessage = 'Quantity must be > 0';
      }

      const newItems = [...items]
      newItems[index] = { ...items[index], quantityErrorMessage: quantityErrorMessage }
      setItems(newItems)
   }

   const validatePrice = (_id) => {
      const index = items.findIndex((item) => item._id === _id);

      let priceErrorMessage = '';
      if (items[index].price < 1) {
         priceErrorMessage = 'Price must be > 0';
      }

      const newItems = [...items]
      newItems[index] = { ...items[index], priceErrorMessage: priceErrorMessage }
      setItems(newItems)
   }

   const onChangeHandler = (event, _id) => {
      const newValue = event.target.value;
      const name = event.target.name;

      const index = items.findIndex((item) => item._id === _id);

      if (index !== -1) {
         const newItems = [...items];

         newItems[index] = {
            ...newItems[index],
            description: name === 'description_input' ? newValue : items[index].description,
            quantity: name === 'quantity_input' ? newValue : items[index].quantity,
            price: name === 'price_input' ? newValue : items[index].price
         };

         setItems(newItems);
      }
   };

   const onBlurHandler = (event, _id) => {
      const name = event.target.name;
      switch (name) {
         case 'description_input':
            validateDescription(_id)
            break
         case 'quantity_input':
            validateQuantity(_id)
            break
         case 'price_input':
            validatePrice(_id)
            break
         default:
            break
      }

   }

   return (
      <div className='box_item__container'>

         <div className='box_item__container-list'>
            {items.map((item, index) => (
               <div className='whole-cell'>

                  <div key={item._id} className='box_item__container-list-cell'>
                     <div className='box_item__container-list-cell-input'>
                        <input
                           ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                           className="input"
                           type="text"
                           name='description_input'
                           placeholder='Description'
                           value={item.description}
                           onChange={(event) => onChangeHandler(event, item._id)}
                           onBlur={(event) => onBlurHandler(event, item._id)}
                        />
                        {item.descriptionErrorMessage && <div className="error-message">{item.descriptionErrorMessage}</div>}
                     </div>
                     <div className='box_item__container-list-cell-input'>
                        <input
                           ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                           className="input center"
                           type="number"
                           name='quantity_input'
                           placeholder='Quantity'
                           value={item.quantity}
                           onChange={(event) => onChangeHandler(event, item._id)}
                           onBlur={(event) => onBlurHandler(event, item._id)}
                        />
                        {item.quantityErrorMessage && <div className="error-message">{item.quantityErrorMessage}</div>}
                     </div>

                     <div className='box_item__container-list-cell-input'>
                        <input
                           ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                           className="input center"
                           type="number"
                           name='price_input'
                           placeholder='Price'
                           value={item.price}
                           onChange={(event) => onChangeHandler(event, item._id)}
                           onBlur={(event) => onBlurHandler(event, item._id)}
                        />
                        {item.priceErrorMessage && <div className="error-message">{item.priceErrorMessage}</div>}
                     </div>


                     <div className='box_item__container-list-cell-input'>
                        <input
                           ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                           className="input center non-electable"
                           type="number"
                           name='subTotal_input'
                           placeholder='Subtotal'
                           value={item.subTotal}
                           onChange={(event) => onChangeHandler(event, item._id)}
                           onBlur={(event) => onBlurHandler(event, item._id)}
                           readOnly={true}
                        />
                        {item.priceErrorMessage && <div className="error-message">{item.priceErrorMessage}</div>}
                     </div>






                  </div>
                  {
                     items.length > 1 &&
                     <div className="box_item__container-list-cell-buttons">
                        <TrashIcon className='redButton' onClick={() => onRemoveButtonClicked(item._id)} />
                     </div>
                  }
               </div>
            ))}
         </div>

         <Button className='box_item__newButton' onClick={() => onNewItem()}>+</Button>


      </div>
   )
}