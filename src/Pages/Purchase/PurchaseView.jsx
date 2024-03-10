import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from './usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { AmountField } from '../../Components/AmountField/AmountField';
import { BoxItem } from '../../Components/BoxItem/BoxItem';
import { ObjectViewer } from '../../Components/ObjectViewer/ObjectViewer';
import { Button } from 'react-bootstrap';
import { usePurchaseFormViewModel } from './FormHook/usePurchaseFormViewModel';
import { InputFieldColumn } from '../../Components/InputFieldColumn/InputFieldColumn'

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getPurchaseItems, purchaseItems } = usePurchaseViewModel()
   const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [items, setItems] = useState([]);
   const { createProductItem, createServiceItem } = usePurchaseFormViewModel({setItems})
      
   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      getPurchaseItems();
   }, []);

   // 2 - We programmatically select a default option, in this case, the first option. 
   useEffect(() => {
      if (!purchaseItems.isEmpty) {
         setSelectedPurchaseItem(purchaseItems[0]._id)
      }
   }, [purchaseItems])

   // 3A - When picking a selector element, we create a default blank item.
   useEffect(() => {
      setItems([])
      createNewItem()

   }, [selectedPurchaseItem])

   // 3B - Or we can create a defaul blank item, by clicking on the + button. 
   const onNewItemDidPressed = () => {
      createNewItem()
   }

   // 4 - Create a new blank item 
   const createNewItem = () => {
      const obj = purchaseItems.find(item => item._id === selectedPurchaseItem);
      if (!obj) { return }

      if (obj.itemType === 'BE_ITEMTYPE_PHSYSICAL') {
         createProductItem()
      } else if (obj.itemType === 'BE_ITEMTYPE_SERVICE') {
         createServiceItem()
      }
   }

   // 5 - When Purchase Selector Option changed, we start again creating a default item, deleteting all first.
   const handleChange = (event) => {
      const itemId = event.target.value;
      setSelectedPurchaseItem(itemId);
   };

   // 1 - This is when items change
   useEffect(() => {

   }, [items])

   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>

         <div>
            <h3 className='purchase_view__form-title'>Elije el artículo de compra.</h3>
            <select className="form-select" value={selectedPurchaseItem} onChange={handleChange}>

               {purchaseItems.map((item) => {
                  return (
                     <option key={item._id} value={item._id}>{item.title}, {item.description}.</option>
                  )
               }
               )}
            </select>
         </div>

         <Button size='sm' className='box_item__newButton' onClick={() => onNewItemDidPressed()}>+</Button>

         <InputFieldColumn
            items={items}
            setItems={setItems}
         />

      </div >
   )
}