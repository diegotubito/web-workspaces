import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';

export const usePurchaseListViewModel = () => {
   const mapOrders = (orders) => {
      // Sort orders before mapping
      // Items not enabled are sent to the end, and then we sort by createdAt
      const sortedOrders = orders.sort((a, b) => {
         if (a.isEnabled && !b.isEnabled) {
            return -1;
         } else if (!a.isEnabled && b.isEnabled) {
            return 1;
         } else {
            // Assuming createdAt is a date string or a timestamp
            return new Date(a.createdAt) - new Date(b.createdAt);
         }
      });

      const newItems = sortedOrders.map((order) => {
         return {
            _id: order._id,
            isSelected: false,
            isEnabled: order.isEnabled,
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
