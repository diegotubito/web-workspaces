import './SaleOrderCrudView.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../../Components/Spinner/spinner'
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../../Components/CustomAlert/ErrorAlert';
import { CustomerSelector } from './CustomerSelector';

export const SaleOrderCrudView = () => {
   const { t } = useTranslation()
   const navigate = useNavigate()
   const [selectedCustomer, setSelectedCustomer] = useState()

   const onCreateSaleDidClicked = () => {

   }

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   useEffect(() => {
      console.log(selectedCustomer)
   }, [selectedCustomer, setSelectedCustomer])


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
            <CustomerSelector
               selectedCustomer={selectedCustomer}
               setSelectedCustomer={setSelectedCustomer}
            />
         </div>

         <div className='sale_crud_view__footer'>

            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

               <SimpleButton
                  title={t('Create Sale')}
                  style='secondary'
                  onClick={() => onCreateSaleDidClicked()}
               />

            </div>
         </div>
      </div>
   )
}