
import './TransferView.css'

import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';
import { PhysicalAccountSelector } from '../../Components/PhysicalAccountSelector/PhysicalAccountSelector';
import { CurrencySelector } from '../../Components/CurrencySelector/CurrencySelector';

export const TransferView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const [selectedPhysicalAccount, setSelectedPhysicalAccount] = useState()
   const [selectedCurrency, setSelectedCurrency] = useState("")

   const [isLoading, setIsLoading] = useState()

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   return (
      <div className='transfer_view__main'>
         {isLoading && <Spinner />}

         <div className='transfer_view__header'>
            <div className='sale_crud_view__footer-buttons'>



            </div>
         </div>

         <div className='transfer_view__body'>

            <PhysicalAccountSelector
               title={'Physical Account'}
               currencyTitle={'Currency'}
               selectedPhysicalAccount={selectedPhysicalAccount}
               setSelectedPhysicalAccount={setSelectedPhysicalAccount}
               selectedCurrency={selectedCurrency}
               setSelectedCurrency={setSelectedCurrency}
            />

         </div >


         <div className='transfer_view__footer'>

            <div className='transfer_view__footer-buttons'>

               <SimpleButton
                  title={t('sale_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

            </div>
         </div>
      </div>


   )
}