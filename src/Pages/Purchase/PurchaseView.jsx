import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';
import { GridView } from '../../Components/GridView/GridView';
import './PurchaseView.css'
import { usePurchaseListViewModel } from './usePurchaseListViewModel'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../Components/Buttons/SimpleButton/SimpleButton'
import { PaymentView } from './Pay/PaymentView';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)
   const [shouldOpenPaymentView, setShouldOpenPaymentView] = useState(false)

   const { getPurchaseOrders, items, setItems } = usePurchaseListViewModel()

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      console.log(items)
   }, [items])

   const openPurchaseCrudView = () => {
      setShouldPurchaseOpenCrudView(true)
   }

   const onDisabledDidClicked = () => {
      console.log('will disable')
   }

   const onPayemntDidClicked = () => {
      setShouldOpenPaymentView(true)
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

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />

         <PaymentView
            isOpen={shouldOpenPaymentView}
            setIsOpen={setShouldOpenPaymentView}
         />

         <GridView
            className='purchase__view-order-list '
            items={items}
            setItems={setItems}
            gap={'1px'}
            selectionMode={'single'}  // none, single, multiple.
         />

         <div class="purchase_view__button-container">
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
               disabled={false}
            />
           
         </div>
      </div >
   )
}