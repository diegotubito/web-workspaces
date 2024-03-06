import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from './usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { AmountField } from '../../Components/AmountField/AmountField';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getItems, items } = usePurchaseViewModel()
   const [selectedItem, setSelectedItem] = useState("");
   const [amount, setAmount] = useState(0)
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

   const handleChange = (event) => {
      const itemId = event.target.value;
      const obj = items.find(item => item._id === itemId);
      console.log(obj.title)
      setSelectedItem(itemId);
   };

   useEffect(() => {
      console.log("Getting items and creating default secondary item");
      getItems();
   }, []);

   const onAmountDidChanged = (value) => {
      setAmount(value)
      console.log(value)
   }

   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>

         <div>
            <h3 className='purchase_view__form-title'>Elije el artículo de compra.</h3>
            <select className="form-select" value={selectedItem} onChange={handleChange}>

               {items.map((item) => {
                  return (
                     <option key={item._id} value={item._id}>{item.title}, {item.description}.</option>
                  )
               }
               )}
            </select>
         </div>

         <AmountField amount={amount} onAmountDidChanged={onAmountDidChanged} />


         <div className='purchase_view__secondary-items'>
            {secondaryItems.map((item) => (
               <div key={item._id}>
                  Description: {item.description}, Quantity: {item.quantity}, Price: {item.price}, Subtotal: {item.subTotal}
               </div>
            ))}
         </div>



      </div >
   )
}