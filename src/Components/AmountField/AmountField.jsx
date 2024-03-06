import './AmountField.css'
import { useTranslation } from 'react-i18next';
import { TextInputView } from '../InputViews/TextInputView'
import { useState, useEffect } from 'react'
import { formatCurrency } from '../../Utils/Common/formatCurrency';

export const AmountField = ({amount, onAmountDidChanged}) => {
   const {t} = useTranslation()
   const [amountForm, setAmountForm] = useState({
      name: 'amount_input',
      value: '0',
      errorMessage: '',
      type: 'currency',
      autocomplete: 'off',
      maxLength: 12
   })

   useEffect(() => {
      setAmountForm(prevForm => ({ ...prevForm, value: formatCurrency(String(amount*100)) }));
   }, [amount]);

   const onInputChange = (name, newValue) => {
      switch (name) {
         case 'amount_input':
            onAmountDidChanged(convertCurrencyStringToNumber(newValue))
            break
         default:
            console.log(`Sorry, we are out of scope`);
      }
   }

   const convertCurrencyStringToNumber = (currencyString) => {
      const numberString = currencyString.replace(/[^0-9.-]+/g, '');
      return parseFloat(numberString);
   };

   const onDidBeginInput = (name, begin) => {
      if (!begin) {

         switch (name) {
            case 'amount_input':
               validateAmount()
               break
            default:
               console.log(`Sorry, we are out of scope`);

         }
      } else {
         // did begin
         switch (name) {
            case 'amount_input':
               setAmountForm({ ...amountForm, errorMessage: null })
               break
            default:
               console.log(`Sorry, we are out of scope`);
         }
      }
   }

   const onReturnPressed = (name) => {
   }

   const validateAmount = () => {
      if (!amountForm.value) {
         setAmountForm({ ...amountForm, errorMessage: t('LOGIN_MISSING_USERNAME') })
         return false
      }

      setAmountForm({ ...amountForm, errorMessage: null })
      return true
   }

   const groupValidation = () => {
      const emailValidation = validateAmount()

      return emailValidation
   }

   return (
      <div className='purchase_view__amount-textfield'>
         <TextInputView
            title={t('Amount')}
            placeholder={''}
            onInputChange={onInputChange}
            onDidBegin={onDidBeginInput}
            onReturnPressed={onReturnPressed}
            form={amountForm}
            setForm={setAmountForm}
         />
      </div>

   )
}