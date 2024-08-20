import './CurrencySelector.css'
import { useEffect } from "react";
import { useCurrencyViewModel } from '../../../Hooks/Currency/useCurrencyViewModel'
import { useTranslation } from 'react-i18next';

export const CurrencySelector = ({ title, selectedCurrency, setSelectedCurrency }) => {
   const { t } = useTranslation()
   const { getCurrencies, currencies } = useCurrencyViewModel()

   useEffect(() => {
      getCurrencies()
   }, [])

   useEffect(() => {
      // default payment method
      if (currencies.length > 0) {
         setSelectedCurrency(currencies[0]._id)
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
         <select className="currency_selector__form-select" value={selectedCurrency} onChange={handleOnCurrencyChange}>
            {currencies.map((item) => (
               <option key={item._id} value={item._id}>{t(item.name)}</option>
            ))}
         </select>
      </div>
   )
}