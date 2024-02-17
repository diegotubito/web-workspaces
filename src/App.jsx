import logo from './logo.svg';
import './App.css';
import { TextInputView } from './Pages/InputViews/TextInputView';
import { Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import { useLogin } from './Pages/Login/useLogin';

function App() {
  const [emailForm, setEmailForm] = useState({
    name: 'email_input',
    value: '',
    errorMessage: '',
    type: 'text'
  })

  const [passwordForm, setPaswordForm] = useState({
    name: 'password_input',
    value: '',
    errorMessage: '',
    type: 'password'
  })

  const { doLogin, loginError, loginSuccess } = useLogin()

  const onLogin = async () => {
    if (!groupValidation()) {
      console.log('Something is missing');
      // Optionally, update the UI to indicate the validation error
      return;
    }
  
    await doLogin(emailForm.value, passwordForm.value);

  };  

  const onInputChange = (name, newValue) => {

    switch (name) {
      case 'email_input':
        console.log('from email input', emailForm.value)
        break
      case 'password_input':
        console.log('from password input', passwordForm.value)
        break
    }
  }

  const onDidBeginInput = (name, begin) => {
    if (!begin) {

      switch (name) {
        case 'email_input':
          validateEmail()
          break
        case 'password_input':
          validatePassword()
          break
      }
    } else {
      // did begin
      switch (name) {
        case 'email_input':
          setEmailForm({ ...emailForm, errorMessage: null })
          break
        case 'password_input':
          setPaswordForm({ ...passwordForm, errorMessage: null })
          break
      }
    }
  }

  const onReturnPressed = (name) => {
    console.log(name)
  }

  const validateEmail = () => {
    if (!emailForm.value) {
      setEmailForm({ ...emailForm, errorMessage: 'email should not be empty' })
      return false
    }

    setEmailForm({ ...emailForm, errorMessage: null })
    return true
  }

  const validatePassword = () => {
    if (!passwordForm.value) {
      setPaswordForm({ ...passwordForm, errorMessage: 'password is missing' })
      return false
    }
    setPaswordForm({ ...passwordForm, errorMessage: null })
    return true
  }

  const groupValidation = () => {
    const emailValidation = validateEmail()
    const passwordValidation = validatePassword()

    return emailValidation && passwordValidation
  }

  return (
    <>
      <div className='main-navigation'>
        <div className='outer-container'>
          <div>
            <TextInputView
              onInputChange={onInputChange}
              onDidBegin={onDidBeginInput}
              onReturnPressed={onReturnPressed}
              form={emailForm}
              setForm={setEmailForm}
            />

            <TextInputView
              onInputChange={onInputChange}
              onDidBegin={onDidBeginInput}
              onReturnPressed={onReturnPressed}
              form={passwordForm}
              setForm={setPaswordForm}
            />

            <div className='button-login-container margin-top' >
              <Button className='button-login' variant="primary" onClick={() => onLogin()}>Login</Button>{''}
              {loginError && <p className="error-message">{loginError}</p>}
              {loginSuccess && <p className="error-message">SUCCESS</p>}
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
