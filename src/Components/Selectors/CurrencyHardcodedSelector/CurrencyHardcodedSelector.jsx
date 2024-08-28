import './CurrencyHardcodedSelector.css'
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const CurrencyHardcodedSelector = ({ title, selectedCurrency, setSelectedCurrency, currencies }) => {
   const { t } = useTranslation()

   useEffect(() => {
      // default payment method
      if (currencies.length > 0) {
         setSelectedCurrency(currencies[0]._id)
      } else {
         setSelectedCurrency("")
      }
   }, [currencies])

   const handleOnCurrencyChange = (event) => {
      const item = event.target.value;
      setSelectedCurrency(item);
   };

   return (
      <div>
         <p style={{
            fontSize: '19px',
            fontWeight: 'bold',
            margin: '0'
         }}>{title}</p>
         <select className="currency_hardcoded_selector__form-select" value={selectedCurrency} onChange={handleOnCurrencyChange}>
            {currencies.map((item) => (
               <option key={item._id} value={item._id}>{t(item.name)}</option>
            ))}
         </select>
      </div>
   )
}