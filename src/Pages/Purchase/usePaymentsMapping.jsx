
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';

export const usePaymentsMapping = () => {

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
            titleBackgroundColor: 'blue',
            titleForegroundColor: 'white',
            fields: [
               {
                  _id: transaction._id + 'b',
                  name: 'Date',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: dateAndTimeFormat(transaction.date),
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'd',
                  name: 'Username',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.user.lastName} ${transaction.user.firstName}`,
                  alignment: 'left',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'e',
                  name: 'Physical Account',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.physicalAccount.name}`,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'f',
                  name: 'Payment Method',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.paymentMethod.name}`,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'g',
                  name: 'Description',
                  minWidth: '15rem',
                  maxWidth: '1fr',
                  value: transaction.description,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'h',
                  name: 'Paid',
                  minWidth: '5rem',
                  maxWidth: '0.7fr',
                  value: getAmount(transaction),
                  alignment: 'end',
                  titleAlignment: 'center',
               }]
         }
      })

      return newItems
   }

   return { mapTransactions }
}