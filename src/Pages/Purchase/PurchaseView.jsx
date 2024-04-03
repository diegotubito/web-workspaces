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


export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   // NEW ORDER COMPONENT
   const [selectedOrder, setSelectedOrder] = useState()
   const [purchaseError, setPurchaseError] = useState()

   const { getPayments, payments, removePayment, getPaymentsByInstallment, onTransactionSuccess } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsMapping()
   const [mappedTransactions, setMappedTransactions] = useState([])
   const [selectedPayment, setSelectedPayment] = useState()

   const { getInstallments, installments } = useInstallmentViewModel()
   const { mapInstallments } = useInstallmentMapping()
   const [mappedInstallments, setMappedInstallments] = useState([])
   const [selectedInstallment, setSelectedInstallment] = useState()

   const [payButtonState, setPayButtonState] = useState(false)
   
   const [removePaymentButtonState, setRemovePaymentButtonState] = useState(false)

   
   useEffect(() => {
      setMappedInstallments([])
      if (selectedOrder) {
         getInstallments(selectedOrder._id)
      }
      validateOrderButtons()
   }, [selectedOrder])

   useEffect(() => {
      setMappedInstallments(mapInstallments(installments))
   }, [installments])

   useEffect(() => {
      determineSelectedInstallment()
   }, [mappedInstallments])

   const determineSelectedInstallment = () => {
      const selectedItems = mappedInstallments.filter((item) => {
         if (item.isSelected) {
            return item
         }
      })

      if (selectedItems.length === 0) {
         setSelectedInstallment(null)
         return
      }

      setSelectedInstallment(getInstallment(selectedItems[0]._id))
   }

   const getInstallment = (_id) => {
      return installments.filter((obj) => obj._id === _id)[0]
   }


   // PAYMENTS

   useEffect(() => {
      setMappedTransactions([])
      if (selectedInstallment) {
         getPaymentsByInstallment(selectedInstallment._id)
      }
      validateInstallmentButtons()
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

   const onPayemntDidClicked = () => {
      if (selectedOrder) {
         navigate(`/payment/${selectedInstallment._id}`)
      }
   }

   const onNewPurchaseDidClicked = () => {
      navigate(`/purchase_crud_view`)
   }

   const onRemovePaymentDidClicked = () => {
      if (selectedPayment) {
         removePayment(selectedPayment._id)
      }
   }

   const validateOrderButtons = () => {
      validateRemovePaymentButton()
   }

   const validateInstallmentButtons = () => {
      validatePayButton()
   }

   const validatePayButton = () => {
      if (!selectedInstallment || !selectedOrder) {
         setPayButtonState(false)
         return
      }

      if (selectedInstallment.status === 'paid' || selectedOrder.status === 'pending_approval' || selectedOrder.status === 'rejected' || selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled') {
         setPayButtonState(false)
         return
      }

      setPayButtonState(true)
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
         />

         {selectedOrder && (
            <>
               <GridView
                  gridTitle={'Installments'}
                  className='purchase__view-order-list '
                  items={mappedInstallments}
                  setItems={setMappedInstallments}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               {installments.length > 0 && (
                  <div className="purchase_view__button-container">
                     <SimpleButton
                        style='primary'
                        title='Pay'
                        onClick={onPayemntDidClicked}
                        disabled={!payButtonState}
                     />
                  </div>
               )}

            </>
         )}

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