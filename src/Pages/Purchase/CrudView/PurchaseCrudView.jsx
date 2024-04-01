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
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { usePaymentViewModel } from '../Pay/PaymentViewModel';
import { useCurrencyViewModel } from '../../../Hooks/Currency/useCurrencyViewModel';

export const PurchaseCrudView = () => {
   const navigate = useNavigate()
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

   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");

   const { getCurrencies, currencies} = useCurrencyViewModel()
   const [selectedCurrency, setSelectedCurrency] = useState("")

   const [installmentNumber, setInstallmentNumber] = useState(1)

   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      setSelectedPurchaseItem('')
      getPurchaseItems();
      getSaleItems();
      fetchAllMethods()
      getCurrencies()
   }, [])

   useEffect(() => {
      if (onPurchaseSuccess) {
         navigate(-1)
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

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentItem(paymentMethods[0]._id)
      }
   }, [paymentMethods])

   useEffect(() => {
      // default payment method
      if (currencies.length > 0) {
         setSelectedCurrency(currencies[0]._id)
      }
   }, [currencies])

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
      createPurchaseOrder(items, convertCurrencyStringToNumber(totalAmount), selectedPurchaseItem, selectedPaymentItem, selectedCurrency, installmentNumber)
   }

   const onCancelDidPressed = () => {
      navigate(-1)
   }

   const handleOnPaymentMethodChange = (event) => {
      const itemId = event.target.value;
      setSelectedPaymentItem(itemId);
   };

   const handleOnCurrencyChange = (event) => {
      const itemId = event.target.value;
      setSelectedCurrency(itemId);
   };

   const onInstallmentNumberChangeHandler = (event) => {
      const value = event.target.value
      setInstallmentNumber(value)
   }


   {
      return(
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
                     <h1 className='purchase_crud_view__title'>{t('PURCHASE_ORDER_CRUD_VIEW_TITLE')}</h1>
                 
                     <div className='purchase_view__gap'>

                        <div>
                           <h3 className='purchase_view__form-title'>{t('PURCHASE_ORDER_CRUD_VIEW_SELECT_ARTICLE_TITLE')}</h3>
                           <select className="form-select" value={selectedPurchaseItem} onChange={handleChange}>
                              {purchaseItems.map((item) => {
                                 return (
                                    <option key={item._id} value={item._id}>{item.title}, {item.description}.</option>
                                 )
                              }
                              )}
                           </select>
                        </div>

                        <div>
                           <h3 className='purchase_view__form-title'>{t('PAYMENT_VIEW_PAYMENT_METHOD_TITLE')}</h3>
                           <select className="form-select" value={selectedPaymentItem} onChange={handleOnPaymentMethodChange}>
                              {paymentMethods.map((item) => {
                                 return (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                 )
                              }
                              )}
                           </select>
                        </div>
 
                        <div>
                           <h3 className='purchase_view__form-title'>{t('PAYMENT_VIEW_CURRENCY_TITLE')}</h3>
                           <select className="form-select" value={selectedCurrency} onChange={handleOnCurrencyChange}>
                              <option value="" disabled>{t('PAYMENT_VIEW_CURRENCY_TITLE')}</option>
                              {currencies.map((item) => (
                                 <option key={item._id} value={item._id}>{item.name}</option>
                              ))}
                           </select>
                        </div>

                        <div>

                           <input
                              // ref={el => inputRefs.current[index] = el} // Agrega la referencia aquí
                              style={{
                                 width: '5rem',
                                 border: '1px solid ' + `${'gray'}`,
                                 height: '3rem',
                                 padding: '0rem 0.5rem',
                              }}
                              type="number"
                              placeholder={'Installments'}
                              value={installmentNumber}
                              onChange={(event) => onInstallmentNumberChangeHandler(event)}
                              //    onBlur={(event) => onBlurHandler(event, field._id)}
                              autoComplete='off'

                              maxLength={`${300}`}
                           />

                        </div>



                        <div className='purchase_view__buttons'>
                           <SimpleButton
                              title={t('PURCHASE_ORDER_CRUD_VIEW_ADD_NEW_ITEM_TITLE')}
                              style='primary'
                              onClick={() => onNewItemDidPressed()}
                           />
                        </div>

                        <InputFieldColumn
                           title={t('PURCHASE_ORDER_CRUD_VIEW_ITEMS_TITLE')}
                           items={items}
                           setItems={setItems}
                        />


                        <div className='purchase_view__total-amount-main'>
                           <h3>{t('PURCHASE_ORDER_CRUD_VIEW_TOTAL_TO_PAY_TITLE')}</h3>
                           <h3 className='purchase_view__total-amount'>{formatCurrency(totalAmount.toFixed(2).toString())}</h3>
                        </div>

                        <div className='purchase_view__buttons'>
                           <SimpleButton
                              title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                              style='cancel'
                              onClick={() => onCancelDidPressed()}
                           />

                           <SimpleButton
                              title={t('PURCHASE_ORDER_CRUD_VIEW_CREATE_ORDER_BUTTON_TITLE')}
                              style='secondary'
                              onClick={() => onCreateOrderDidPressed()}
                           />

                        </div>

                        
                     </div>
                  </div >
               </div>
            </div>
         </div>
      )
   }
}