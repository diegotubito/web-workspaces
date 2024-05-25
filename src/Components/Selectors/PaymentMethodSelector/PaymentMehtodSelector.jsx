import './PaymentMethodSelector.css'
import { useEffect, useState } from "react";
import { usePaymentViewModel } from '../../../Hooks/Payment/PaymentViewModel';

export const PaymentMethodSelector = ({ title, selectedPaymentItem, setSelectedPaymentItem }) => {
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()

   useEffect(() => {
      fetchAllMethods()
   }, [])

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentItem(paymentMethods[0]._id)
      }
   }, [paymentMethods])
   
   const handleOnPaymentMethodChange = (event) => {
      const item = event.target.value;
      setSelectedPaymentItem(item);
   };

   return (
      <div>
         <h3 className='payment_method_selector__form-title'>{title}</h3>
         <select className="payment_method_selector__form-select" value={selectedPaymentItem} onChange={handleOnPaymentMethodChange}>
            {paymentMethods.map((item) => {
               return (
                  <option key={item._id} value={item._id}>{item.name}</option>
               )
            }
            )}
         </select>
      </div>
   )
}