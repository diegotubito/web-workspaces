import { useEffect, useState } from 'react';
import './PaymentView.css'
import { usePaymentViewModel } from './PaymentViewModel';
import { usePhysicalAccountViewModel } from '../../../Hooks/PhysicalAccount/usePhysicalAccountViewModel';
import { useTransactionViewModel } from '../../../Hooks/Transaction/useTransactionViewModel';
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { AmountField } from '../../../Components/AmountField/AmountField';
import { useTranslation } from 'react-i18next';
import { dateAndTimeFormat } from '../../../Utils/Common/dateUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseViewModel } from '../../../Hooks/PurchaseItem/usePurchaseViewModel';

export const PaymentView = () => {
   const navigate = useNavigate();
   const { orderId } = useParams()
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");
   const [selectedPhysicalAccount, setSelectedPhysicalAccount] = useState("");
   const [selectedCurrency, setSelectedCurrency] = useState("")
   const { getPurchaseOrderById, order } = usePurchaseViewModel()
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()
   const { getAllAccounts, accounts } = usePhysicalAccountViewModel()
   const [currencies, setCurrencies] = useState([])
   const { getPayments, payments, createPayment } = useTransactionViewModel()
   const [totalPayment, setTotalPayment] = useState()
   const [amount, setAmount] = useState()
   const { t } = useTranslation()

   useEffect(() => {
      getPurchaseOrderById(orderId)
   }, [])

   useEffect(() => {
      if (order._id) {
         getPayments(order._id)
         fetchAllMethods()
         getAllAccounts()
      }
   }, [order])

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentItem(paymentMethods[0]._id)
      }
   }, [paymentMethods])

   useEffect(() => {
      // default payment method
      if (accounts.length > 0) {
         setSelectedPhysicalAccount(accounts[0]._id)
      }
   }, [accounts])

   useEffect(() => {
      mapCurrencies()
   }, [selectedPhysicalAccount])

   useEffect(() => {
      console.log(amount)
   }, [amount])

   useEffect(() => {
      const suma = payments.reduce((accumulator, pay) => {
         return accumulator + pay.amount;
      }, 0); // Inicializa el acumulador en 0

      setTotalPayment(suma)
   }, [payments])

   const handleOnPaymentMethodChange = (event) => {
      const itemId = event.target.value;
      setSelectedPaymentItem(itemId);
   };

   const handleOnPhysicalAccountChange = (event) => {
      const itemId = event.target.value;
      setSelectedPhysicalAccount(itemId);
      setSelectedCurrency("")
   };

   const handleOnCurrencyChange = (event) => {
      const itemId = event.target.value;
      setSelectedCurrency(itemId);
   };

   const mapCurrencies = () => {
      if (!selectedPhysicalAccount) {
         setCurrencies([])
         return
      }
      // Find the account with the given accountId
      const account = accounts.find(account => account._id === selectedPhysicalAccount);

      // If the account is found, map its balances to extract currency details
      if (!account) {
         setCurrencies([])
         return
      }

      const items = account.balances.map(balance => ({
         _id: balance.currency._id,
         name: balance.currency.name,
         symbol: balance.currency.symbol,
         code: balance.currency.code,
         isEnabled: balance.currency.isEnabled,
      }));


      setCurrencies(items)
   }

   const totalToPay = () => formatCurrency(((order?.totalAmount || 0).toFixed(2)).toString());
   const totalPaid = () => formatCurrency(((totalPayment || 0).toFixed(2)).toString());
   const netToPay = () => formatCurrency(((order?.totalAmount || 0) - (totalPayment || 0)).toFixed(2).toString());


   const onCreatePaymentDidPressed = () => {
      createPayment(amount, order._id, selectedPaymentItem, selectedPhysicalAccount, selectedCurrency)
   }

   const onCancelDidPressed = () => {
      navigate(-1)
   }

   const onAmountDidChanged = (value) => {
      setAmount(value)
   }

   const getOrderInfo = () => {
      const itemInfo = `Item: ${order?.purchaseItem?.title} ${order.purchaseItem?.description}`
      const ownerInfo = `User: ${order?.user?.username}`
      const dateInfo = `Created At: ${dateAndTimeFormat(order?.date)}`
      const dueInfo = `Due Date: ${dateAndTimeFormat(order?.dueDate)}`
      const statusInfo = `Status: ${order?.status || ''}`

      return `${itemInfo} | ${ownerInfo} | ${dateInfo} | ${dueInfo} | ${statusInfo}`
   }

   return (
      <div className='purchase_crud_view__main'>

         <div className='purchase_crud_view__container  payment_view__gap'>
            <h1 className='purchase_crud_view__title'>{t('PAYMENT_VIEW_TITLE')}</h1>

            <h3> {getOrderInfo()} </h3>

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
               <h3 className='purchase_view__form-title'>{t('PAYMENT_VIEW_PHYSICAL_ACCOUNT_TITLE')}</h3>
               <select className="form-select" value={selectedPhysicalAccount} onChange={handleOnPhysicalAccountChange}>
                  {accounts.map((item) => {
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

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_TOTAL_TO_PAY_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{totalToPay()}</h3>
            </div>

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_TOTAL_PAID_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{totalPaid()}</h3>
            </div>

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_BALANCE_TO_PAY_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{netToPay()}</h3>
            </div>

            {order.status === 'pending_payment' && (
               <>
                  <div className='payment_view__total-amount-main'>
                     <AmountField
                        title={t('PAYMENT_VIEW_NEW_PAYMENT_AMOUNT_TITLE')}
                        amount={amount}
                        onAmountDidChanged={onAmountDidChanged}
                        textAlign={'end'}
                     />
                  </div>
               </>
            )}

            <div className='payment_view__buttons'>
               <SimpleButton
                  title={t('PAYMENT_VIEW_CANCEL_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidPressed()}
               />

               <SimpleButton
                  title={t('PAYMENT_VIEW_CREATE_PAYMENT_BUTTON_TITLE')}
                  style='secondary'
                  onClick={() => onCreatePaymentDidPressed()}
                  disabled={!(order.status === 'pending_payment')}
               />
            </div>
         </div>
      </div>
   )
}