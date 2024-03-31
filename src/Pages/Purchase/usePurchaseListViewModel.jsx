import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';

export const usePurchaseListViewModel = () => {
   const shouldBeSelected = (order) => {
      if (order.status === 'cancelled' || order.status === 'rejected' || order.status === 'completed') {
         return false
      }
      return true
   }

   const mapOrders = (orders) => {
      const orderStatusPriority = {
         'ready_to_pay': 1,
         'pending_payment': 2,
         'pending_approval': 3,
         'completed': 4,
         'rejected': 5,
         'cancelled': 6
      };

      const sortedOrders = orders.sort((a, b) => {
         // Comparar por prioridad de estado
         const priorityA = orderStatusPriority[a.status];
         const priorityB = orderStatusPriority[b.status];

         if (priorityA !== priorityB) {
            return priorityA - priorityB;
         }

         // Si los elementos tienen el mismo estado, se ordenan por createdAt de forma descendente
         return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const newItems = sortedOrders.map((order) => {
         return {
            _id: order._id,
            isSelected: false,
            isSelectable: shouldBeSelected(order),
            fields: [
               {
                  _id: order._id + 'a',
                  name: 'Order ID',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order._id,
                  alignment: 'left'
               },
               {
                  _id: order._id + 'b',
                  name: 'Username',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order.user.username,
                  alignment: 'left'
               },
               {
                  _id: order._id + 'c',
                  name: 'Date',
                  minWidth: '10rem',
                  maxWidth: '1fr',
                  value: dateAndTimeFormat(order.date),
                  alignment: 'start'
               },
               {
                  _id: order._id + 'd',
                  name: 'Item Details',
                  minWidth: '10rem',
                  maxWidth: '1fr',
                  value: `${order.purchaseItem.title}, ${order.purchaseItem.description}`,
                  alignment: 'start'
               },
               {
                  _id: order._id + 'e',
                  name: 'Total Amount',
                  minWidth: '10rem',
                  maxWidth: '1fr',
                  value: formatCurrency(order.totalAmount.toFixed(2).toString()),
                  alignment: 'center'
               },
               {
                  _id: order._id + 'f',
                  name: 'Status',
                  minWidth: '15rem',
                  maxWidth: '1fr',
                  value: order.status,
                  alignment: 'center'
               }
            ]
         }
      });

      return newItems;
   }

   return { mapOrders };
}
