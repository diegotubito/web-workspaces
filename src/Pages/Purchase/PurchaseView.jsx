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

export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()
   const [selectedOrder, setSelectedOrder] = useState()
   const [payButtonEnabled, setPayButtonEnabled] = useState(false)

   const { getPurchaseOrders, items, setItems, getOrder } = usePurchaseListViewModel()
   
   const { getPayments, payments } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsListViewModel()
   const [ mappedTransactions, setMappedTransactions ] = useState([])
 
   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      determineSelectionItem()
   }, [items])

   useEffect(() => {
      setMappedTransactions([])
      if (selectedOrder) {
         getPayments(selectedOrder._id)
      }
   }, [selectedOrder])

   useEffect(() => {
      setMappedTransactions(mapTransactions(payments))
   }, [payments])

   const determineSelectionItem = () => {
      const selectedItem = items.filter( (item) => {
         if (item.isSelected) {
            return item
         }
      })

      if (selectedItem.length === 0) { 
         setSelectedOrder(null)
         setPayButtonEnabled(false)
         return 
      }

      setPayButtonEnabled(true)
      setSelectedOrder(getOrder(selectedItem[0]._id))
   }

   const openPurchaseCrudView = () => {
      navigate(`/purchase_crud_view`)
   }

   const onDisabledDidClicked = () => {
      console.log('will disable')
   }

   const onPayemntDidClicked = () => {
      if (selectedOrder) {
         navigate(`/payment/${selectedOrder._id}`)
      }
   }

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <div className='purchase_view__button-container'>
            <SimpleButton
               style='primary'
               title='Create New Order'
               onClick={() => openPurchaseCrudView()}
               disabled={false}
            />
         </div>

         <GridView
            className='purchase__view-order-list '
            items={items}
            setItems={setItems}
            gap={'1px'}
            selectionMode={'single'}  // none, single, multiple.
         />

         <div className="purchase_view__button-container">
            <SimpleButton
               style='destructive'
               title='Disable'
               onClick={onDisabledDidClicked}
               disabled={false}
            />
            <SimpleButton
               style='primary'
               title='Pay'
               onClick={onPayemntDidClicked}
               disabled={!payButtonEnabled}
            />
           
         </div>

         <GridView
            className='purchase__view-order-list '
            items={mappedTransactions}
            setItems={setMappedTransactions}
            gap={'1px'}
            selectionMode={'single'}  // none, single, multiple.
         />

      </div >
   )
}