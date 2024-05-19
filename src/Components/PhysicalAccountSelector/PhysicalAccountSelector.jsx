import './PhysicalAccountSelector.css'
import { useEffect, useState } from "react";
import { usePhysicalAccountViewModel } from "../../Hooks/PhysicalAccount/usePhysicalAccountViewModel"
import { useTranslation } from 'react-i18next';
import { formatCurrency } from "../../Utils/Common/formatCurrency";

export const PhysicalAccountSelector = ({
   destiny,
   title,
   balanceTitle,
   selectedPhysicalAccount,
   setSelectedPhysicalAccount,
   balances,
   setBalances,
   selectedBalance,
   setSelectedBalance
}) => {
   const { t } = useTranslation()
   const { fetchAllAccountsByAssignee, fetchAllAccountsByAssigneeTransfer, accounts } = usePhysicalAccountViewModel()

   useEffect(() => {
      if (destiny === 'assignees') {
         fetchAllAccountsByAssignee()
      } else if (destiny === 'assigneesTransfer') {
         fetchAllAccountsByAssigneeTransfer()
      }
   }, [])

   useEffect(() => {
      // default payment method
      if (accounts.length > 0) {
         setSelectedPhysicalAccount(accounts[0]._id)
      }
   }, [accounts])

   useEffect(() => {
      setSelectedBalance("")
      mapbalances()
   }, [selectedPhysicalAccount])

   const handleOnPhysicalAccountChange = (event) => {
      const item = event.target.value;
      setSelectedPhysicalAccount(item);
   };

   const handleOnBalanceChange = (event) => {
      const itemId = event.target.value;
      setSelectedBalance(itemId);
   };

   const mapbalances = () => {
      if (!selectedPhysicalAccount) {
         setBalances([])
         return
      }
      // Find the account with the given accountId
      const account = accounts.find(account => account._id === selectedPhysicalAccount);

      // If the account is found, map its balances to extract currency details
      if (!account) {
         setBalances([])
         return
      }

      const items = account.balances
         .filter(balance => balance.isEnabled) // Filter out balances where isEnabled is false
         
      setBalances(items)
   }

   const getAmount = (item) => {
      return formatCurrency(item.amount.toFixed(2).toString())
   }

   const getPendingAmount = (item) => {
      return formatCurrency(item.pendingAmount.toFixed(2).toString())
   }

   return (
      <div>
         <h3 className='physical_account_selector__form-title'>{title}</h3>
         <select className="physical_account_selector__form-select" value={selectedPhysicalAccount} onChange={handleOnPhysicalAccountChange}>
            {accounts.map((item) => {
               return (
                  <option key={item._id} value={item._id}>{item.name}</option>
               )
            }
            )}
         </select>

         <div>
            <h3 className='physical_account_selector__form-title'>{balanceTitle}</h3>
            <select className="physical_account_selector__form-select" value={selectedBalance} onChange={handleOnBalanceChange}>
               <option value="" disabled>{t('PAYMENT_VIEW_CURRENCY_TITLE')}</option>
               {balances.map((item) => (
                  <option key={item._id} value={item._id}>{`${t(item.displayName)} (${getPendingAmount(item)}) ${getAmount(item)}`}</option>
               ))}
            </select>
         </div>
      </div>
   )
}