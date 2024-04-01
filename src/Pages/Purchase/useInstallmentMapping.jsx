import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat, dateFormat } from '../../Utils/Common/dateUtils';

export const useInstallmentMapping = () => {

   const mapInstallments = (installments) => {
      const sortedInstallments = installments.sort((a, b) => {
         return new Date(a.number) - new Date(b.number)
      })

      const getAmount = (amount, currency) => {
         const amountText = formatCurrency(amount.toFixed(2).toString())
         const currencyCode = currency.code
         return `(${currencyCode}) ${amountText}`
      }

      const newItems = sortedInstallments.map((installment) => {
         return {
            _id: installment._id,
            isSelected: false,
            isSelectable: true,
            fields: [{
               _id: installment._id + 'a',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.2fr',
               value: installment.number,
               alignment: 'center'
            },
            {
               _id: installment._id + 'b',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.3fr',
               value: dateFormat(installment.dueDate),
               alignment: 'start'
            },
            {
               _id: installment._id + 'c',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.3fr',
               value: installment.status,
               alignment: 'start'
            },
            {
               _id: installment._id + 'd',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.3fr',
               value: installment.status,
               alignment: 'start'
            },
            {
               _id: installment._id + 'e',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.7fr',
               value: getAmount(installment.amount, installment.currency),
               alignment: 'end'
            },
            {
               _id: installment._id + 'f',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.7fr',
               value: getAmount(installment.remainingAmount, installment.currency),
               alignment: 'end'
            },
            {
               _id: installment._id + 'g',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.7fr',
               value: getAmount(installment.paidAmount, installment.currency),
               alignment: 'end'
            }]
         }
      })

      return newItems
   }

   return { mapInstallments }
}