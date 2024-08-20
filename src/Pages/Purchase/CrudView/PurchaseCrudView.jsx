import './PuchaseCrudView.css'
import { useEffect, useState } from 'react'
import { useOrderViewModel } from '../../../Hooks/Order/useOrderViewModel';
import { useTranslation } from 'react-i18next';
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
import { useItemViewModel } from '../../../Hooks/Item/useItemViewModel';
import { AddSaleItem } from '../../../Components/AddSaleItemComponent/AddSaleItem';

export const PurchaseCrudView = () => {
   const navigate = useNavigate()
   const { t } = useTranslation()

   const {
      createOrder,
      itemIsLoading,
      onOrderFailed,
      onOrderSuccess,
   } = useOrderViewModel()

   const {
      fetchItemsByWorkspaceAndStakeholder,
      fetchSaleItemsByWorkspace,
      items,
      setItems,
      saleItemsIsLoading,
      onGetSaleFailed,
      setOnGetSaleFailed
   } = useItemViewModel()

   const [selectedStakeholderType, setSelectedStakeholderType] = useState()
   const [selectedOrderType, setSelectedOrderType] = useState()
   const [selectedSalePriceList, setSelectedSalePriceList] = useState()

   const [selectedStakeholder, setSelectedStakeholder] = useState("")
   const [orderItems, setOrderItems] = useState([]);

   const [itemTotal, setItemTotal] = useState(0)
   const [termAmount, setTermAmount] = useState(0)
   const [totalDiscount, setTotalDiscount] = useState(0)
   const [totalAmount, setTotalAmount] = useState(0)

   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
   const [selectedCurrency, setSelectedCurrency] = useState()
   const [installmentNumber, setInstallmentNumber] = useState(1)

   const [isFinanced, setIsFinanced] = useState(false)

   useEffect(() => {
      if (selectedStakeholder) {
         switch (selectedOrderType) {
            case OrderType.PURCHASE:
               fetchItemsByWorkspaceAndStakeholder(selectedStakeholder)
               break
            case OrderType.SALE:
            case OrderType.CREDIT_NOTE:
               fetchSaleItemsByWorkspace(true)
               break
            case OrderType.ADJUSTMENT_SHORTAGE:
            case OrderType.ADJUSTMENT_SURPLUS:
               fetchSaleItemsByWorkspace(true, selectedStakeholder)
               break

         }
      }
   }, [selectedStakeholder, setSelectedStakeholder])

   const resetAllValues = () => {
      setOrderItems([])
      setItems([])
      setTotalAmount(0)
      setTermAmount(0)
      setTotalDiscount(0)
      setItemTotal(0)
      setInstallmentNumber(1)
   }

   useEffect(() => {
      if (selectedOrderType) {

         resetAllValues()

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

   useEffect(() => {
      setTermAmount(totalAmount / installmentNumber)
   }, [setInstallmentNumber, installmentNumber, totalAmount])

   useEffect(() => {
      setSelectedStakeholder(null)
   }, [selectedStakeholderType])

   useEffect(() => {
      if (onOrderSuccess) {
         navigate(-1)
      }
   }, [onOrderSuccess])

   useEffect(() => {
      updateTotalAmount()
   }, [orderItems, setOrderItems, setItemTotal, itemTotal])

   const updateTotalAmount = () => {
      let total = 0

      total = itemTotal
      
      setTotalAmount(total)
   }

   const onCreateOrderDidPressed = () => {
      createOrder(selectedOrderType, orderItems, convertCurrencyStringToNumber(totalAmount), selectedStakeholder, selectedPaymentMethod, selectedCurrency, installmentNumber, selectedSalePriceList)
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
            {itemIsLoading && <Spinner />}

            {onOrderFailed && (
               <ErrorAlert
                  errorDetails={onOrderFailed}
                  navigate={navigate}
               />
            )}


            <div className='purchase_crud_view__header'>

               <h1 className='purchase_crud_view__title'>{t('PURCHASE_ORDER_CRUD_VIEW_TITLE')}</h1>

            </div>

            <div className='purchase_crud_view__body'>

               {itemIsLoading && <Spinner />}

               {onOrderFailed && (
                  <ErrorAlert
                     errorDetails={onOrderFailed}
                     navigate={navigate}
                  />
               )}

               <div className='purchase_view__gap'>

                  <OrderTypeSelector
                     title={'Order Type'}
                     selectedOrderType={selectedOrderType}
                     setSelectedOrderType={setSelectedOrderType}
                  />

                  <CustomerSelector
                     selectedCustomer={selectedStakeholder}
                     setSelectedCustomer={setSelectedStakeholder}
                     stakeholderType={selectedStakeholderType}
                     orderType={selectedOrderType}
                  />

                  <AddSaleItem
                     orderItems={orderItems}
                     setOrderItems={setOrderItems}
                     title={'Add New Items'}
                     selectedOrderType={selectedOrderType}
                     selectedStakeholder={selectedStakeholder}
                     itemTotal={itemTotal}
                     setItemTotal={setItemTotal}
                     selectedSalePriceList={selectedSalePriceList}
                     setSelectedSalePriceList={setSelectedSalePriceList}
                  />

                  <div className='puchase_view__payment_and_currency'>
                     <PaymentMethodSelector
                        title={t('PAYMENT_VIEW_PAYMENT_METHOD_TITLE')}
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                        setIsFinanced={setIsFinanced}
                     />

                     <CurrencySelector
                        title={t('PAYMENT_VIEW_CURRENCY_TITLE')}
                        selectedCurrency={selectedCurrency}
                        setSelectedCurrency={setSelectedCurrency}
                     />
                   

                     { (isFinanced === true) && <QuantityTextField
                        title="Term"
                        value={installmentNumber}
                        onChangeValue={onInstallmentNumberChangeHandler}
                        maxValue={18}
                        minValue={0}
                        placeholder="Enter quantity"
                     /> }

                     {(isFinanced === true) && <TotalAmount
                        title={t('Term Amount')}
                        total={termAmount}
                     />}

                  </div>

                  <div className='puchase_view__discount_and_total'>
                    

                     <TotalAmount
                        title={t('PURCHASE_ORDER_CRUD_VIEW_TOTAL_TO_PAY_TITLE')}
                        total={totalAmount}
                     />
                  </div>




               </div>



            </div>

            <div className='purchase_crud_view__footer'>

               <div className='purchase_crud_view__footer-buttons'>

                  <SimpleButton
                     title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                     style='cancel'
                     onClick={() => onCancelDidPressed()}
                  />

                  <SimpleButton
                     title={t('Create Sale')}
                     style='secondary'
                     onClick={() => onCreateOrderDidPressed()}
                  />

               </div>
            </div>
         </div>



      )
   }
}