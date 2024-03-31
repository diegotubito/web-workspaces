import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { GridView } from '../../Components/GridView/GridView';
import './PurchaseView.css'
import { usePurchaseListViewModel } from './usePurchaseListViewModel'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { useNavigate } from 'react-router-dom';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel'
import { usePaymentsListViewModel } from './usePaymentsListViewModel'
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';

export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()

   const { getPurchaseOrders, orders, updateOrderStatus } = usePurchaseViewModel()
   const { mapOrders } = usePurchaseListViewModel()
   const [ mappedOrders, setMappedOrders ] = useState([])
   const [selectedOrder, setSelectedOrder] = useState()

   const { getPayments, payments, removePayment } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsListViewModel()
   const [ mappedTransactions, setMappedTransactions ] = useState([])
   const [ selectedPayment, setSelectedPayment] = useState()

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
      setMappedTransactions([])
      if (selectedOrder) {
         getPayments(selectedOrder._id)
      }
      validateOrderButtons()
   }, [selectedOrder])

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
         navigate(`/payment/${selectedOrder._id}`)
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
      validatePayButton()
      validateApproveButton()
      validateRejectedButton()
      validateRemoveOrderButton()
      validateRemovePaymentButton()
   }

   const validatePayButton = () => {
      if (!selectedOrder) {
         setPayButtonState(false)
         return 
      }

      if (selectedOrder.status === 'cancelled' || selectedOrder.status === 'pending_approval' || selectedOrder.status === 'rejected') {
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
            <SimpleButton
               style='primary'
               title='Pay'
               onClick={onPayemntDidClicked}
               disabled={!payButtonState}
            />
           
         </div>

        { selectedOrder && (
         <>
               <GridView
                  className='purchase__view-order-list '
                  items={mappedTransactions}
                  setItems={setMappedTransactions}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               { payments.length > 0 && (
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