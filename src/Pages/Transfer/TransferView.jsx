
import './TransferView.css'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';
import { PhysicalAccountSelector } from '../../Components/Selectors/PhysicalAccountSelector/PhysicalAccountSelector';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel';
import { NewAmountInput } from '../../Components/TextField/NewAmountInput/NewAmountInput';

export const TransferView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const {
      transferFunds,
      transferSucceed,
      onTransferError,
      setOnTransferError,
      isLoading
   } = useTransactionViewModel()

   const [selectedSourceAccount, setSelectedSourceAccount] = useState()
   const [selectedSourceBalance, setSelectedSourceBalance] = useState("")
   const [sourceBalances, setSourceBalances] = useState([])

   const [selectedDestinyAccount, setSelectedDestinyAccount] = useState()
   const [selectedDestinyBalance, setSelectedDestinyBalance] = useState("")
   const [destinyBalances, setDestinyBalances] = useState([])

   const [total, setTotal] = useState()

   useEffect(() => {
      if (transferSucceed) {
         navigate(-1)
      }
   }, [transferSucceed])

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   const onCreateDidClicked = () => {
      const fromBalanceObject = sourceBalances.find((balance) => balance._id === selectedSourceBalance);
      const toBalanceObject = destinyBalances.find((balance) => balance._id === selectedDestinyBalance);

      if (!fromBalanceObject) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'Source balance not found.'
         });
      }

      if (!toBalanceObject) {
         return setOnTransferError({
            title: 'Validation Error',
            message: 'Destiny balance not found.'
         });
      }

      transferFunds(selectedSourceAccount, fromBalanceObject, selectedDestinyAccount, toBalanceObject, total, 1)
   }

   const onAmountDidChanged = (value) => {
      setTotal(value)
   }

   return (
      <div className='transfer_view__main'>
         {isLoading && <Spinner />}


         {onTransferError && (
            <div className="alert-container">
               <Alert variant="warning">
                  <Alert.Heading>{onTransferError.title}</Alert.Heading>
                  <h3>
                     {onTransferError.message}
                  </h3>
                  <hr />
                  <div className="d-flex justify-content-end">
                     <Button onClick={() => setOnTransferError(null)} variant="outline-success">
                        Close me
                     </Button>
                  </div>
               </Alert>
            </div>
         )}

         <div className='transfer_view__header'>
            <div className='sale_crud_view__footer-buttons'>



            </div>
         </div>

         <div className='transfer_view__body'>            

            <PhysicalAccountSelector
               destiny={'assignees'}
               title={t('TRANSFER_VIEW_SOURCE_PHYSICAL_ACCOUNT_TITLE')}
               balanceTitle={t('TRANSFER_VIEW_SOURCE_CURRENCY_TITLE')}
               selectedPhysicalAccount={selectedSourceAccount}
               setSelectedPhysicalAccount={setSelectedSourceAccount}
               selectedBalance={selectedSourceBalance}
               setSelectedBalance={setSelectedSourceBalance}
               balances={sourceBalances}
               setBalances={setSourceBalances}
            />

            <PhysicalAccountSelector
               destiny={'assigneesTransfer'}
               title={t('TRANSFER_VIEW_DESTINY_PHYSICAL_ACCOUNT_TITLE')}
               balanceTitle={t('TRANSFER_VIEW_DESTINY_CURRENCY_TITLE')}
               selectedPhysicalAccount={selectedDestinyAccount}
               setSelectedPhysicalAccount={setSelectedDestinyAccount}
               selectedBalance={selectedDestinyBalance}
               setSelectedBalance={setSelectedDestinyBalance}
               balances={destinyBalances}
               setBalances={setDestinyBalances}
            />

            <div className='transfer_view__total-amount-main'>
               <NewAmountInput
                  isEnabled={true}
                  maxLength={15}
                  textAlign={'end'}
                  initialValue={0}
                  onInputChanged={onAmountDidChanged}
               />
            </div>


         </div >

         <div className='transfer_view__footer'>

            <div className='transfer_view__footer-buttons'>

               <SimpleButton
                  title={t('TRANSFER_VIEW_CANCEL_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

               <SimpleButton
                  title={t('TRANSFER_VIEW_CREATE_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCreateDidClicked()}
               />

            </div>
         </div>
      </div>


   )
}