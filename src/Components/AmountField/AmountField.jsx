import './AmountField.css'
import { useTranslation } from 'react-i18next';
import { TextField } from '../TextField/TextField'
import { useState, useEffect } from 'react'
import { formatCurrency, convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency';

export const AmountField = ({ title, amount, onAmountDidChanged, textAlign }) => {
   const {t} = useTranslation()
   const [amountForm, setAmountForm] = useState({
      name: 'amount_input',
      value: '0',
      errorMessage: '',
      type: 'currency',
      autocomplete: 'off',
      maxLength: 12,
      autoCapitalize: 'words',
      size: 'large'
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

   return (
      <div className='amount_field__textfield' style={{textAlign: textAlign}}>
         <TextField
            title={t(title)}
            placeholder={''}
            onInputChange={onInputChange}
            onDidBegin={onDidBeginInput}
            onReturnPressed={onReturnPressed}
            form={amountForm}
            setForm={setAmountForm}
            textAlign={textAlign}
         />
      </div>

   )
}