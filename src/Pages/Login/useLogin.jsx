import { useState } from 'react';
import axios from 'axios';
import { useUserSession } from '../../Utils/userSessionContext'


export const useLogin = () => {
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { userSession, updateUserSession } = useUserSession();

  const doLogin = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:666/api/v1/login', { email, password });
      setLoginError('');
      console.log('Login successful:', response.data);
      updateUserSession(response.data)
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
