import './TextInputView.css' ;
import { useState } from 'react';

export const TextInputView = ({onInputChange, onDidBegin, onReturnPressed, form, setForm}) => {
  const onChangeHandler = (event) => {
    const newValue = event.target.value; // Use a different name to avoid confusion with `const {name, value} = form`
    setForm(prevForm => ({
      ...prevForm,
      value: newValue // Directly update the `value` field
    }));
    onInputChange(form.name, newValue); // Pass the static `form.name` and new value to parent's handler
  };
  

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onReturnPressed(event.target.name)
    }
  }

  const onFocusHandler = (event) => {
    // Handler for when the input field is focused
    onDidBegin(event.target.name, true)
  };

  const onBlurHandler = (event) => {
    // Handler for when the input field loses focus
    onDidBegin(event.target.name, false)
  };

  return (
    <div className='main'>
      <p>Authenticate</p>
      <input
      className="inputField"
        placeholder="username"
        onChange={(event) => onChangeHandler(event)}
        onKeyDown={(event) => onKeyDownHandler(event)}
        onFocus={(event) => onFocusHandler(event)}
        onBlur={(event) => onBlurHandler(event)}
        type={form.type}
        name={form.name}
        value={form.value}
      />
      { (form.errorMessage)  && <p className='errorMessage'>{form.errorMessage}</p>}
    </div>
  );
}

export default TextInputView