import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { usePurchaseFormViewModel } from './FormHook/usePurchaseFormViewModel';
import { InputFieldColumn } from '../../Components/InputFieldColumn/InputFieldColumn'
import { useSaleItemViewModel } from '../../Hooks/SaleItem/useSaleItemViewModel';
import { AmountField } from '../../Components/AmountField/AmountField'
import { convertCurrencyStringToNumber, formatCurrency } from '../../Utils/Common/formatCurrency';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getSaleItems, saleItems, saleItemsIsLoading, error } = useSaleItemViewModel()
   const { getPurchaseItems, purchaseItems } = usePurchaseViewModel()
   const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [items, setItems] = useState([]);
   const { createProductItem, createServiceItem, updateTotal } = usePurchaseFormViewModel({ items, setItems, saleItems })
   const [totalAmount, setTotalAmount] = useState(0)

   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      getPurchaseItems();
      getSaleItems();
   }, []);

   useEffect(() => {

   }, [saleItems])

   // 2 - We programmatically select a default option, in this case, the first option. 
   useEffect(() => {
      if (purchaseItems.length > 0) {
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

      if (obj.itemType === 'BE_ITEMTYPE_PHYSICAL') {
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
      // here I can't modify items, endless loop.
      updateTotalAmount()

   }, [items])

   const updateTotalAmount = () => {
      let total = 0
      let shouldUpdate = false
      items.forEach((item) => {
         item.fields.forEach((field) => {
            if (field.name === 'total') {
               const value = convertCurrencyStringToNumber(field.value).toFixed(2)
               const parsedValue = parseFloat(value) || 0
               total += parsedValue
               shouldUpdate = true
            }
         })
      })

      if (shouldUpdate) {
         setTotalAmount(total)
      }
   }

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <h1>Purchase View</h1>
         {error && <div className="alert alert-danger" role="alert">{error.message}</div>}
         {!error &&
            <div className='purchase_view__gap'>
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

               <Button className='purchase_view__add-button' size='lr' onClick={() => onNewItemDidPressed()}>Add New</Button>

               <InputFieldColumn
                  title="Your items"
                  items={items}
                  setItems={setItems}
               />


               <div className='purchase_view__total-amount-main'>
                  <h3>Total</h3>
                  <h3 className='purchase_view__total-amount'>{formatCurrency(totalAmount.toFixed(2).toString())}</h3>
               </div>

               <Button className='purchase_view__create-button' size='lr' onClick={() => onNewItemDidPressed()}>Create New Purchase Order</Button>
            </div>
         }
      </div >
   )
}