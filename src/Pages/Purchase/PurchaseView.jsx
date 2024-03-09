import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from './usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { AmountField } from '../../Components/AmountField/AmountField';
import { BoxItem } from '../../Components/BoxItem/BoxItem';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getItems, items } = usePurchaseViewModel()
   const [selectedItem, setSelectedItem] = useState("");
   const [amount, setAmount] = useState(0)
  
   const handleChange = (event) => {
      const itemId = event.target.value;
      const obj = items.find(item => item._id === itemId);
      console.log(obj.title)
      setSelectedItem(itemId);
   };

   useEffect(() => {
      console.log("Getting items and creating default secondary item");
      getItems();
      setAmount(15)
   }, []);

   const onAmountDidChanged = (value) => {
     
   }

   const onBoxItemDidChanged = (items) => {
      let total = 0
      items.map((item) => {
         total += item.subTotal
      })
      setAmount(total)
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

         <BoxItem
            initValues={[
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
            ]}
            onBoxItemDidChanged={onBoxItemDidChanged}
         />

         <AmountField amount={amount} onAmountDidChanged={onAmountDidChanged} />

      </div >
   )
}