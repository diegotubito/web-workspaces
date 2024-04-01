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

export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const { getPurchaseOrders, orders, updateOrderStatus } = usePurchaseViewModel()
   const { mapOrders } = usePurchaseMapping()
   const [mappedOrders, setMappedOrders] = useState([])
   const [selectedOrder, setSelectedOrder] = useState()

   const { getPayments, payments, removePayment, getPaymentsByInstallment } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsMapping()
   const [mappedTransactions, setMappedTransactions] = useState([])
   const [selectedPayment, setSelectedPayment] = useState()

   const { getInstallments, installments } = useInstallmentViewModel()
   const { mapInstallments } = useInstallmentMapping()
   const [mappedInstallments, setMappedInstallments] = useState([])
   const [selectedInstallment, setSelectedInstallment] = useState()

   const [payButtonState, setPayButtonState] = useState(false)
   const [approveButtonState, setApproveButtonState] = useState(false)
   const [rejectButtonState, setRejectButtonState] = useState(false)
   const [removeButtonState, setRemoveButtonState] = useState(true)
   const [removePaymentButtonState, setRemovePaymentButtonState] = useState(false)

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      setMappedOrders(mapOrders(orders))
   }, [orders])

   useEffect(() => {
      determineSelectedOrder()
   }, [mappedOrders])

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

   const getOrder = (_id) => {
      return orders.filter((obj) => obj._id === _id)[0]
   }

   const determineSelectedOrder = () => {
      const selectedItems = mappedOrders.filter((item) => {
         if (item.isSelected) {
            return item
         }
      })

      setSelectedInstallment(null)

      if (selectedItems.length === 0) {
         setSelectedOrder(null)
         return
      }

      setSelectedOrder(getOrder(selectedItems[0]._id))
   }

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

   const onRemoveDidClicked = () => {
      if (selectedOrder) {
         updateOrderStatus(selectedOrder._id, 'cancelled')
      }
   }

   const onApproveDidClicked = () => {
      if (selectedOrder) {
         updateOrderStatus(selectedOrder._id, 'ready_to_pay')
      }
   }

   const onRejectDidClicked = () => {
      if (selectedOrder) {
         updateOrderStatus(selectedOrder._id, 'rejected')
      }
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
      validateApproveButton()
      validateRejectedButton()
      validateRemoveOrderButton()
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

   const validateApproveButton = () => {
      if (!selectedOrder) {
         setApproveButtonState(false)
         return
      }

      if (selectedOrder.status === 'pending_approval') {
         setApproveButtonState(true)
         return
      }

      setApproveButtonState(false)
   }

   const validateRejectedButton = () => {
      if (!selectedOrder) {
         setRejectButtonState(false)
         return
      }

      if (selectedOrder.status === 'pending_approval') {
         setRejectButtonState(true)
         return
      }

      setRejectButtonState(false)
   }


   const validateRemoveOrderButton = () => {
      if (!selectedOrder) {
         setRemoveButtonState(false)
         return
      }

      if (selectedOrder.status === 'ready_to_pay' || selectedOrder.status === 'pending_approval') {
         setRemoveButtonState(true)
         return
      }

      setRemoveButtonState(false)
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


   return (
      <div className='purchase_view__main purchase_view__gap'>
         <div className='purchase_view__button-container'>
            <SimpleButton
               style='primary'
               title='Create New Order'
               onClick={() => onNewPurchaseDidClicked()}
               disabled={false}
            />
         </div>

         <h3>Orders</h3>
         <GridView
            className='purchase__view-order-list '
            items={mappedOrders}
            setItems={setMappedOrders}
            gap={'1px'}
            selectionMode={'single'}  // none, single, multiple.
         />

         <div className="purchase_view__button-container">
            <SimpleButton
               style='destructive'
               title='Remove'
               onClick={onRemoveDidClicked}
               disabled={!removeButtonState}
            />
            <SimpleButton
               style='primary'
               title='Reject'
               onClick={onRejectDidClicked}
               disabled={!rejectButtonState}
            />

            <SimpleButton
               style='primary'
               title='Approve'
               onClick={onApproveDidClicked}
               disabled={!approveButtonState}
            />

         </div>



         {selectedOrder && (
            <>
               <h3>Installments</h3>
               <GridView
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
               <h3>Payments</h3>
               <GridView
                  className='purchase__view-order-list '
                  items={mappedTransactions}
                  setItems={setMappedTransactions}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               {payments.length === 0 ?
                  (
                     <h3> No hay pagos realizado.</h3>
                  )
                  :
                  (
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