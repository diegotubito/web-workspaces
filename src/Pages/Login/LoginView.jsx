import { TextInputView } from '../InputViews/TextInputView';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLogin } from './useLogin'
import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import { useTranslation } from 'react-i18next';

export const LoginView = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

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

    useEffect(() => {
        if (loginSuccess) {
            navigate('/home')
        }
    }, [loginSuccess])


    const onLogin = async () => {
        if (!groupValidation()) {
            // Optionally, update the UI to indicate the validation error
            return;
        }

        await doLogin(emailForm.value, passwordForm.value);
    };

    const onInputChange = (name, newValue) => {
        switch (name) {
            case 'email_input':
                break
            case 'password_input':
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
            <div className='login__main'>
                <div className='login__container'>
                <h1>{t('welcome')}</h1>
                    <form className='inputText'> 
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
                            <Button size="lg" className='button-login' variant="primary" onClick={() => onLogin()}>Login</Button>{''}
                            {loginError && <p className="error-message">{loginError}</p>}
                            {loginSuccess && <p className="error-message">SUCCESS</p>}
                        </div>
                    </form>

                </div>
            </div>
        </>
    );

}