import logo from './logo.svg';
import './App.css';
import { TextInputView } from './Pages/InputViews/TextInputView';
import { Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import axios from 'axios';

const doLogin = async (email, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:666/api/v1/login', {
      email: email,
      password: password
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error during login:', error);

    // Check if the error is from the API or a network issue
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return { success: false, data: error.response.data, status: error.response.status };
    } else if (error.request) {
      // The request was made but no response was received
      return { success: false, message: "No response from server" };
    } else {
      // Something happened in setting up the request that triggered an Error
      return { success: false, message: error.message };
    }
  }
};

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

  const onLogin = async () => {
    if (!groupValidation()) {
      console.log('Something is missing');
      // Optionally, update the UI to indicate the validation error
      return;
    }
  
    const result = await doLogin(emailForm.value, passwordForm.value);
  
    if (result.success) {
      console.log('Login successful:', result.data);
      // Proceed with login success logic, like redirecting the user
    } else {
      if (result.status) {
        console.log(`Error ${result.status}:`, result.data);
        console.log('invalid credentials')
        // Handle API errors, e.g., invalid credentials, account locked, etc.
        // You can show these errors to the user
      } else {
        console.log('Login error:', result.message);
        // Handle network errors, server errors, etc.
        // Inform the user to check their connection or try again later
      }
      // Update UI to reflect the error state
    }
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
              {<p>{'something went wrong'}</p>}
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
