import { useState } from 'react'

export const NoteTextField = ({ value, onChangeValue, maxLength = 1000, minLength = 0, placeholder }) => {
   const [errorMessage, setErrorMessage] = useState('')

   const onChangeHandler = (event) => {
      const eventValue = event.target.value
      onChangeValue(eventValue)
   }

   const validate = (value) => {
      // Convert value to string to ensure .length is accessible
      let stringValue = String(value);

      if (stringValue.length < minLength) {
         setErrorMessage('This field is mandatory');
         return;
      }

      setErrorMessage(null)
   }

   return (
      <div>
         <input
            style={{
               width: '100%',
               border: '1px solid ' + `${'var(--lightGray)'}`,
               height: '4rem',
               padding: '1rem 1rem',
               fontSize: '17px',
               borderRadius: '4px',
            }}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChangeHandler(event)}
            autoComplete='off'
            maxLength={`maxLength`}
            onBlur={() => validate(value)}  // Validate when the input loses focus
         />

         { errorMessage && (
            <div
               style={{
                  color: 'red',
                  fontSize: '13px',
                  marginLeft: '1rem'
               }}
            >{`${errorMessage}`}</div>
         )}

      </div>
   )
}