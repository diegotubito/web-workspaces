import { useEffect, useState } from 'react';
import './PaymentView.css'
import { usePaymentViewModel } from '../../../Hooks/Payment/PaymentViewModel';
import { usePhysicalAccountViewModel } from '../../../Hooks/PhysicalAccount/usePhysicalAccountViewModel';
import { useTransactionViewModel } from '../../../Hooks/Transaction/useTransactionViewModel';
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { useTranslation } from 'react-i18next';
import { dateAndTimeFormat } from '../../../Utils/Common/dateUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { useInstallmentViewModel } from '../../../Hooks/Installment/useInstallmentViewModel';
import { Spinner } from '../../../Components/Spinner/spinner'
import { Button, Alert } from 'react-bootstrap';
import { NoteTextField } from '../../../Components/TextField/NoteTextField/NoteTextField';
import { AmountTextField } from '../../../Components/TextField/AmountTextField/AmountTextField';
import { PhysicalAccountSelector } from '../../../Components/PhysicalAccountSelector/PhysicalAccountSelector';

export const PaymentView = () => {
   const navigate = useNavigate();
   const { installmentId } = useParams()
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");
   const [selectedPhysicalAccount, setSelectedPhysicalAccount] = useState("");
   const [selectedBalance, setSelectedBalance] = useState("")
   const [selectedCurrency, setSelectedCurrency] = useState("")
   const { getInstallmentById, installment } = useInstallmentViewModel()
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()
   const [currencies, setCurrencies] = useState([])
   const { createPayment, transactionIsLoading, onTransactionError, setOnTransactionError, onCreatedTransactionSuccess } = useTransactionViewModel()
   const [amount, setAmount] = useState()
   const { t } = useTranslation()
   const [description, setDescription] = useState('')
   const [exchangeRate, setExchangeRate] = useState()

   useEffect(() => {
      getInstallmentById(installmentId)
   }, [])

   useEffect(() => {
      if (installment._id) {
         fetchAllMethods()
      }
   }, [installment])

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentItem(paymentMethods[0]._id)
      }
   }, [paymentMethods])

   useEffect(() => {

   }, [amount])

   useEffect(() => {
      if (onCreatedTransactionSuccess) {
         popNavigation()
      }
   }, [onCreatedTransactionSuccess])

   useEffect(() => {
      const currencyItem = currencies.find((c) => c._id === selectedCurrency)
      const originExchageRate = installment?.currency?.exchangeRate
      const destinyExchangeRate = currencyItem?.exchangeRate

      setExchangeRate(destinyExchangeRate / originExchageRate)
   }, [selectedCurrency])


   const handleOnPaymentMethodChange = (event) => {
      const itemId = event.target.value;
      setSelectedPaymentItem(itemId);
   };

   const totalToPay = () => formatCurrency(((installment?.amount || 0).toFixed(2)).toString());
   const totalPaid = () => formatCurrency(((installment.paidAmount || 0).toFixed(2)).toString());
   const netToPay = () => formatCurrency(((installment?.remainingAmount || 0)).toFixed(2).toString());


   const onCreatePaymentDidPressed = () => {
      createPayment('purchase', 'order', amount, installment?.remainingAmount, installment.order._id, selectedPaymentItem, selectedPhysicalAccount, selectedCurrency, description, installment._id, exchangeRate)
   }

   const onCancelDidPressed = () => {
      popNavigation()
   }

   const popNavigation = () => {
      navigate(-1)
   }

   const onAmountDidChanged = (value) => {
      setAmount(value)
   }

   const onDescriptionChangeHandler = (value) => {
      setDescription(value)
   }

   const getOrderInfo = () => {
      /*
      const itemInfo = `Item: ${order?.purchaseItem?.title} ${order.purchaseItem?.description}`
      const ownerInfo = `User: ${order?.user?.username}`
      const dateInfo = `Created At: ${dateAndTimeFormat(order?.date)}`
      const dueInfo = `Due Date: ${dateAndTimeFormat(order?.dueDate)}`
      const statusInfo = `Status: ${order?.status || ''}`

      return `${itemInfo} | ${ownerInfo} | ${dateInfo} | ${dueInfo} | ${statusInfo}`
      */
   }

   const getErrorTitle = (error) => {
      return error.title
   }
   const getErrorMessage = (error) => {
      return error.message
   }

   return (
      <div className='payment_view__main '>

         {transactionIsLoading && <Spinner />}


         {onTransactionError && (
            <div className="alert-container">
               <Alert variant="warning">
                  <Alert.Heading>{onTransactionError.title}</Alert.Heading>
                  <h3>
                     {onTransactionError.message}
                  </h3>
                  <hr />
                  <div className="d-flex justify-content-end">
                     <Button onClick={() => setOnTransactionError(null)} variant="outline-success">
                        Close me
                     </Button>
                  </div>
               </Alert>
            </div>
         )}

         <div className='payment_view__container   payment_view__gap'>
            <h1 className='purchase_crud_view__title'>{t('PAYMENT_VIEW_TITLE')}</h1>

            <h3> {getOrderInfo()} </h3>

            <PhysicalAccountSelector
               destiny={'assignees'}
               title={t('PAYMENT_VIEW_PHYSICAL_ACCOUNT_TITLE')}
               currencyTitle={t('PAYMENT_VIEW_CURRENCY_TITLE')}
               selectedPhysicalAccount={selectedPhysicalAccount}
               setSelectedPhysicalAccount={setSelectedPhysicalAccount}
               selectedCurrency={selectedCurrency}
               setSelectedCurrency={setSelectedCurrency}
               currencies={currencies}
               setCurrencies={setCurrencies}
               selectedBalance={selectedBalance}
               setSelectedBalance={setSelectedBalance}
            />

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

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_TOTAL_TO_PAY_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{`(${installment?.currency?.code}) ${totalToPay()}`}</h3>
            </div>

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_TOTAL_PAID_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{`(${installment?.currency?.code}) ${totalPaid()}`}</h3>
            </div>

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_BALANCE_TO_PAY_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{`(${installment?.currency?.code}) ${netToPay()}`}</h3>
            </div>

            <div className='payment_view__total-amount-main'>
               <h3>{t('PAYMENT_VIEW_EXCHANGE_RATE_TITLE')}</h3>
               <h3 className='payment_view__total-amount'>{exchangeRate}</h3>
            </div>

           

            {(installment?.order?.status === 'partial_payment' || installment?.order?.status === 'ready_to_pay') && (
               <>

                  <div className='payment_view__total-amount-main'>
                     <h3 className='purchase_view__form-title'>{t('Payment')}</h3>
                     <AmountTextField
                        initialValue={0}
                        onChangeValue={onAmountDidChanged}
                     />
                  </div>
               </>
            )}

            <div className='payment_view__buttons'>
               <NoteTextField
                  value={description}
                  onChangeValue={onDescriptionChangeHandler}
                  placeholder={'Description'}
                  minLength={0}
                  maxLength={300}
               />
            </div>

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
                  disabled={false}
               />
            </div>
         </div>
      </div>
   )
}