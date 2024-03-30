import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';
import { useEffect, useState } from 'react';

export const usePurchaseListViewModel = () => {
   const { getPurchaseOrders, orders } = usePurchaseViewModel()
   const [items, setItems] = useState([])

   useEffect(() => {
      mapItems()
   }, [orders])

   const getOrder = (_id) => {
      const order = orders.filter((obj) => obj._id === _id)
      return order[0]
   }

   const mapItems = () => {
      const newItems = orders.map((order) => {
         return {
            _id: order._id,
            isSelected: false,
            fields: [{
               _id: order._id + 'a',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: order._id,
               alignment: 'left'
            }, {
               _id: order._id + 'b',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: order.user.username,
               alignment: 'left'
            },
            {
               _id: order._id + 'c',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: dateAndTimeFormat(order.date),
               alignment: 'start'
            },
            {
               _id: order._id + 'd',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: `${order.purchaseItem.title}, ${order.purchaseItem.description}`,
               alignment: 'start'
            }
               ,
            {
               _id: order._id + 'e',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: formatCurrency(order.totalAmount.toFixed(2).toString()),
               alignment: 'center'
            },
            {
               _id: order._id + 'f',
               name: '_id',
               minWidth: '15rem',
               maxWidth: '1fr',
               value: order.status,
               alignment: 'center'
            }]
         }
      })

      setItems(newItems)
   }

   return { getPurchaseOrders, items, setItems, getOrder }
}