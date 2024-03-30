import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { GridView } from '../../Components/GridView/GridView';
import './PurchaseView.css'
import { usePurchaseListViewModel } from './usePurchaseListViewModel'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { useNavigate } from 'react-router-dom';

export const PurchaseView = () => {
   const navigate = useNavigate();
   const { t } = useTranslation()
   const [selectedOrder, setSelectedOrder] = useState()
   const [payButtonEnabled, setPayButtonEnabled] = useState(false)

   const { getPurchaseOrders, items, setItems, getOrder } = usePurchaseListViewModel()

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      determineSelectionItem()
   }, [items])

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
      </div >
   )
}