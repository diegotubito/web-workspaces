import './PurchaseView.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Spinner } from '../../Components/Spinner/spinner'
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';

import { PurchaseOrderComponent } from './PurchaseComponents/PurchaseOrderComponent';
import { PurchaseOrderInstallmentComponent } from './PurchaseComponents/PurchaseOrderInstallmentComponent';
import { PurchaseOrderTransactionComponent } from './PurchaseComponents/PurchaseOrderTransactionComponent';

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

   return (
      <div className='purchase_view__main purchase_view__gap'>

         {isLoading && <Spinner/> }
        

         { purchaseError && (
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



         <div className='purchase_view__button-container'>
            <SimpleButton
               style='primary'
               title='Create New Order'
               onClick={() => onNewPurchaseDidClicked()}
               disabled={false}
            />
         </div>


         <PurchaseOrderComponent
            onSelectedOrder={onSelectedOrder}
            onPurchaseOrderFailed={onPurchaseOrderError}
            reloadTrigger={reloadTrigger}
            setIsLoading={setIsLoading}
         />

         <PurchaseOrderInstallmentComponent
            initialOrder={selectedOrder}
            onSelectedInstallment={onSelectedInstallment}
            onInstallmentError={onInstallmentError}
            onPayemntDidClicked={onPayemntDidClicked}
            setIsLoading={setIsLoading}
         />

        <PurchaseOrderTransactionComponent
            initialInstallment={selectedInstallment}
            onSelectedTransaction={onSelectedTransaction}
            onTransactionError={onTransactionError}
            onTransactionChange={handleTransactionChange}
            setIsLoading={setIsLoading}
        />

      </div >
   )
}