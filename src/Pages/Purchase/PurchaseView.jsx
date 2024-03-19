import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';
import { PurchaseListView } from './List/PurchaseListView';
import './PurchaseView.css'
import { formatCurrency } from '../../Utils/Common/formatCurrency';

export const PurchaseView = () => {
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)
   const { getPurchaseOrders, orders } = usePurchaseViewModel()
   const [items, setItems] = useState([])

   useEffect(() => {
      mapItems()
   }, [orders])

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      console.log(items)
   }, [items])

   const openPurchaseCrudView = () => {
      setShouldPurchaseOpenCrudView(true)
   }

   const mapItems = () => {
      const newItems = orders.map((order) => {
         return {
            _id: order._id,
            isSelected: false,
            fields: [{
               _id: order._id + 'a',
               name: '_id',
               minWidth: '20rem',
               maxWidth: '1fr',
               value: order._id,
               alignment: 'left'
            },
            {
               _id: order._id + 'b',
               name: '_id',
               minWidth: '20rem',
               maxWidth: '1fr',
               value: dateAndTimeFormat(order.date),
               alignment: 'center'
            },
            {
               _id: order._id + 'c',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: formatCurrency(order.totalAmount.toString()),
               alignment: 'center'
            },
            {
               _id: order._id + 'd',
               name: '_id',
               minWidth: '20rem',
               maxWidth: '1fr',
               value: order.status,
               alignment: 'center'
            }]
         }
      })

      setItems(newItems)
   }

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <Button size='lr' onClick={() => openPurchaseCrudView()}>Open Pop Up</Button>

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />

         <PurchaseListView
            className='purchase__view-order-list '
            items={items}
            setItems={setItems}
            gap={'1px'}
         />



      </div >
   )
}