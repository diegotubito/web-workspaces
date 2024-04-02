import { useState, useEffect } from 'react';
import { formatCurrency, convertCurrencyStringToNumber } from '../../../Utils/Common/formatCurrency';

export const AmountTextField = ({ initialValue, onChangeValue, placeholder = "Amount" }) => {
   const [inputValue, setInputValue] = useState('');

   // Actualiza el valor mostrado cuando cambia el valor externo
   useEffect(() => {
      setInputValue(initialValue ? formatCurrency(initialValue.toString()) : '');
   }, [initialValue]);

   const onChangeHandler = (event) => {
      const newValue = event.target.value;
      const numericValue = convertCurrencyStringToNumber(newValue);
      const newValueFormatted = formatCurrency(newValue)

      setInputValue(newValueFormatted);

      // Asegura que el valor enviado hacia afuera esté limpio

      onChangeValue(Number(numericValue * 10).toFixed(2));
   };

   const onBlurHandler = () => {
      // Formatea el valor para mostrarlo con agrupaciones y símbolo de moneda al perder el foco
      setInputValue(formatCurrency(inputValue));
   };

   return (
      <input
         style={{
            width: '20rem',
            border: '1px solid var(--lightGray)',
            height: '4rem',
            padding: '1rem 1rem',
            fontSize: '17px',
            borderRadius: '4px',
            textAlign: 'center'
         }}
         type="text"
         placeholder={placeholder}
         value={inputValue}
         onChange={onChangeHandler}
         onBlur={onBlurHandler}
         autoComplete='off'
      />
   );
};
