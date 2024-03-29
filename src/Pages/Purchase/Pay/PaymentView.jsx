import { useEffect, useState } from 'react';
import './PaymentView.css'
import { usePaymentViewModel } from './PaymentViewModel';
import { usePhysicalAccountViewModel } from '../../../Hooks/PhysicalAccount/usePhysicalAccountViewModel';

export const PaymentView = ({ isOpen, setIsOpen }) => {
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");
   const [selectedPhysicalAccount, setSelectedPhysicalAccount] = useState("");
   const [selectedCurrency, setSelectedCurrency] = useState("")
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()
   const { getAllAccounts, accounts } = usePhysicalAccountViewModel()
   const [currencies, setCurrencies] = useState([])

   useEffect(() => {
      fetchAllMethods()
      getAllAccounts()
   }, [])

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentItem(paymentMethods[0]._id)
      }
   }, [paymentMethods])

   useEffect(() => {
      // default payment method
      if (accounts.length > 0) {
         setSelectedPhysicalAccount(accounts[0]._id)
      }
   }, [accounts])

   useEffect(() => {
      mapCurrencies()
   }, [selectedPhysicalAccount])

   const handleOnPaymentMethodChange = (event) => {
      const itemId = event.target.value;
      setSelectedPaymentItem(itemId);
   };

   const handleOnPhysicalAccountChange = (event) => {
      const itemId = event.target.value;
      setSelectedPhysicalAccount(itemId);
      setSelectedCurrency("")
   };

   const handleOnCurrencyChange = (event) => {
      const itemId = event.target.value;
      setSelectedCurrency(itemId);
   };

   const mapCurrencies = () => {
      if (!selectedPhysicalAccount) {
         setCurrencies([])
         return
      }
      // Find the account with the given accountId
      const account = accounts.find(account => account._id === selectedPhysicalAccount);

      // If the account is found, map its balances to extract currency details
      if (!account) {
         setCurrencies([])
         return
      }

      console.log(account)
      const items = account.balances.map(balance => ({
         _id: balance.currency._id,
         name: balance.currency.name,
         symbol: balance.currency.symbol,
         code: balance.currency.code,
         isEnabled: balance.currency.isEnabled,
      }));


      setCurrencies(items)
   }

   return (!isOpen) ? null : (
      <div className='purchase_crud_view__main'>
         <div className='purchase_crud_view__container'>
            <h1 className='purchase_crud_view__title'>Purchase Payment</h1>

            <div>
               <h3 className='purchase_view__form-title'>Select Payment Method</h3>
               <select className="form-select" value={selectedPaymentItem} onChange={handleOnPaymentMethodChange}>
                  {paymentMethods.map((item) => {
                     return (
                        <option key={item._id} value={item._id}>{item.name}</option>
                     )
                  }
                  )}
               </select>
            </div>

            <div>
               <h3 className='purchase_view__form-title'>Select Phsycial Account</h3>
               <select className="form-select" value={selectedPhysicalAccount} onChange={handleOnPhysicalAccountChange}>
                  {accounts.map((item) => {
                     return (
                        <option key={item._id} value={item._id}>{item.name}</option>
                     )
                  }
                  )}
               </select>
            </div>

            <div>
               <h3 className='purchase_view__form-title'>Select Currency</h3>
               <select className="form-select" value={selectedCurrency} onChange={handleOnCurrencyChange}>
                  <option value="" disabled>Select a currency</option>
                  {currencies.map((item) => (
                     <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
               </select>
            </div>


         </div>
      </div>
   )
}