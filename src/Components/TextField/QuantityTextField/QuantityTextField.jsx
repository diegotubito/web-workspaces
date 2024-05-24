import { useState } from 'react'

export const QuantityTextField = ({ title, value, onChangeValue, maxValue = 18, minValue = 1, placeholder }) => {

   const onChangeHandler = (event) => {
      const eventValue = event.target.value
      onChangeValue(eventValue)
      validate(eventValue)
   }

   const validate = (value) => {
      // Convert value to string to ensure .length is accessible
      let numberValue = Number(value);

      if (numberValue < minValue) {
         onChangeValue(minValue)
         return;
      }

      if (numberValue > maxValue) {
         onChangeValue(maxValue)
         return;
      }
   }

   return (
      <div>
         {title && <h3>{title}</h3>}
         <input
            style={{
               width: '5rem',
               border: '1px solid ' + `${'var(--lightGray)'}`,
               padding: '1rem 1rem',
               fontSize: '17px',
               borderRadius: '4px',
               textAlign: 'center'
            }}
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChangeHandler(event)}
            autoComplete='off'
            maxLength={maxValue}
            onBlur={() => validate(value)}  // Validate when the input loses focus
         />
      </div>
   )
}
