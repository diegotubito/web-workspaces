import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { GridView } from '../../Components/GridView/GridView';
import './PurchaseView.css'
import { usePurchaseMapping } from './usePurchaseMapping'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { useNavigate } from 'react-router-dom';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel'
import { usePaymentsMapping } from './usePaymentsMapping'
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';
// Installments
import { useInstallmentViewModel } from '../../Hooks/Installment/useInstallmentViewModel';
import { useInstallmentMapping } from './useInstallmentMapping';
import { ErrorAlert } from '../../Components/CustomAlert/ErrorAlert';

import { PurchaseOrderComponent } from './PurchaseComponents/PurchaseOrderComponent';
import { PurchaseOrderInstallmentComponent } from './PurchaseComponents/PurchaseOrderInstallmentComponent';


export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   // NEW ORDER COMPONENT
   const [selectedOrder, setSelectedOrder] = useState()
   const [purchaseError, setPurchaseError] = useState()

   // NEW INSTALLMENT COMPONENT
   const [selectedInstallment, setSelectedInstallment] = useState()
   const [installmentError, setInstallmentError] = useState()

   const { getPayments, payments, removePayment, getPaymentsByInstallment, onTransactionSuccess } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsMapping()
   const [mappedTransactions, setMappedTransactions] = useState([])
   const [selectedPayment, setSelectedPayment] = useState()
   
   const [removePaymentButtonState, setRemovePaymentButtonState] = useState(false)

   // PAYMENTS

   useEffect(() => {
      setMappedTransactions([])
      if (selectedInstallment) {
         getPaymentsByInstallment(selectedInstallment._id)
      }
   }, [selectedInstallment])

   useEffect(() => {
      setMappedTransactions(mapTransactions(payments))
   }, [payments])

   useEffect(() => {
      determineSelectedPayment()
   }, [mappedTransactions])

   useEffect(() => {
      validateRemovePaymentButton()
   }, [selectedPayment])

   const getPayment = (_id) => {
      return payments.filter((obj) => obj._id === _id)[0]
   }

   const determineSelectedPayment = () => {
      const selectedItems = mappedTransactions.filter((item) => {
         if (item.isSelected) {
            return item
         }
      })

      if (selectedItems.length === 0) {
         setSelectedPayment(null)
         return
      }

      setSelectedPayment(getPayment(selectedItems[0]._id))
   }

   const onNewPurchaseDidClicked = () => {
      navigate(`/purchase_crud_view`)
   }

   const onRemovePaymentDidClicked = () => {
      if (selectedPayment) {
         removePayment(selectedPayment._id)
      }
   }

   const validateRemovePaymentButton = () => {
      if (!selectedPayment) {
         setRemovePaymentButtonState(false)
         return
      }

      if (selectedPayment.isEnabled) {
         setRemovePaymentButtonState(true)
         return
      }

      setRemovePaymentButtonState(false)
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

   return (
      <div className='purchase_view__main purchase_view__gap'>

         {purchaseError && (
            <ErrorAlert
               errorDetails={purchaseError}
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
            onPurchaseOrderError={onPurchaseOrderError}
         />

         <PurchaseOrderInstallmentComponent
            initialOrder={selectedOrder}
            onSelectedInstallment={onSelectedInstallment}
            onInstallmentError={onInstallmentError}
            onPayemntDidClicked={onPayemntDidClicked}
         />

         {selectedInstallment && (
            <>
               <GridView
                  gridTitle={'Payments'}
                  className='purchase__view-order-list '
                  items={mappedTransactions}
                  setItems={setMappedTransactions}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               {payments.length === 0 ?
                  (
                     <h3> No hay pagos realizado.</h3>
                  ) : (
                     <div className="purchase_view__button-container">
                        <SimpleButton
                           style='destructive'
                           title='Remove'
                           onClick={onRemovePaymentDidClicked}
                           disabled={!removePaymentButtonState}
                        />
                     </div>
                  )}

            </>
         )}

      </div >
   )
}