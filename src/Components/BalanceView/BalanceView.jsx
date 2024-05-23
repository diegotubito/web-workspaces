import { useEffect, useState } from 'react';
import './BalanceView.css';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { useCashCountViewModel } from '../../Hooks/CashCount/useCashCountViewModel';
import { useTransactionViewModel } from '../../Hooks/Transaction/useTransactionViewModel';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';
import { SimpleButton } from '../Buttons/SimpleButton/SimpleButton';
import { NewCashCountComponent } from './NewCashCount/NewCashCountComponent';
import { CashCountComponent } from './CashCountComponent/CashCountComponent';

export const BalanceView = ({ account }) => {
   const { t } = useTranslation();
   const { closeCashCount, createCashCount, getCashCountsByWorkspaceAndAccount, cashCounts, onCashCountSuccess } = useCashCountViewModel();
   const { fetchTransactionByWorkspaceAndAccountAndDates, fetchTransactionByWorkspaceAndAccount, payments } = useTransactionViewModel();
   const [lastCashCount, setLastCashCount] = useState({});

   useEffect(() => {
      getCashCountsByWorkspaceAndAccount(account);
   }, []);

   useEffect(() => {
      if (cashCounts.length > 0) {
         setLastCashCount(cashCounts[0]);
      } else {
         setLastCashCount({});
      }
   }, [cashCounts]);

   useEffect(() => {
      let fromDate;
      let toDate = new Date().toISOString();

      if (lastCashCount && lastCashCount.closingDate) {
         fromDate = new Date(lastCashCount.closingDate).toISOString();
      } else {
         fromDate = new Date('2024-01-01T00:00:00Z').toISOString();
      }
      fetchTransactionByWorkspaceAndAccountAndDates(account, fromDate, toDate);
   }, [lastCashCount]);

   useEffect(() => {
      if (onCashCountSuccess) {
         getCashCountsByWorkspaceAndAccount(account);
      }
   }, [onCashCountSuccess])


   const getBalanceTitle = (balance) => t(balance.displayName);

   const getCurrentAmount = (balance) => formatCurrency(balance.amount.toFixed(2).toString());

   const getCurrentPendingAmount = (balance) => formatCurrency(balance.pendingAmount.toFixed(2).toString());

   const getSnapshotAmount = (balance) => {
      let amount = 0;
      const lastCashAccount = cashCounts[0];
      if (lastCashAccount) {
         const innerBalances = lastCashAccount.balances;
         const innerBalance = innerBalances.find((b) => b.balance._id === balance._id);
         if (innerBalance) {
            amount = innerBalance.countedAmount;
         }
      }
      return formatCurrency(amount.toFixed(2).toString());
   };

   const getSnapshotPendingAmount = (balance) => {
      let amount = 0;
      const lastCashAccount = cashCounts[0];
      if (lastCashAccount) {
         const innerBalances = lastCashAccount.balances;
         const innerBalance = innerBalances.find((b) => b.balance._id === balance._id);
         if (innerBalance) {
            amount = innerBalance.balanceSnapshot.pendingAmount;
         }
      }
      return formatCurrency(amount.toFixed(2).toString());
   };

   const getDebe = (payment) => {
      let accountType;
      let amount = formatCurrency(payment.amount.toFixed(2).toString());
      switch (payment.type) {
         case 'purchase':
         case 'transfer_origin':
         case 'adjustment_shortage':
            accountType = 'debe';
            break;
         case 'sale':
         case 'transfer_destiny':
         case 'adjustment_surplus':
            accountType = 'haber';
            break;
         default:
            return 'undetermined';
      }

      if (accountType === 'debe') {
         return `${amount}`;
      }
      return '';
   };

   const getHaber = (payment) => {
      let accountType;
      let amount = formatCurrency(payment.amount.toFixed(2).toString());
      switch (payment.type) {
         case 'purchase':
         case 'transfer_origin':
         case 'adjustment_shortage':
            accountType = 'debe';
            break;
         case 'sale':
         case 'transfer_destiny':
         case 'adjustment_surplus':
            accountType = 'haber';
            break;
         default:
            return 'undetermined';
      }

      if (accountType === 'haber') {
         return `${amount}`;
      }
      return '';
   };

   const onCountedAmountsHandler = (counts) => {
      createCashCount(account, counts);
   };

   const onCloseCashCount = (cashCount) => {
      closeCashCount(cashCount);
   };

   return (
      <div className='balance_view__container'>
         <h1>{account.name}</h1>

         <div className='balance_view__main'>
            <div className='balance_view__section'>
               <h2>{t('Balances')}</h2>

               {account.balances.filter((b) => b.isEnabled).map((balance) => (
                  <div key={balance._id} className='balance_view__balance-item'>
                     <h3>{getBalanceTitle(balance)}</h3>

                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Initial</h4>
                        <h4>({getSnapshotPendingAmount(balance)}) {getSnapshotAmount(balance)}</h4>
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Current</h4>
                        <h4>({getCurrentPendingAmount(balance)}) {getCurrentAmount(balance)}</h4>
                     </div>

                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Transactions</h4>
                        <h4>{balance.counter}</h4>
                     </div>
                  </div>
               ))}
               <h4>{t('Total Transactions')}: {account.counter}</h4>
            </div>

            <div className='balance_view__section'>
               <h2>{t('Cash Counts')}</h2>

               <NewCashCountComponent
                  title={'New Cash Count'}
                  account={account}
                  onCountedAmountsHandler={onCountedAmountsHandler}
               />

               {cashCounts.map((cashCount, index) => (
                  <CashCountComponent
                     key={cashCount._id}
                     title={index === 0 ? 'Last Cash Count' : 'History'}
                     cashCount={cashCount}
                     onCloseCashCount={onCloseCashCount}
                  />
               ))}
            </div>

            <div className='balance_view__section'>
               <h2>{t('Transactions')}</h2>
               {payments.filter((b) => b.isEnabled).map((payment) => (
                  <div key={payment._id} className='balance_view__transaction-item'>
                     <h4>{dateAndTimeFormat(payment.date)}</h4>
                     <h4>{payment.user.lastName} {payment.user.firstName}</h4>
                     <h4>{t(payment.type)}</h4>
                     <h4>{payment.balance.displayName}</h4>
                     <h4 style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        {getDebe(payment)}
                     </h4>
                     <h4 style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        {getHaber(payment)}
                     </h4>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};
