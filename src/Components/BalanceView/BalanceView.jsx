import { useEffect } from 'react'
import './BalanceView.css'
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../Utils/Common/formatCurrency';

export const BalanceView = ({account}) => {
   const {t} = useTranslation()

   useEffect(() => {
      console.log(account.balances)
   }, [account])

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
         <h1>{account.name}</h1>
        

         {account.balances.filter((b) => b.isEnabled).map((balance) => (
            <div key={balance.id}>
               <h2>{`${getBalanceTitle(balance)} (${getPendingAmount(balance)}) ${getAmount(balance)}`}</h2>
               {/* You can add more details about the balance here if needed */}
            </div>
         ))}
      </div>
   )
}