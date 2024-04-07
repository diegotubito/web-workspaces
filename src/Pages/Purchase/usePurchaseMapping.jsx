import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';

export const usePurchaseMapping = () => {
   const shouldBeSelected = (order) => {
      if (order.status === 'cancelled' || order.status === 'rejected' || order.status === 'completed') {
         return false
      }
      return true
   }

   const mapOrders = (orders, selectedOrder) => {
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

      const getAmount = (amount, currency) => {
         const amountText = formatCurrency(amount.toFixed(2).toString())
         const currencyText = currency.code
         return `(${currencyText}) ${amountText}`
      }

      const getInstallmentNumber = (order) => {
         return order.installments.length;
      }

      const newItems = sortedOrders.map((order) => {
         return {
            _id: order._id,
            isSelected: order._id === selectedOrder ? true : false,
            isSelectable: shouldBeSelected(order),
            titleTextAlign: 'center',
            titleBackgroundColor: 'var(--gray)',
            titleForegroundColor: 'white',
            fields: [
               {
                  _id: order._id + 'a',
                  name: 'Date',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: dateAndTimeFormat(order.date),
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'b',
                  name: 'Username',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${order.user.lastName} ${order.user.firstName}`,
                  alignment: 'left',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'c',
                  name: 'Item Details',
                  minWidth: '10rem',
                  maxWidth: '1fr',
                  value: `${order.stakeholder.title}, ${order.stakeholder.description}`,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'd',
                  name: 'Payment Method',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order.paymentMethod.name,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'e',
                  name: 'Installments',
                  minWidth: '5rem',
                  maxWidth: '0.2fr',
                  value: getInstallmentNumber(order),
                  alignment: 'center',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'f',
                  name: 'Total Amount',
                  minWidth: '5rem',
                  maxWidth: '0.7fr',
                  value: getAmount(order.totalAmount, order.currency),
                  alignment: 'end',
                  titleAlignment: 'center',
               }, 
               {
                  _id: order._id + 'g',
                  name: 'Paid Amount',
                  minWidth: '5rem',
                  maxWidth: '0.7fr',
                  value: getAmount(order.paidAmount, order.currency),
                  alignment: 'end',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'h',
                  name: 'Remaining Amount',
                  minWidth: '5rem',
                  maxWidth: '0.7fr',
                  value: getAmount(order.remainingAmount, order.currency),
                  alignment: 'end',
                  titleAlignment: 'center',
               },
               {
                  _id: order._id + 'i',
                  name: 'Status',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: order.status,
                  alignment: 'center',
                  titleAlignment: 'center',
               }

            ]
         }
      });

      return newItems;
   }

   return { mapOrders };
}
