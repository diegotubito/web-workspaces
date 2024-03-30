import { useEffect } from 'react';
import './TextField.css';
import { formatCurrency } from '../../Utils/Common/formatCurrency';

/*
text: Teclado estándar de texto.
email: Teclado optimizado para la entrada de direcciones de correo electrónico. Puede incluir teclas especiales como '@' y '.' para facilitar la escritura de correos electrónicos.
tel: Teclado optimizado para la entrada de números de teléfono. Muestra un teclado numérico que puede incluir símbolos como '+' o '-'.
number: Teclado para la entrada de números. Este puede incluir un punto o coma para números decimales, dependiendo de la configuración regional.
url: Teclado optimizado para la entrada de URLs. Puede incluir teclas especiales como '/', '.com', etc.
search: Teclado optimizado para búsquedas. Puede incluir un botón de "búsqueda" o "enter" dependiendo del sistema operativo y navegador.
password: Teclado estándar de texto, pero oculta la entrada para proteger la información.
datetime: Teclado para la entrada de fecha y hora.
date: Teclado para la entrada de fechas.
month: Teclado para la entrada de meses.
week: Teclado para la entrada de semanas.
time: Teclado para la entrada de horas.
*/

export const TextField = ({ title, placeholder, onInputChange, onDidBegin, onReturnPressed, form, setForm, textAlign }) => {
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
      <p className={`${form.size === 'small' ? 'titleSmall' : ''} ${form.size === 'large' ? 'titleLarge' : ''}`}>{title}</p>
      <input
        className={`inputField ${form.size === 'small' ? 'inputFieldSmall' : ''} ${form.size === 'large' ? 'inputFieldLarge' : ''}`}
        placeholder={placeholder}
        onChange={(event) => onChangeHandler(event)}
        onKeyDown={(event) => onKeyDownHandler(event)}
        onFocus={(event) => onFocusHandler(event)}
        onBlur={(event) => onBlurHandler(event)}
        type={form.type}
        name={form.name}
        value={form.value}
        autoComplete={form.type === 'password' ? 'current-password' : form.autocomplete}
        maxLength={form.maxLength ? form.maxLength : -1} // Maximum length
        autoCapitalize={form.autoCapitalize}
        style={{ textAlign: textAlign }}
      />
      {form.errorMessage && <p className='errorMessage'>{form.errorMessage}</p>}
    </div>
  );
}

export default TextField;
