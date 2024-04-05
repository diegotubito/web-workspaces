import './SaleOrderCrudView.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../../Components/Spinner/spinner'
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../../Components/CustomAlert/ErrorAlert';


export const SaleOrderCrudView = () => {
   const { t } = useTranslation()
   const navigate = useNavigate()

   const onCreateSaleDidClicked = () => {

   }

   const onCancelDidClicked = () => {
      navigate(-1)
   }


   return (

      <div className='sale_crud_view__main'>
         <div className='sale_crud_view__header'>
            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

            </div>
         </div>

         <div className='sale_crud_view__body'>

         </div>

         <div className='sale_crud_view__footer'>

            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CREATE_ORDER_BUTTON_TITLE')}
                  style='secondary'
                  onClick={() => onCreateSaleDidClicked()}
               />

            </div>
         </div>
      </div>
   )
}