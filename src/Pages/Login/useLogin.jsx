import { useState } from 'react';
import axios from 'axios';

export const useLogin = () => {
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false)

  const doLogin = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:666/api/v1/login', { email, password });
      setLoginError('');
      console.log('Login successful:', response.data);
      // Serialize the object into a string
      const myObjectString = JSON.stringify(response.data);
      // Now store it in localStorage
      localStorage.setItem('userSession', myObjectString);
      setLoginSuccess(true)
      setLoginError(null);
    } catch (error) {
      setLoginSuccess(false)
      if (error.response) {
        console.error(`Error ${error.response.status}:`, error.response.data);
        setLoginError('Invalid credentials'); // Update with appropriate error message
      } else {
        console.error('Login error:', error.message);
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };

  return { doLogin, loginError, loginSuccess };
};
