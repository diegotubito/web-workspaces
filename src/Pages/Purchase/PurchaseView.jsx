import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';

export const PurchaseView = () => {
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)
   const { getPurchaseOrders, orders } = usePurchaseViewModel()

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   const openPurchaseCrudView = () => {
      setShouldPurchaseOpenCrudView(true)
   }

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <Button size='lr' onClick={() => openPurchaseCrudView()}>Open Pop Up</Button>

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />

         <ul>
            { orders.map((order) => {
               return (
                  <li key={order._id}>
                     <div className="register-content">
                        <div className="register-title">{order._id}</div>
                        {dateAndTimeFormat(order.date)}

                        {order.purchaseItem.title}
                        {order.items.map((item) => item.description).join(' ')}
                        {order.items.map((item) => item.saleItem.title).join(' ')}
                        {order.user.username}
                        {order.status}
                        {order.totalAmount}
                     </div>
                  </li>
               )
            })}

         </ul>
      </div >
   )
}