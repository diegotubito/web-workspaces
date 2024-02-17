import logo from './logo.svg';
import './App.css';
import { TextInputView } from './Pages/InputViews/TextInputView';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const [emailForm, setEmailForm] = useState({
    name: 'email_input',
    value: '',
    errorMessage: ''
  })

  const [passwordForm, setPaswordForm] = useState({
    name: 'password_input',
    value: '',
    errorMessage: ''
  })

  const onLogin = () => {
    console.log('should validate fields here')
    if (passwordForm.errorMessage) {
      setPaswordForm({...passwordForm, errorMessage: null})
    } else {
      setPaswordForm({...passwordForm, errorMessage: 'clave mal formada.'})
    }
    console.log(passwordForm.errorMessage)

  }

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
          console.log('leaving', name)
          break
        case 'password_input':
          console.log('leaving', name)

          break
      }
    }
  }

  const onReturnPressed = (name) => {
    console.log(name)
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

            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
