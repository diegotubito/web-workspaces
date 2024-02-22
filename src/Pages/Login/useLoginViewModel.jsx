import { useState } from 'react';
import { useUserSession } from '../../Utils/userSessionContext'
import { useLoginRepository } from './useLoginRepository';
import { useTranslation } from 'react-i18next';

export const useLoginViewModel = () => {
  const {t} = useTranslation()
  const {doLogin: doLoginRepository} = useLoginRepository()

  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { updateUserSession } = useUserSession();

  const doLogin = async (email, password) => {
    try {
      const response = await doLoginRepository(email, password);
      updateUserSession(response)
      setLoginSuccess(true)
    } catch (error) {
      console.error(`Error ${error}:`);
      setLoginError(`${ t(error.message) }`); // Update with appropriate error message
    }
  };

  return { doLogin, loginError, loginSuccess };
};
