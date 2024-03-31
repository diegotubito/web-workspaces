
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';

export const usePaymentsListViewModel = () => {
   
   const mapTransactions = (transactions) => {
      const sortedTransactions = transactions.sort((a, b) => {
         return new Date(b.createdAt) - new Date(a.createdAt)
      }) 

      const getAmount = (transaction) => {
         const amountText = formatCurrency(transaction.amount.toFixed(2).toString())
         const currency = transaction.currency.code
         return `(${currency}) ${amountText}`
      }

      const newItems = sortedTransactions.map((transaction) => {
         return {
            _id: transaction._id,
            isSelected: false,
            isSelectable: transaction.isEnabled,
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
               value: `${transaction.user.lastName} ${transaction.user.firstName}` ,
               alignment: 'left'
            },
            {
               _id: transaction._id + 'c',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: dateAndTimeFormat(transaction.date),
               alignment: 'start'
               },
               {
                  _id: transaction._id + 'e',
                  name: '_id',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.physicalAccount.name}`,
                  alignment: 'start'
               },
               {
                  _id: transaction._id + 'd',
                  name: '_id',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.paymentMethod.name}`,
                  alignment: 'start'
               }, 
              
            {
               _id: transaction._id + 'f',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: getAmount(transaction),
               alignment: 'end'
            },
            {
               _id: transaction._id + 'g',
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