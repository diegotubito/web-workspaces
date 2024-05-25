import './OrderTypeSelector.css'
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { OrderType } from '../../../Hooks/Order/orderType';

export const OrderTypeSelector = ({ title, selectedOrderType, setSelectedOrderType }) => {
   const { t } = useTranslation()
   const [types, setTypes] = useState([])

   useEffect(() => {
      const orderTypes = Object.values(OrderType)
      setTypes(orderTypes)
   }, [])

   useEffect(() => {
      // default payment method
      if (types.length > 0) {
         setSelectedOrderType(types[0])
      }
   }, [types])

   const handleOnSelectedOrderTypeChange = (event) => {
      const item = event.target.value;
      setSelectedOrderType(item);
   };

   return (
      <div>
         <h3 className='order_type_selector__form-title'>{t(title)}</h3>
         <select className="order_type_selector__form-select" value={selectedOrderType} onChange={handleOnSelectedOrderTypeChange}>
            {types.map((type) => (
               <option key={type} value={type}>{t(type)}</option>
            ))}
         </select>
      </div>
   )
}