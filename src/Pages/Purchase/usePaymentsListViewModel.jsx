
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';

export const usePaymentsListViewModel = () => {
   
   const mapTransactions = (transactions) => {
      const newItems = transactions.map((transaction) => {
         return {
            _id: transaction._id,
            isSelected: false,
            isEnabled: transaction.isEnabled,
            fields: [{
               _id: transaction._id + 'a',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: transaction._id,
               alignment: 'left'
            }, {
               _id: transaction._id + 'b',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: transaction.user,
               alignment: 'left'
            },
            {
               _id: transaction._id + 'c',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: dateAndTimeFormat(transaction.date),
               alignment: 'start'
            },
            {
               _id: transaction._id + 'd',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: `${transaction.paymentMethod}`,
               alignment: 'start'
            }
               ,
            {
               _id: transaction._id + 'e',
               name: '_id',
               minWidth: '10rem',
               maxWidth: '1fr',
               value: formatCurrency(transaction.amount.toFixed(2).toString()),
               alignment: 'center'
            },
            {
               _id: transaction._id + 'f',
               name: '_id',
               minWidth: '15rem',
               maxWidth: '1fr',
               value: transaction.isEnabled,
               alignment: 'center'
            }]
         }
      })

      return newItems
   }

   return { mapTransactions }
}