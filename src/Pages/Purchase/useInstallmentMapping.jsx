import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { dateAndTimeFormat, stringMonthFormat } from '../../Utils/Common/dateUtils';

export const useInstallmentMapping = () => {

   const mapInstallments = (installments) => {
      const sortedInstallments = installments.sort((a, b) => {
         return new Date(b.createdAt) - new Date(a.createdAt)
      })

      const getAmount = (installment) => {
         const amountText = formatCurrency(installment.amount.toFixed(2).toString())
         const currency = installment.currency.code
         return `(${currency}) ${amountText}`
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
               maxWidth: '0.5fr',
               value: installment._id,
               alignment: 'left'
            },
            {
               _id: installment._id + 'b',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.5fr',
               value: dateAndTimeFormat(installment.createdAt),
               alignment: 'start'
            },
            {
               _id: installment._id + 'g',
               name: '_id',
               minWidth: '15rem',
               maxWidth: '1fr',
               value: installment.notes,
               alignment: 'start'
            },
            {
               _id: installment._id + 'h',
               name: '_id',
               minWidth: '5rem',
               maxWidth: '0.7fr',
               value: getAmount(installment),
               alignment: 'end'
            }]
         }
      })

      return newItems
   }

   return { mapInstallments }
}