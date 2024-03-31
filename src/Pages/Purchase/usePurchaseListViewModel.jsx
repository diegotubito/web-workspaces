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
         'partial_payment': 2,
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

      const getAmount = (order) => {
         const amountText = formatCurrency(order.totalAmount.toFixed(2).toString())
         const currency = order.currency.code
         return `(${currency}) ${amountText}`
      }

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
                  _id: order._id + 'c',
                  name: 'Date',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: dateAndTimeFormat(order.date),
                  alignment: 'start'
               },
               {
                  _id: order._id + 'd',
                  name: 'Date',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: dateAndTimeFormat(order.updatedAt),
                  alignment: 'start'
               },
               {
                  _id: order._id + 'e',
                  name: 'Username',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${order.user.lastName} ${order.user.firstName}`,
                  alignment: 'left'
               },
               {
                  _id: order._id + 'f',
                  name: 'Item Details',
                  minWidth: '10rem',
                  maxWidth: '1fr',
                  value: `${order.purchaseItem.title}, ${order.purchaseItem.description}`,
                  alignment: 'start'
               },
               {
                  _id: order._id + 'g',
                  name: 'Total Amount',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order.paymentMethod.name,
                  alignment: 'start'
               },
               {
                  _id: order._id + 'h',
                  name: 'Status',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order.status,
                  alignment: 'center'
               },
               {
                  _id: order._id + 'i',
                  name: 'Total Amount',
                  minWidth: '5rem',
                  maxWidth: '0.7fr',
                  value: getAmount(order),
                  alignment: 'end'
               }

            ]
         }
      });

      return newItems;
   }

   return { mapOrders };
}
