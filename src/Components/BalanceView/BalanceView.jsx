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
import { usePhysicalAccountViewModel } from '../../Hooks/PhysicalAccount/usePhysicalAccountViewModel';
import { Spinner } from '../Spinner/spinner';
import { Button, Alert } from 'react-bootstrap';
import { TransactionTypeEnum } from '../../Hooks/Transaction/transactionType';

export const BalanceView = ({ accountId }) => {
   const { t } = useTranslation();
   const {
      fetchCashCountByWorkspaceAndAccountLastClosed,
      lastClosedCashCount,
      closeCashCount,
      createCashCount,
      getCashCountsByWorkspaceAndAccount,
      cashCounts,
      onCashCountSuccess,
      isLoading: cashCountLoading,
      onError: onCashCountError,
      setOnError: setOnCashCountError
   } = useCashCountViewModel();

   const {
      fetchTransactionByWorkspaceAndAccountAndDates,
      fetchTransactionByWorkspaceAndAccount,
      payments,
      isLoading: transactionLoading
   } = useTransactionViewModel();
   const {
      getAccountById,
      account,
      isLoading: accountLoading,
      onError: onAccountError,
      setOnError: setOnAccountError
   } = usePhysicalAccountViewModel()

   useEffect(() => {
      if (accountId) {
         getAccountById(accountId)
      }
   }, [accountId])

   useEffect(() => {
      if (account) {
         getCashCountsByWorkspaceAndAccount(account);
         fetchCashCountByWorkspaceAndAccountLastClosed(account)
      }
   }, [account]);

   useEffect(() => {
      let toDate = new Date().toISOString();
      if (lastClosedCashCount) {
         let fromDate;
       

         if (lastClosedCashCount.closingDate) {
            fromDate = new Date(lastClosedCashCount.closingDate).toISOString();
         } else if (lastClosedCashCount.date) {
            fromDate = new Date(lastClosedCashCount.date).toISOString();
         }
         fetchTransactionByWorkspaceAndAccountAndDates(account, fromDate, toDate);

      } else {
         let fromDate = new Date('01/01/2004').toISOString();
         fetchTransactionByWorkspaceAndAccountAndDates(account, fromDate, toDate);
      }
   }, [lastClosedCashCount]);

   useEffect(() => {
      if (onCashCountSuccess) {
         getAccountById(accountId)
      }
   }, [onCashCountSuccess])


   const getBalanceTitle = (balance) => t(balance.displayName);

   const getCurrentAmount = (balance) => formatCurrency(balance.amount.toFixed(2).toString());

   const getCurrentPendingAmount = (balance) => formatCurrency(balance.pendingAmount.toFixed(2).toString());

   const getSnapshotAmount = (balance) => {
      let amount = 0;
      if (lastClosedCashCount) {
         const innerBalances = lastClosedCashCount.balances;
         const innerBalance = innerBalances.find((b) => b.balance._id === balance._id);
         if (innerBalance) {
            amount = innerBalance.countedAmount;
         }
      }
      return formatCurrency(amount.toFixed(2).toString());
   };

   const getSnapshotPendingAmount = (balance) => {
      let amount = 0;
      if (lastClosedCashCount) {
         const innerBalances = lastClosedCashCount.balances;
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
         case TransactionTypeEnum.PURCHASE:
         case TransactionTypeEnum.CREDIT_NOTE:
         case TransactionTypeEnum.TRANSFER_ORIGIN:
         case TransactionTypeEnum.ADJUSTMENT_SHORTAGE:
            accountType = 'debe';
            break;
         case TransactionTypeEnum.SALE:
         case TransactionTypeEnum.DEBIT_NOTE:
         case TransactionTypeEnum.TRANSFER_DESTINY:
         case TransactionTypeEnum.ADJUSTMENT_SURPLUS:
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
         case TransactionTypeEnum.PURCHASE:
         case TransactionTypeEnum.CREDIT_NOTE:
         case TransactionTypeEnum.TRANSFER_ORIGIN:
         case TransactionTypeEnum.ADJUSTMENT_SHORTAGE:
            accountType = 'debe';
            break;
         case TransactionTypeEnum.DEBIT_NOTE:
         case TransactionTypeEnum.SALE:
         case TransactionTypeEnum.TRANSFER_DESTINY:
         case TransactionTypeEnum.ADJUSTMENT_SURPLUS:
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

   if (!account) {
      return
   }

   if (onAccountError) {
      return (
         <div className="alert-container">
            <Alert variant="warning">
               <Alert.Heading>{onAccountError.title}</Alert.Heading>
               <h3>
                  {onAccountError.message}
               </h3>
               <hr />
               <div className="d-flex justify-content-end">
                  <Button onClick={() => setOnAccountError(null)} variant="outline-success">
                     Close me
                  </Button>
               </div>
            </Alert>
         </div>
      )
   }

   if (onCashCountError) {
      return (
         <div className="alert-container">
            <Alert variant="warning">
               <Alert.Heading>{onCashCountError.title}</Alert.Heading>
               <h3>
                  {onCashCountError.message}
               </h3>
               <hr />
               <div className="d-flex justify-content-end">
                  <Button onClick={() => setOnCashCountError(null)} variant="outline-success">
                     Close me
                  </Button>
               </div>
            </Alert>
         </div>
      )
   }

   return (
      <div className='balance_view__container'>

         {(accountLoading || transactionLoading || cashCountLoading) && (
            <Spinner />
         )}

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
