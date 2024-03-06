import { useEffect } from 'react';
import './TextInputView.css';
import { formatCurrency } from '../../Utils/Common/formatCurrency';

export const TextInputView = ({ title, placeholder, onInputChange, onDidBegin, onReturnPressed, form, setForm }) => {
  const onChangeHandler = (event) => {
    let newValue = event.target.value;
    if (form.type === 'currency') {
      newValue = formatCurrency(newValue);
    }

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
    if (form.type === 'currency') {
      let newValue = formatCurrency(form.value);
      setForm(prevForm => ({
        ...prevForm,
        value: newValue
      }));
    }
  }

  return (
    <div>
      <p className='title'>{title}</p>
      <input
        className="inputField"
        placeholder={placeholder}
        onChange={(event) => onChangeHandler(event)}
        onKeyDown={(event) => onKeyDownHandler(event)}
        onFocus={(event) => onFocusHandler(event)}
        onBlur={(event) => onBlurHandler(event)}
        type='text'
        name={form.name}
        value={form.value}
        autoComplete={form.type === 'password' ? 'current-password' : form.autocomplete}
        maxLength={form.maxLength ? form.maxLength : -1} // Maximum length
      />
      {form.errorMessage && <p className='errorMessage'>{form.errorMessage}</p>}
    </div>
  );
}

export default TextInputView;
