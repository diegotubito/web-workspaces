
import './CashBalanceView.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';

export const CashBalanceView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const [isLoading, setIsLoading] = useState()

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   return (
      <div className='cash_balance_view__main'>
         {isLoading && <Spinner />}

         <div className='cash_balance_view__header'>
            <div className='sale_crud_view__footer-buttons'>

             

            </div>
         </div>

         <div className='cash_balance_view__body'>




         </div >


         <div className='cash_balance_view__footer'>

            <div className='cash_balance_view__footer-buttons'>

               <SimpleButton
                  title={t('CASH_BALANCE_VIEW_CANCEL_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

            </div>
         </div>
      </div>


   )
}