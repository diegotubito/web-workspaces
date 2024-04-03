import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import { GridView } from '../../../Components/GridView/GridView';
import { usePurchaseMapping } from '../usePurchaseMapping';
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton';
import { usePurchaseViewModel } from '../../../Hooks/PurchaseItem/usePurchaseViewModel';


export const PurchaseOrderComponent = ({ onSelectedOrder, onPurchaseOrderFailed, reloadTrigger, setIsLoading }) => {
   const { t } = useTranslation()

   const { getPurchaseOrders, orders, updateOrderStatus, onPurchaseOrderSuccess, onPurchaseFailed, isLoading } = usePurchaseViewModel()
   const { mapOrders } = usePurchaseMapping()
   const [mappedOrders, setMappedOrders] = useState([])
   const [selectedOrder, setSelectedOrder] = useState()

   const [approveButtonState, setApproveButtonState] = useState(false)
   const [rejectButtonState, setRejectButtonState] = useState(false)
   const [removeButtonState, setRemoveButtonState] = useState(true)

   useEffect(() => {
      setIsLoading(isLoading)
   }, [isLoading, setIsLoading])

   useEffect(() => {
      getPurchaseOrders()
   }, [reloadTrigger])

   useEffect(() => {
      if (selectedOrder) {
         setMappedOrders(mapOrders(orders, selectedOrder._id))
      } else {
         setMappedOrders(mapOrders(orders, ''))
      }
   }, [orders])

   useEffect(() => {
      determineSelectedOrder()
   }, [mappedOrders])

   useEffect(() => {
      if (onPurchaseOrderSuccess) {
         getPurchaseOrders()
      }
   }, [onPurchaseOrderSuccess])

   useEffect(() => {
      validateOrderButtons()
      onSelectedOrder(selectedOrder)
   }, [selectedOrder])

   useEffect(() => {
      onPurchaseOrderFailed(onPurchaseFailed)
   }, onPurchaseFailed)

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

   const validateOrderButtons = () => {
      validateApproveButton()
      validateRejectedButton()
      validateRemoveOrderButton()
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

   return (
      <>   
         {mappedOrders.length === 0 ? (
            <h3>
               No tienes ninguna order de compra.
            </h3>
         ) : (
            <>
               <GridView
                  gridTitle={'Orders'}
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
            </>

         )}
      </ >
   )
}