import './SearchBar.css'
import { useEffect } from 'react';

export const SearchBar = ({ onInputChange, onDidBegin, onReturnPressed, form, setForm }) => {
   const onChangeHandler = (event) => {
      let newValue = event.target.value;
      setForm(prevForm => ({
         ...prevForm,
         value: newValue
      }));
      onInputChange(form.name, newValue);
   };

   const onKeyDownHandler = (event) => {
      if (event.key === 'Enter') {
         event.preventDefault();
         onReturnPressed(event.target.name);
      }
   }

   const onFocusHandler = (event) => {
      onDidBegin(event.target.name, true);
   };

   const onBlurHandler = (event) => {
      onDidBegin(event.target.name, false);
   };

   useEffect(() => {
      initValue()
   }, [])

   const initValue = () => {
     
   }

   return (
      <div>
         <p style={{
            fontSize: '19px',
            fontWeight: 'bold',
            margin: '0'
         }}>{form.title}</p>
         <input
            placeholder={form.placeholder}
            onChange={(event) => onChangeHandler(event)}
            onKeyDown={(event) => onKeyDownHandler(event)}
            onFocus={(event) => onFocusHandler(event)}
            onBlur={(event) => onBlurHandler(event)}
            type={form.type}
            name={form.name}
            value={form.value}
            autoComplete={form.autocomplete}
            maxLength={form.maxLength ? form.maxLength : -1} // Maximum length
            autoCapitalize={form.autoCapitalize}
            style={{ 
               textAlign: form.textAlign,
               fontSize: '17px',
               padding: '1rem',
               borderRadius: '8px',
               border: '1px solid var(--lightGray)',
               maxWidth: '100rem',
               width: '100%',
               minWidth: '20rem'
            }}
         />
         {form.errorMessage && <p className='search_bar__errorMessage'>{form.errorMessage}</p>}
      </div>
   );
}
