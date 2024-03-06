import { useEffect } from 'react';
import './TextInputView.css';

const formatCurrency = (value) => {
  // Eliminar cualquier caracter que no sea dígito
  let cleanedValue = value.replace(/\D+/g, '');

  // Convertir el valor limpio a centavos
  let centValue = parseInt(cleanedValue, 10) || 0;

  // Convertir a formato de moneda
  let formattedValue = (centValue / 100).toFixed(2);

  // Use Intl.NumberFormat to format the number with the currency symbol and thousand separator
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Change to your desired currency code
    minimumFractionDigits: 2,
  });

  // Agregar símbolo de pesos
  return `${formatter.format(formattedValue)}`;
};

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
