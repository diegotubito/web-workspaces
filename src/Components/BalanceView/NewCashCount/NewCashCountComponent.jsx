import './NewCashCountComponent.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../Buttons/SimpleButton/SimpleButton';
import { formatCurrency, convertCurrencyStringToNumber } from '../../../Utils/Common/formatCurrency';

export const NewCashCountComponent = ({ title, account, onCountedAmountsHandler }) => {
   const { t } = useTranslation();
   const [amounts, setAmounts] = useState({});
   const [inputValues, setInputValues] = useState({});

   const handleAmountChange = (balanceId, value) => {
      setAmounts(prevAmounts => ({
         ...prevAmounts,
         [balanceId]: value,
      }));
   };

   const handleInputChange = (balanceId, newValue) => {
      setInputValues(prevValues => ({
         ...prevValues,
         [balanceId]: newValue,
      }));
   };

   const handleSubmit = () => {
      const amountArray = account.balances.map(balance => ({
         balance: balance._id,
         countedAmount: amounts[balance._id] || 0,
      }));
      onCountedAmountsHandler(amountArray)
   };

   const onChangeHandler = (event, balanceId) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '');

      if (newValue === '') {
         setInputValues(prevValues => ({
            ...prevValues,
            [balanceId]: '',
         }));
         handleAmountChange(balanceId, 0);
      } else {
         const numericValue = parseFloat(newValue) / 100;
         const formattedValue = formatCurrency(numericValue.toFixed(2));

         setInputValues(prevValues => ({
            ...prevValues,
            [balanceId]: formattedValue,
         }));
         handleAmountChange(balanceId, numericValue);
      }
   };

   const onBlurHandler = (balanceId) => {
      const inputValue = inputValues[balanceId];
      const numericValue = inputValue ? convertCurrencyStringToNumber(inputValue) : 0;
      const formattedValue = formatCurrency(numericValue.toFixed(2));
      setInputValues(prevValues => ({
         ...prevValues,
         [balanceId]: formattedValue,
      }));
   };

   return (
      <div className='new_cash_count_component__item' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         <h2>{t(title)}</h2>
         <div className='new_balance_view__cash-count-item'>
            {account.balances.map((balanceToBeCounted) => {
               const inputValue = inputValues[balanceToBeCounted._id] || '';

               return (
                  <div key={balanceToBeCounted._id} className='new_balance_view__cash-count-item-already-counted'>
                     <h4>{balanceToBeCounted.displayName}</h4>
                     <input
                        style={{
                           width: '20rem',
                           border: '1px solid var(--lightGray)',
                           padding: '0.3rem 1.5rem',
                           fontSize: '15px',
                           borderRadius: '4px',
                           textAlign: 'right'
                        }}
                        type="text"
                        placeholder={t('Counted')}
                        value={inputValue}
                        onChange={(e) => onChangeHandler(e, balanceToBeCounted._id)}
                        onBlur={() => onBlurHandler(balanceToBeCounted._id)}
                        autoComplete='off'
                        maxLength={15}
                     />
                  </div>
               );
            })}
            <SimpleButton
               title={t('New Cash Count')}
               style='primary'
               onClick={handleSubmit}
            />
         </div>
      </div>
   );
};
