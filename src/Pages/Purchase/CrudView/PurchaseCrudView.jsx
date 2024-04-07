import './PuchaseCrudView.css'
import { useEffect, useState } from 'react'
import { usePurchaseViewModel } from '../../../Hooks/PurchaseItem/usePurchaseViewModel'
import { useStakeholderViewModel } from '../../../Hooks/Stakeholder/useStakeholderViewModel';
import { useTranslation } from 'react-i18next';
import { usePurchaseFormViewModel } from '../FormHook/usePurchaseFormViewModel'
import { InputFieldColumn } from '../../../Components/InputFieldColumn/InputFieldColumn'
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { Spinner } from '../../../Components/Spinner/spinner'
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { usePaymentViewModel } from '../Pay/PaymentViewModel';
import { useCurrencyViewModel } from '../../../Hooks/Currency/useCurrencyViewModel';
import { QuantityTextField } from '../../../Components/TextField/QuantityTextField/QuantityTextField';
import { ErrorAlert } from '../../../Components/CustomAlert/ErrorAlert'

export const PurchaseCrudView = () => {
   const navigate = useNavigate()
   const { t } = useTranslation()
  
   const {
      createPurchaseOrder,
      purchaseItemIsLoading,
      onPurchaseFailed,
      onPurchaseSuccess,
   } = usePurchaseViewModel()

   const {
      stakeholders,
      stakeholderIsLoading,
      getStakeholdersByType,
      setOnStakeholderFailed
   } = useStakeholderViewModel()

   const [saleItems, setSaleItems] = useState([])
   const [availableSaleItems, setAvailableSaleItems] = useState([])

   // const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [selectedStakeholder, setSelectedStakeholder] = useState("")
   const [orderItems, setOrderItems] = useState([]);
   const { createProductItem } = usePurchaseFormViewModel({ orderItems, setOrderItems, saleItems })
   const [totalAmount, setTotalAmount] = useState(0)

   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");

   const { getCurrencies, currencies } = useCurrencyViewModel()
   const [selectedCurrency, setSelectedCurrency] = useState("")

   const [installmentNumber, setInstallmentNumber] = useState(1)

   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      setSelectedStakeholder('')
      getStakeholdersByType()
      
      fetchAllMethods()
      getCurrencies()
   }, [])

   useEffect(() => {
      if (onPurchaseSuccess) {
         navigate(-1)
      }
   }, [onPurchaseSuccess])

 

   // 2 - We programmatically select a default option, in this case, the first option. 
   useEffect(() => {
      if (stakeholders.length > 0) {
         setSelectedStakeholder(stakeholders[0]._id)
         
      }
   }, [stakeholders])

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
      if (selectedStakeholder) {
         setOrderItems([])
        
         const stakeholder = stakeholders.filter((s) => s._id === selectedStakeholder)
         if (stakeholder) {
            setSaleItems(stakeholder[0].items)
         }
      }
   }, [selectedStakeholder])

   useEffect(() => {
         
   }, [saleItems])

   // 3B - Or we can create a defaul blank item, by clicking on the + button. 
   const onNewItemDidPressed = () => {
      createNewItem()
   }

   // 4 - Create a new blank item 
   const createNewItem = () => {
      createProductItem()
   }

   // 5 - When Purchase Selector Option changed, we start again creating a default item, deleteting all first.
   const handleChange = (event) => {
      const itemId = event.target.value;
      setSelectedStakeholder(itemId);
   };

   useEffect(() => {
      updateTotalAmount()
   }, [orderItems, setOrderItems])

   const updateTotalAmount = () => {
      let total = 0
      let shouldUpdate = false
      orderItems.forEach((orderItem) => {
         orderItem.fields.forEach((field) => {
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
      createPurchaseOrder(orderItems, convertCurrencyStringToNumber(totalAmount), selectedStakeholder, selectedPaymentItem, selectedCurrency, installmentNumber)
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

   const onInstallmentNumberChangeHandler = (value) => {
      setInstallmentNumber(value)
   }

   {
      return (
         <div className='purchase_crud_view__main'>
            <div className='purchase_crud_view__container'>

               {purchaseItemIsLoading && <Spinner />}

               {onPurchaseFailed && (
                  <ErrorAlert
                     errorDetails={onPurchaseFailed}
                     navigate={navigate}
                  />
               )}
             
               <div className='purchase_view__gap'>

                  <div className='purchase_crud_view__container-scroll'>
                     <h1 className='purchase_crud_view__title'>{t('PURCHASE_ORDER_CRUD_VIEW_TITLE')}</h1>

                     <div className='purchase_view__gap'>

                        <div>
                           <h3 className='purchase_view__form-title'>{t('PURCHASE_ORDER_CRUD_VIEW_SELECT_ARTICLE_TITLE')}</h3>
                           <select className="form-select" value={selectedStakeholder} onChange={handleChange}>
                              {stakeholders.map((stakeholder) => {
                                 return (
                                    <option key={stakeholder._id} value={stakeholder._id}>{stakeholder.title} {stakeholder.subTitle}</option>
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
                           <h3 className='purchase_view__form-title'>{t('Installments')}</h3>
                           <QuantityTextField
                              value={installmentNumber}
                              onChangeValue={onInstallmentNumberChangeHandler}
                              minValue={0}
                              maxValue={18}
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
                           items={orderItems}
                           setItems={setOrderItems}
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