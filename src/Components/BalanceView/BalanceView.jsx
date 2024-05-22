import { useEffect } from 'react'
import './BalanceView.css'
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { useCashCountViewModel } from '../../Hooks/CashCount/useCashCountViewModel';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';
import { SimpleButton } from '../Buttons/SimpleButton/SimpleButton';

export const BalanceView = ({ account }) => {
   const { t } = useTranslation()

   const { getCashCountsByWorkspaceAndAccount, cashCounts } = useCashCountViewModel()

   const { fetchTransactionByWorkspaceAndAccount, payments } = useTransactionViewModel()

   useEffect(() => {
      getCashCountsByWorkspaceAndAccount(account)
      fetchTransactionByWorkspaceAndAccount(account)
   }, [])

   const getBalanceTitle = (balance) => {
      const result = t(balance.displayName)
      return `${result}`
   }

   const getCurrentAmount = (balance) => {
      const result = formatCurrency(balance.amount.toFixed(2).toString())
      return `${result}`
   }

   const getCurrentPendingAmount = (balance) => {
      const result = formatCurrency(balance.pendingAmount.toFixed(2).toString())
      return `${result}`
   }

   const getSnapshotAmount = (balance) => {
      let amount;
      // need to get latest cash count register. If they comes in order, it is the first element of the list.
      const lastCashAccount = cashCounts[0]
      if (!lastCashAccount) {
         amount = 0
      } else {
         const innerBalances = lastCashAccount.balances
         const innerBalance = innerBalances.find((b) => b.balance._id === balance._id)
         const snapshotBalance = innerBalance.balanceSnapshot
         amount = snapshotBalance.amount
      }

      const result = formatCurrency(amount.toFixed(2).toString())
      return `${result}`
   }

   const getSnapshotPendingAmount = (balance) => {
      let amount;
      // need to get latest cash count register. If they comes in order, it is the first element of the list.
      const lastCashAccount = cashCounts[0]
      if (!lastCashAccount) {
         amount = 0
      } else {
         const innerBalances = lastCashAccount.balances
         const innerBalance = innerBalances.find((b) => b.balance._id === balance._id)
         const snapshotBalance = innerBalance.balanceSnapshot
         amount = snapshotBalance.pendingAmount
      }

      const result = formatCurrency(amount.toFixed(2).toString())
      return `${result}`
   }

   const getDebe = (payment) => {
      let accountType;
      let amount = formatCurrency(payment.amount.toFixed(2).toString())
      switch (payment.type) {
         case 'purchase':
         case 'transfer_origin':
            accountType = 'debe';
            break;
         case 'sale':
         case 'transfer_destiny':
            accountType = 'haber';
            break;
         default:
            return 'undetermined';
      }

      if (accountType === 'debe') {
         return `${amount}`
      }
      return ''
   }

   const getHaber = (payment) => {
      let accountType;
      let amount = formatCurrency(payment.amount.toFixed(2).toString())
      switch (payment.type) {
         case 'purchase':
         case 'transfer_origin':
            accountType = 'debe';
            break;
         case 'sale':
         case 'transfer_destiny':
            accountType = 'haber';
            break;
         default:
            return 'undetermined';
      }

      if (accountType === 'haber') {
         return `${amount}`
      }

      return ''
   }


   return (
      <div className='balance_view__container'>
         <h1>{`${account.name}`}</h1>

         <div className='balance_view__main'>
            <div className='balance_view__section'>
               <h2>{t('Balances')}</h2>

               {account.balances.filter((b) => b.isEnabled).map((balance) => (
                  <div key={balance._id} className='balance_view__balance-item'>
                     <h3>{`${getBalanceTitle(balance)}`}</h3>

                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <h4>{`Initial`}</h4>
                        <h4>{`(${getSnapshotPendingAmount(balance)}) ${getSnapshotAmount(balance)}`}</h4>
                     </div>

                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <h4>{`Current`}</h4>
                        <h4>{`(${getCurrentPendingAmount(balance)}) ${getCurrentAmount(balance)}`}</h4>
                     </div>

                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <h4>{`Transactions`}</h4>
                        <h4>{`${balance.counter}`}</h4>
                     </div>
                     
                    
                     
                     
                  </div>
               ))}
               <h4>{t('Total Transactions')}: {account.counter}</h4>
               <div className='balance_view__footer-buttons'>
                  <SimpleButton
                     title={t('Cash Count')}
                     style='primary'
                     onClick={() => {/* Add click handler */ }}
                  />

               </div>
            </div>

            <div className='balance_view__section'>
               <h2>{t('Cash Counts History')}</h2>
               {cashCounts.map((cashCount) => (
                  <div key={cashCount._id} className='balance_view__cash-count-item'>

                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                     }}>
                        <h3>{`${dateAndTimeFormat(cashCount.date)}`}</h3>
                        <h3>{`${cashCount.status}`}</h3>
                     </div>

                     {cashCount.balances.map((balanceCounted) => (

                        <div key={balanceCounted._id} className='balance_view__cash-count-item-already-counted'>
                           <h4>{`${balanceCounted.balance.displayName}`}</h4>
                           <h4>{`${formatCurrency(balanceCounted.countedAmount.toFixed(2).toString())}`}</h4>
                           <h4>{`${formatCurrency(balanceCounted.discrepancies.toFixed(2).toString()) }`}</h4>
                        </div>
                     ))}


                     <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                     }}>
                        <h4>{`Result ${formatCurrency(cashCount.totalDiscrepancies.toFixed(2).toString())}`}</h4>

                     </div>

                     <h5>{`Responsible ${cashCount.user.lastName} ${cashCount.user.firstName}`}</h5>

                     <SimpleButton
                        title={t('Consolidate')}
                        style='primary'
                        onClick={() => {/* Add click handler */ }}
                     />
                  </div>
               ))}
            </div>

            <div className='balance_view__section'>
               <h2>{t('Transactions')}</h2>
               {payments.filter((b) => b.isEnabled).map((payment) => (
                  <div key={payment._id} className='balance_view__transaction-item'>
                     <h4>{`${dateAndTimeFormat(payment.date)}`}</h4>
                     <h4>{`${payment.user.lastName} ${payment.user.firstName}`}</h4>
                     <h4>{`${payment.type}`}</h4>
                     <h4>{`${payment.balance.displayName}`}</h4>
                     <h4 style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'end',
                     }}>{`${getDebe(payment)}`}</h4>
                     <h4 style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'end',
                     }}>{`${getHaber(payment)}`}</h4>
                  </div>
               ))}
            </div>


         </div>


      </div>
   )
}
