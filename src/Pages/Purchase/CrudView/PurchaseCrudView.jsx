import './PuchaseCrudView.css'
import { useEffect, useState } from 'react'
import { useOrderViewModel } from '../../../Hooks/Order/useOrderViewModel';
import { useTranslation } from 'react-i18next';
import { usePurchaseFormViewModel } from '../FormHook/usePurchaseFormViewModel'
import { InputFieldColumn } from '../../../Components/InputFieldColumn/InputFieldColumn'
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { Spinner } from '../../../Components/Spinner/spinner'
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton';
import { useNavigate } from 'react-router-dom';
import { QuantityTextField } from '../../../Components/TextField/QuantityTextField/QuantityTextField';
import { ErrorAlert } from '../../../Components/CustomAlert/ErrorAlert'
import { TotalAmount } from '../../../Components/TotalAmount/TotalAmount';
import { CurrencySelector } from '../../../Components/Selectors/CurrencySelector/CurrencySelector';
import { CustomerSelector } from '../../../Components/Selectors/CustomerSelector/CustomerSelector';
import { StakeholderTypeSelector } from '../../../Components/Selectors/StakeholderTypeSelector/StakeholderTypeSelector';
import { PaymentMethodSelector } from '../../../Components/Selectors/PaymentMethodSelector/PaymentMehtodSelector';
import { OrderTypeSelector } from '../../../Components/Selectors/OrderTypeSelector/OrderTypeSelector';
import { StakeholderType } from '../../../Hooks/Stakeholder/stakeholderType';
import { OrderType } from '../../../Hooks/Order/orderType';

export const PurchaseCrudView = () => {
   const navigate = useNavigate()
   const { t } = useTranslation()
  
   const {
      createOrder,
      itemIsLoading,
      onOrderFailed,
      onOrderSuccess,
   } = useOrderViewModel()

   const [saleItems, setSaleItems] = useState([])
   const [availableSaleItems, setAvailableSaleItems] = useState([])
   const [selectedStakeholderType, setSelectedStakeholderType] = useState()
   const [selectedOrderType, setSelectedOrderType] = useState()

   // const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [selectedStakeholder, setSelectedStakeholder] = useState("")
   const [orderItems, setOrderItems] = useState([]);
   const { createProductItem } = usePurchaseFormViewModel({ orderItems, setOrderItems, saleItems })
   const [totalAmount, setTotalAmount] = useState(0)

   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");

   const [selectedCurrency, setSelectedCurrency] = useState("")

   const [installmentNumber, setInstallmentNumber] = useState(1)

   useEffect(() => {
      if (selectedOrderType) {
         switch (selectedOrderType) {
            case OrderType.PURCHASE:
               setSelectedStakeholderType(StakeholderType.SUPPLIER)
               break
            case OrderType.SALE:
               setSelectedStakeholderType(StakeholderType.CUSTOMER)
               break
            case OrderType.ADJUSTMENT_SHORTAGE:
            case OrderType.ADJUSTMENT_SURPLUS:
               setSelectedStakeholderType(StakeholderType.EMPLOYEE)
               break

         }
      }
   }, [selectedOrderType, setSelectedOrderType])

   // 1 - Fetch All Purchase Items From API 
   useEffect(() => {
      setSelectedStakeholder(null)
   }, [selectedStakeholderType])

   useEffect(() => {
      if (onOrderSuccess) {
         navigate(-1)
      }
   }, [onOrderSuccess])

   // 2 - We programmatically select a default option, in this case, the first option. 
   
   // 3A - When picking a selector element, we create a default blank item.
   useEffect(() => {
      if (selectedStakeholder) {
         setOrderItems([])
        
         //const stakeholder = stakeholders.filter((s) => s._id === selectedStakeholder)
        // if (stakeholder) {
            //setSaleItems(stakeholder[0].items)
        // }
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
      createOrder('purchase', orderItems, convertCurrencyStringToNumber(totalAmount), selectedStakeholder, selectedPaymentItem, selectedCurrency, installmentNumber)
   }

   const onCancelDidPressed = () => {
      navigate(-1)
   }

   const onInstallmentNumberChangeHandler = (value) => {
      setInstallmentNumber(value)
   }

   {
      return (
         <div className='purchase_crud_view__main'>
            <div className='purchase_crud_view__container'>

               {itemIsLoading && <Spinner />}

               {onOrderFailed && (
                  <ErrorAlert
                     errorDetails={onOrderFailed}
                     navigate={navigate}
                  />
               )}
             
               <div className='purchase_view__gap'>

                  <div>
                     <h1 className='purchase_crud_view__title'>{t('PURCHASE_ORDER_CRUD_VIEW_TITLE')}</h1>

                     <div className='purchase_view__gap'>

                        <OrderTypeSelector
                           tite={'Order Type'}
                           selectedOrderType={selectedOrderType}
                           setSelectedOrderType={setSelectedOrderType}
                        />

                        <CustomerSelector
                           selectedCustomer={selectedStakeholder}
                           setSelectedCustomer={setSelectedStakeholder}
                           stakeholderType={selectedStakeholderType}
                        />

                        <div className='purchase_view__add-item-button'>
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

                        <PaymentMethodSelector
                           title={t('PAYMENT_VIEW_PAYMENT_METHOD_TITLE')}
                           selectedPaymentItem={selectedPaymentItem}
                           setSelectedPaymentItem={setSelectedPaymentItem}
                        />

                        <QuantityTextField
                           title="Installments"
                           value={installmentNumber}
                           onChangeValue={onInstallmentNumberChangeHandler}
                           maxValue={18}
                           minValue={1}
                           placeholder="Enter quantity"
                        />

                        <TotalAmount
                           title={t('PURCHASE_ORDER_CRUD_VIEW_TOTAL_TO_PAY_TITLE')}
                           items={orderItems}
                           total={totalAmount}
                           setTotal={setTotalAmount}
                        />

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