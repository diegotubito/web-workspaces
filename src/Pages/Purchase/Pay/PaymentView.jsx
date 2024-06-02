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
import { PhysicalAccountSelector } from '../../../Components/Selectors/PhysicalAccountSelector/PhysicalAccountSelector';
import { AccountSelectorByCurrency } from '../../../Components/Selectors/AccountSelectorByCurrency/AccountSelectorByCurrency';

export const PaymentView = () => {
   const navigate = useNavigate();
   const { installmentId } = useParams()
   const [selectedPhysicalAccount, setSelectedPhysicalAccount] = useState("");
   const [selectedBalance, setSelectedBalance] = useState("")
   const { getInstallmentById, installment } = useInstallmentViewModel()
   const [balances, setBalances] = useState([])
   const { createPayment, transactionIsLoading, onTransactionError, setOnTransactionError, onCreatedTransactionSuccess } = useTransactionViewModel()
   const [amount, setAmount] = useState()
   const { t } = useTranslation()
   const [description, setDescription] = useState('')
   const [exchangeRate, setExchangeRate] = useState()

   useEffect(() => {
      getInstallmentById(installmentId)
   }, [])

   useEffect(() => {
      if (onCreatedTransactionSuccess) {
         popNavigation()
      }
   }, [onCreatedTransactionSuccess])

   useEffect(() => {
      const balanceItem = balances.find((c) => c._id === selectedBalance)
      const originExchageRate = installment?.currency?.exchangeRate
      const destinyExchangeRate = balanceItem?.currency?.exchangeRate

      setExchangeRate(destinyExchangeRate / originExchageRate)
   }, [selectedBalance])


   const totalToPay = () => formatCurrency(((installment?.amount || 0).toFixed(2)).toString());
   const totalPaid = () => formatCurrency(((installment.paidAmount || 0).toFixed(2)).toString());
   const netToPay = () => formatCurrency(((installment?.remainingAmount || 0)).toFixed(2).toString());


   const onCreatePaymentDidPressed = () => {
      createPayment(installment.type, 'order', amount, installment, selectedPhysicalAccount, selectedBalance, description, installment._id, exchangeRate)
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

            <AccountSelectorByCurrency
               destiny={'assignees'}
               title={t('PAYMENT_VIEW_PHYSICAL_ACCOUNT_TITLE')}
               balanceTitle={t('Balance')}
               selectedPhysicalAccount={selectedPhysicalAccount}
               setSelectedPhysicalAccount={setSelectedPhysicalAccount}
               selectedBalance={selectedBalance}
               setSelectedBalance={setSelectedBalance}
               balances={balances}
               setBalances={setBalances}
               withCurrency={installment.currency}
            />

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
                        initialValue={installment.amount.toFixed(2).toString()}
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