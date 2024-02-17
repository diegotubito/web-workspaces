import './TextInputView.css' ;
import { useState } from 'react';

export const TextInputView = (props) => {
  const onChangeHandler = (event) => {
    props.onInputChange(event.target.name, event.target.value)
    props.setValue(event.target.value)
  }

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      props.onReturnPressed(event.target.name)
    }
  }

  const onFocusHandler = (event) => {
    // Handler for when the input field is focused
    props.onDidBegin(true, event.target.name)
  };

  const onBlurHandler = (event) => {
    // Handler for when the input field loses focus
    props.onDidBegin(false, event.target.name)
  };

  return (
    <div className='main'>
      <p>Authenticate</p>
      <input
      className="inputField"
        type="text"
        placeholder="username"
        name={props.name}
        onChange={(event) => onChangeHandler(event)}
        onKeyDown={(event) => onKeyDownHandler(event)}
        onFocus={(event) => onFocusHandler(event)}
        onBlur={(event) => onBlurHandler(event)}
        value={props.value}
      />
    </div>
  );
}

export default TextInputView