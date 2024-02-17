import logo from './logo.svg';
import './App.css';
import { TextInputView } from './Pages/InputViews/TextInputView';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = () => {
    console.log('should validate fields here')
    console.log(email)
    console.log(password)
  }

  const onInputChange = (name, value) => {

    switch (name) {
      case 'email_input':
        console.log('from email input', email)
        break
      case 'password_input':
        console.log('from password input', password)
        break
    }
  }

  const onDidBeginInput = (begin, name) => {
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
              name="email_input"
              onInputChange={onInputChange}
              onDidBegin={onDidBeginInput}
              onReturnPressed={onReturnPressed}
              value={email}
              setValue={setEmail}
            />

            <TextInputView name="password_input"
              onInputChange={onInputChange}
              onDidBegin={onDidBeginInput}
              onReturnPressed={onReturnPressed}
              value={password}
              setValue={setPassword}
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
