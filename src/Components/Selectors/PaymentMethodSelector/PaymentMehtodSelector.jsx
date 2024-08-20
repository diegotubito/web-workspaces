import './PaymentMethodSelector.css'
import { useEffect, useState } from "react";
import { usePaymentViewModel } from '../../../Hooks/Payment/PaymentViewModel';
import { useTranslation } from 'react-i18next'

export const PaymentMethodSelector = ({ title, selectedPaymentMethod, setSelectedPaymentMethod, setIsFinanced }) => {
   const { t } = useTranslation()
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()

   useEffect(() => {
      fetchAllMethods()
   }, [])

   useEffect(() => {
      // default payment method
      if (paymentMethods.length > 0) {
         setSelectedPaymentMethod(paymentMethods[0]._id)
      }
   }, [paymentMethods])
   
   const handleOnPaymentMethodChange = (event) => {
      const item = event.target.value;
      const object = paymentMethods.find((p) => p._id === item)
      setIsFinanced(object.isFinanced)
      setSelectedPaymentMethod(item);
   };

   return (
      <div>
         <p style={{
            fontSize: '19px',
            fontWeight: 'bold',
            margin: '0'
         }}>{title}</p>
         <select className="payment_method_selector__form-select" value={selectedPaymentMethod} onChange={handleOnPaymentMethodChange}>
            {paymentMethods.map((item) => {
               return (
                  <option key={item._id} value={item._id}>{t(item.name)}</option>
               )
            }
            )}
         </select>
      </div>
   )
}