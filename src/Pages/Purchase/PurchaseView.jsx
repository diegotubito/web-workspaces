import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';
import { PurchaseListView } from './List/PurchaseListView';
import './PurchaseView.css'
import { usePurchaseListViewModel } from './usePurchaseListViewModel'


export const PurchaseView = () => {
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)

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

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <div>
            <Button size='lr' onClick={() => openPurchaseCrudView()}>Create New Order</Button>
         </div>

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />

         <PurchaseListView
            className='purchase__view-order-list '
            items={items}
            setItems={setItems}
            gap={'1px'}
            selectionMode={'single'}  // none, single, multiple.
         />

         <div>
            <Button size='lr' onClick={() => openPurchaseCrudView()}>Disable</Button>
            <Button size='lr' onClick={() => openPurchaseCrudView()}>Pay</Button>
         </div>
      </div >
   )
}