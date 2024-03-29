import { useEffect, useState } from 'react';
import './PaymentView.css'
import { usePaymentViewModel } from './PaymentViewModel';

export const PaymentView = ({ isOpen, setIsOpen }) => {
   const [selectedPaymentItem, setSelectedPaymentItem] = useState("");
   const { fetchAllMethods, paymentMethods } = usePaymentViewModel()

   useEffect(() => {
      fetchAllMethods()
   }, [])

   const handleChange = (event) => {
      const itemId = event.target.value;
      setSelectedPaymentItem(itemId);
   };

   return (!isOpen) ? null : (
      <div className='purchase_crud_view__main'>
         <div className='purchase_crud_view__container'>
            <h1 className='purchase_crud_view__title'>Purchase Payment</h1>

            <div>
               <h3 className='purchase_view__form-title'>Select the payment method</h3>
               <select className="form-select" value={selectedPaymentItem} onChange={handleChange}>
                  {paymentMethods.map((item) => {
                     return (
                        <option key={item._id} value={item._id}>{item.name}</option>
                     )
                  }
                  )}
               </select>
            </div>


         </div>
      </div>
   )
}