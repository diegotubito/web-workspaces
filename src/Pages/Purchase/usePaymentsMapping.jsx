
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';

export const usePaymentsMapping = () => {

   const mapTransactions = (transactions) => {
      const sortedTransactions = transactions.sort((a, b) => {
         return new Date(b.createdAt) - new Date(a.createdAt)
      })

      const getAmount = (transaction) => {
         const amountText = formatCurrency(transaction.amount.toFixed(2).toString())
         const currency = transaction.balance.currency.code
         return `(${currency}) ${amountText}`
      }

      const newItems = sortedTransactions.map((transaction) => {
         return {
            _id: transaction._id,
            isSelected: false,
            isSelectable: transaction.isEnabled,
            titleBackgroundColor: 'var(--gray)',
            titleForegroundColor: 'white',
            fields: [
               {
                  _id: transaction._id + 'a',
                  name: 'Date',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: dateAndTimeFormat(transaction.date),
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'b',
                  name: 'Username',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.user.lastName} ${transaction.user.firstName}`,
                  alignment: 'left',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'c',
                  name: 'Account',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.account.name}`,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'c1',
                  name: 'Balance',
                  minWidth: '5rem',
                  maxWidth: '0.5fr',
                  value: `${transaction.balance.displayName}`,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'e',
                  name: 'Description',
                  minWidth: '15rem',
                  maxWidth: '1fr',
                  value: transaction.description,
                  alignment: 'start',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'f',
                  name: 'Exchange',
                  minWidth: '5rem',
                  maxWidth: '0.3fr',
                  value: transaction.exchangeRate,
                  alignment: 'center',
                  titleAlignment: 'center',
               },
               {
                  _id: transaction._id + 'g',
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