
import './TransferView.css'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';
import { PhysicalAccountSelector } from '../../Components/PhysicalAccountSelector/PhysicalAccountSelector';
import { AmountTextField } from '../../Components/TextField/AmountTextField/AmountTextField'
import { usePhysicalAccountViewModel } from '../../Hooks/PhysicalAccount/usePhysicalAccountViewModel';

export const TransferView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const { transferFunds, transferSucceed} = usePhysicalAccountViewModel()

   const [selectedSourceAccount, setSelectedSourceAccount] = useState()
   const [selectedSourceBalance, setSelectedSourceBalance] = useState("")
   const [selectedSourceCurrency, setSelectedSourceCurrency] = useState("")
   const [sourceCurrencies, setSourceCurrencies] = useState([])

   const [selectedDestinyAccount, setSelectedDestinyAccount] = useState()
   const [selectedDestinyBalance, setSelectedDestinyBalance] = useState("")
   const [selectedDestinyCurrency, setSelectedDestinyCurrency] = useState("")
   const [destinyCurrencies, setDestinyCurrencies] = useState([])

   const [ total, setTotal] = useState()

   const [isLoading, setIsLoading] = useState()

   useEffect(() => {
      if (transferSucceed) {
         navigate(-1)
      }
   }, [transferSucceed])

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   const onCreateDidClicked = () => {
      transferFunds(selectedSourceAccount, selectedSourceBalance, selectedDestinyAccount, selectedDestinyBalance, total, 1)
   }

   const onAmountDidChanged = (value) => {
      setTotal(value)
   }

   return (
      <div className='transfer_view__main'>
         {isLoading && <Spinner />}

         <div className='transfer_view__header'>
            <div className='sale_crud_view__footer-buttons'>



            </div>
         </div>

         <div className='transfer_view__body'>

            <div className='transfer_view__total-amount-main'>
               <AmountTextField
                  initialValue={0}
                  onChangeValue={onAmountDidChanged}
                  form={ {textAlign: "left"} }
               />
            </div>

            <PhysicalAccountSelector
               destiny={'assignees'}
               title={t('TRANSFER_VIEW_SOURCE_PHYSICAL_ACCOUNT_TITLE')}
               currencyTitle={t('TRANSFER_VIEW_SOURCE_CURRENCY_TITLE')}
               selectedPhysicalAccount={selectedSourceAccount}
               setSelectedPhysicalAccount={setSelectedSourceAccount}
               selectedCurrency={selectedSourceCurrency}
               setSelectedCurrency={setSelectedSourceCurrency}
               currencies={sourceCurrencies}
               setCurrencies={setSourceCurrencies}
               selectedBalance={selectedSourceBalance}
               setSelectedBalance={setSelectedSourceBalance}
            />

            <PhysicalAccountSelector
               destiny={'assigneesTransfer'}
               title={t('TRANSFER_VIEW_DESTINY_PHYSICAL_ACCOUNT_TITLE')}
               currencyTitle={t('TRANSFER_VIEW_DESTINY_CURRENCY_TITLE')}
               selectedPhysicalAccount={selectedDestinyAccount}
               setSelectedPhysicalAccount={setSelectedDestinyAccount}
               selectedCurrency={selectedDestinyCurrency}
               setSelectedCurrency={setSelectedDestinyCurrency}
               currencies={destinyCurrencies}
               setCurrencies={setDestinyCurrencies}
               selectedBalance={selectedDestinyBalance}
               setSelectedBalance={setSelectedDestinyBalance}
            />

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