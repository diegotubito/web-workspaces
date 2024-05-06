import './PurchaseView.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';

import { OrderComponent } from '../../Components/OrderComponent/Order/OrderComponent';
import { OrderInstallmentComponent } from '../../Components/OrderComponent/Installment/OrderInstallmentComponent';
import { OrderTransactionComponent } from '../../Components/OrderComponent/Transaction/OrderTransactionComponent';

export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const [isLoading, setIsLoading] = useState()
   const [reloadTrigger, setReloadTrigger] = useState(false);

   // NEW ORDER COMPONENT
   const [selectedOrder, setSelectedOrder] = useState()
   const [purchaseError, setPurchaseError] = useState()

   // NEW INSTALLMENT COMPONENT
   const [selectedInstallment, setSelectedInstallment] = useState()
   const [installmentError, setInstallmentError] = useState()

   // NEW INSTALLMENT COMPONENT
   const [selectedTransaction, setSelectedTransaction] = useState()
   const [transactionError, setTransactionError] = useState()

   const onNewPurchaseDidClicked = () => {
      navigate(`/purchase_crud_view`)
   }
   
   // Callbacks from PurchaseOrderComponent
   const onSelectedOrder = (order) => {
      setSelectedOrder(order)
   }
   // Callbacks from PurchaseOrderComponent
   const onPurchaseOrderError = (error) => {
      setPurchaseError(error)
   }


   // Callbacks from InstallmentComponent
   const onSelectedInstallment = (installment) => {
      setSelectedInstallment(installment)
   }
   // Callbacks from InstallmentComponent
   const onInstallmentError = (error) => {
      setInstallmentError(error)
      
   }
   // Callbacks from InstallmentComponent
   const onPayemntDidClicked = () => {
      if (selectedOrder) {
         navigate(`/payment/${selectedInstallment._id}`)
      }
   }

   // Callbacks from PurchaseOrderComponent
   const onSelectedTransaction = (transaction) => {
      setSelectedTransaction(transaction)
   }
   // Callbacks from PurchaseOrderComponent
   const onTransactionError = (error) => {
      setTransactionError(error)
   }



   const handleTransactionChange = () => {
      setReloadTrigger(prev => !prev); // Cambia el valor para desencadenar una actualización
   };

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   return (
      <div className='purchase_view__main'>
         {isLoading && <Spinner />}


         {purchaseError && (
            <ErrorAlert
               errorDetails={purchaseError}
               navigate={navigate}
            />
         )}

         {installmentError && (
            <ErrorAlert
               errorDetails={installmentError}
               navigate={navigate}
            />
         )}

         {transactionError && (
            <ErrorAlert
               errorDetails={transactionError}
               navigate={navigate}
            />
         )}



         <div className='purchase_view____header'>
            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  style='primary'
                  title='Create New Order'
                  onClick={() => onNewPurchaseDidClicked()}
                  disabled={false}
               />

            </div>
         </div>

         <div className='purchase_view____body'>


            <OrderComponent
               type={'purchase'}
               onSelectedOrder={onSelectedOrder}
               onOrderError={onPurchaseOrderError}
               reloadTrigger={reloadTrigger}
               setIsLoading={setIsLoading}
            />

            <OrderInstallmentComponent
               initialOrder={selectedOrder}
               onSelectedInstallment={onSelectedInstallment}
               onInstallmentError={onInstallmentError}
               onPayemntDidClicked={onPayemntDidClicked}
               setIsLoading={setIsLoading}
            />

            <OrderTransactionComponent
               initialInstallment={selectedInstallment}
               onSelectedTransaction={onSelectedTransaction}
               onTransactionError={onTransactionError}
               onTransactionChange={handleTransactionChange}
               setIsLoading={setIsLoading}
            />

         </div >


         <div className='purchase_view____footer'>

            <div className='purchase_view____footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

            </div>
         </div>
      </div>


       )
}