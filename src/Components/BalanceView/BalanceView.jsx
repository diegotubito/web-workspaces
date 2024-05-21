import { useEffect } from 'react'
import './BalanceView.css'
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { useCashCountViewModel } from '../../Hooks/CashCount/useCashCountViewModel';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';

export const BalanceView = ({account}) => {
   const {t} = useTranslation()
   
   const { getCashCountsByWorkspaceAndAccount, cashCounts } = useCashCountViewModel()

   const { fetchTransactionByWorkspaceAndAccount, payments } = useTransactionViewModel()

   useEffect(() => {
      getCashCountsByWorkspaceAndAccount(account)
      fetchTransactionByWorkspaceAndAccount(account)
   }, [])

   useEffect(() => {
      console.log(cashCounts)
   }, [cashCounts])

   useEffect(() => {
      
   }, [payments])


   const getBalanceTitle = (balance) => {
      const result = t(balance.displayName)
      return `${result}`
   }

   const getAmount = (balance) => {
      const result = formatCurrency(balance.amount.toFixed(2).toString())
      return `${result}`
   }

   const getPendingAmount = (balance) => {
      const result = formatCurrency(balance.pendingAmount.toFixed(2).toString())
      return `${result}`
   }

   return (
      <div>
         <h1>{`${account.name} Transactions: ${account.counter}`}</h1>
        
         <div>
            <h2>{`Balances`}</h2>

            {account.balances.filter((b) => b.isEnabled).map((balance) => (
               <div key={balance._id}>
                  <h2>{`${getBalanceTitle(balance)} (${getPendingAmount(balance)}) ${getAmount(balance)} transactions: ${balance.counter}`}</h2>
                  {/* You can add more details about the balance here if needed */}
               </div>
            ))}
         </div>

         <div>
            <h2>{`Transactions`}</h2>

            {payments.filter((b) => b.isEnabled).map((payment) => (
               <div key={payment._id}>
                  <h2>{`${dateAndTimeFormat(payment.date)} ${payment.user.lastName} ${payment.user.firstName} ${payment.type}  ${payment.balance.displayName} ${formatCurrency(payment.amount.toFixed(2).toString())}`}</h2>
                  {/* You can add more details about the balance here if needed */}
               </div>
            ))}

         </div>

         <div>
            <h2>{`Cash Counts History`}</h2>

            {cashCounts.map((cashCount) => (
               <div key={cashCount._id}>
                  <h2>{`${dateAndTimeFormat(cashCount.date)} ${cashCount.user.lastName} ${cashCount.user.firstName} ${formatCurrency(cashCount.totalDiscrepancies.toFixed(2).toString())}  ${cashCount.status}`}</h2>
                  {/* You can add more details about the balance here if needed */}
               </div>
            ))}

         </div>

      </div>
   )
}