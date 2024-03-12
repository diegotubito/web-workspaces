import './PuchaseCrudView.css'
import { useEffect, useState } from 'react'
import { usePurchaseViewModel } from '../../../Hooks/PurchaseItem/usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { Button, Alert } from 'react-bootstrap';
import { usePurchaseFormViewModel } from '../FormHook/usePurchaseFormViewModel'
import { InputFieldColumn } from '../../../Components/InputFieldColumn/InputFieldColumn'
import { useSaleItemViewModel } from '../../../Hooks/SaleItem/useSaleItemViewModel';
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { Spinner } from '../../../Components/Spinner/spinner'

export const PurchaseCrudView = ({ isOpen, setIsOpen }) => {

   const { t } = useTranslation()
   const {
      getSaleItems,
      saleItems,
      saleItemsIsLoading,
      onGetSaleFailed,
      setOnGetSaleFailed
   } = useSaleItemViewModel()

   const {
      getPurchaseItems,
      purchaseItems,
      createPurchaseOrder,
      purchaseItemIsLoading,
      onPurchaseFailed,
      setOnPurchaseFailed,
      onPurchaseSuccess,
      setOnPurchaseSuccess
   } = usePurchaseViewModel()

   const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [items, setItems] = useState([]);
   const { createProductItem, createServiceItem } = usePurchaseFormViewModel({ items, setItems, saleItems })
   const [totalAmount, setTotalAmount] = useState(0)

   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      setSelectedPurchaseItem('')
      getPurchaseItems();
      getSaleItems();

   }, [isOpen])

   useEffect(() => {
      if (onPurchaseSuccess) {
         setIsOpen(false)
         setOnPurchaseSuccess(null)
      }
   }, [onPurchaseSuccess])

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

   const onCreateOrderDidPressed = () => {
      createPurchaseOrder(items, convertCurrencyStringToNumber(totalAmount))
   }

   const onCancelDidPressed = () => {
      setIsOpen(false)
   }

   

   {
      return (!isOpen) ? null : (
         <div className='purchase_crud_view__main'>
            <div className='purchase_crud_view__container'>


               {saleItemsIsLoading || purchaseItemIsLoading && <Spinner />}


               {onPurchaseFailed && (
                  <div className="alert-container">
                     <Alert variant="warning">
                        <Alert.Heading>{onPurchaseFailed.title}</Alert.Heading>
                        <h3>
                           {onPurchaseFailed.message}
                        </h3>
                        <hr />
                        <div className="d-flex justify-content-end">
                           <Button onClick={() => setOnPurchaseFailed(null)} variant="outline-success">
                              Close me
                           </Button>
                        </div>
                     </Alert>
                  </div>
               )}
               {onGetSaleFailed && (
                  <div className="alert-container">
                     <Alert variant="warning">
                        <Alert.Heading>{onPurchaseFailed.title}</Alert.Heading>
                        <h3>
                           {onPurchaseFailed.message}
                        </h3>
                        <hr />
                        <div className="d-flex justify-content-end">
                           <Button onClick={() => setOnGetSaleFailed(null)} variant="outline-success">
                              Close me
                           </Button>
                        </div>
                     </Alert>
                  </div>
               )}

               <div className='purchase_view__gap'>

                  <div className='purchase_crud_view__container-scroll'>
                     <h1>Purchase View</h1>

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

                        <Button className='purchase_view__create-button' size='lr' onClick={() => onCreateOrderDidPressed()}>CREATE ORDER</Button>


                        <Button className='purchase_view__cancel-button' size='lr' onClick={() => onCancelDidPressed()}>CANCEL</Button>


                     </div>


                  </div >


               </div>
            </div>
         </div>
      )
   }
}