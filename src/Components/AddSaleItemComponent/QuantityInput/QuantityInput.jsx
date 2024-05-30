import './QuantityInput.css'
import { useEffect, useState } from 'react'

export const QuantityInput = ({ settings, isEnabled, placeholder, maxLength, textAlign, initialValue, onInputChanged, index }) => {
   const [inputValue, setInputValue] = useState('')

   useEffect(() => {
      setInputValue(initialValue)
   }, [initialValue])

   const onChangeHandler = (event) => {
      const value = event.target.value
      setInputValue(value)
   }

   const onBlurHandler = () => {
      if (!isEnabled) { return }
      onInputChanged(inputValue, index)
   }

   const onKeyPressHandler = (event) => {
      if (!/[0-9]/.test(event.key)) {
         event.preventDefault()
      }
   }

   const onFocusHandler = (event) => {
      if (!isEnabled) { return }
      event.target.select()
   }

   const onKeyDownHandler = (event) => {
      if (event.key === 'Enter') {
         event.preventDefault()
         if (isEnabled) {
            onInputChanged(inputValue, index)
         }
         const form = event.target.form
         if (form) {
            const currentIndex = Array.prototype.indexOf.call(form.elements, event.target)
            if (currentIndex > -1 && currentIndex < form.elements.length - 1) {
               const nextElement = form.elements[currentIndex + 1]
               if (nextElement && nextElement.focus) {
                  nextElement.focus()
               }
            }
         }
      }
   }

   return (
      <div>
         <div>
            <input
               style={{
                  border: '1px solid ' + `${isEnabled ? settings.inputBorderColorEnabled : settings.inputBorderColorDisabled}`,
                  width: '100%',
                  padding: settings.padding,
                  textAlign: textAlign,
                  userSelect: `${isEnabled ? 'revert' : 'none'}`,
                  outline: `${isEnabled ? 'revert' : 'none'}`,
                  borderRadius: settings.borderRadius
               }}
               type="text"
               placeholder={placeholder}
               value={inputValue}
               onChange={onChangeHandler}
               onBlur={onBlurHandler}
               onKeyPress={onKeyPressHandler}
               onFocus={onFocusHandler}
               onKeyDown={onKeyDownHandler}
               autoComplete='off'
               readOnly={!isEnabled}
               maxLength={maxLength ? maxLength : 5}
            />
         </div>
      </div>
   )
}
