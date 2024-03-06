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


         <BoxItem/>



      </div >
   )
}