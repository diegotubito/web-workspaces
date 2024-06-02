import { useEffect, useState } from 'react'
import './NewAmountInput.css'
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency'

export const NewAmountInput = ({ isEnabled, maxLength, textAlign, initialValue, onInputChanged }) => {
   const [inputValue, setInputValue] = useState('')

   useEffect(() => {
      const convertedNumber = convertCurrencyStringToNumber(initialValue)
      setInputValue(initialValue ? formatCurrency(convertedNumber.toFixed(2).toString()) : '')
   }, [initialValue])

   const onChangeHandler = (event) => {
      const value = event.target.value
      setInputValue(formatCurrency(value))
   }

   const onBlurHandler = () => {
      if (!isEnabled) { return }
      const convertedNumber = convertCurrencyStringToNumber(inputValue)
      const formattedValue = convertedNumber ? formatCurrency(convertedNumber.toFixed(2).toString()) : ''
      setInputValue(formattedValue)
      onInputChanged(convertedNumber)
   }

   const onKeyPressHandler = (event) => {
      if (!/[0-9.,]/.test(event.key)) {
         event.preventDefault()
      }
   }

   const onFocusHandler = (event) => {
      if (!isEnabled) { return }
      event.target.select()
   }

   const onKeyDownHandler = (event) => {
      if (event.key === 'Enter') {
         if (isEnabled) {
            const convertedNumber = convertCurrencyStringToNumber(inputValue)
            onInputChanged(convertedNumber)

         }
         event.preventDefault()
         const form = event.target.form
         if (form) {
            const index = Array.prototype.indexOf.call(form.elements, event.target)
            if (index > -1 && index < form.elements.length - 1) {
               const nextElement = form.elements[index + 1]
               if (nextElement && nextElement.focus) {
                  nextElement.focus()
               }
            }
         }
      }
   }

   return (
      <div>
         <input
            style={{
               width: '20rem',
               border: '1px solid var(--lightGray)',
               height: '4rem',
               padding: '1rem 1rem',
               fontSize: '17px',
               borderRadius: '4px',
               textAlign: 'end'
            }}
            type="text"
            value={inputValue}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            onKeyPress={onKeyPressHandler}
            onFocus={onFocusHandler}
            onKeyDown={onKeyDownHandler}
            autoComplete='off'
            readOnly={!isEnabled}
            maxLength={maxLength ? maxLength : 15}
         />
      </div>
   )
}
