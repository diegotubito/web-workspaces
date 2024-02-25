import { TextInputView } from '../../Components/InputViews/TextInputView';
import { Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLoginViewModel } from './useLoginViewModel'
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

    const { doLogin, loginError, loginSuccess, isLoading } = useLoginViewModel()

    useEffect(() => {
        if (loginSuccess) {
            navigate('/home')
        }
    }, [loginSuccess, navigate])


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
            default:
                console.log(`Sorry, we are out of scope`);

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
                default:
                    console.log(`Sorry, we are out of scope`);

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
                default:
                    console.log(`Sorry, we are out of scope`);
            }
        }
    }

    const onReturnPressed = (name) => {
    }

    const validateEmail = () => {
        if (!emailForm.value) {
            setEmailForm({ ...emailForm, errorMessage: t('LOGIN_MISSING_USERNAME') })
            return false
        }

        setEmailForm({ ...emailForm, errorMessage: null })
        return true
    }

    const validatePassword = () => {
        if (!passwordForm.value) {
            setPaswordForm({ ...passwordForm, errorMessage: t('LOGIN_MISSING_PASSWORD') })
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
        <div>
            <div className='login__main'>
                <div className='login__container'>
                    <h1>{t('LOGIN_TITLE')}</h1>
                    <form>
                        <div className='login__fields_gap'>
                            <TextInputView
                                title={t('LOGIN_USERNAME')}
                                placeholder={t('LOGIN_USERNAME_PLACEHOLDER')}
                                onInputChange={onInputChange}
                                onDidBegin={onDidBeginInput}
                                onReturnPressed={onReturnPressed}
                                form={emailForm}
                                setForm={setEmailForm}
                            />
                        </div>

                        <div>
                            <TextInputView
                                title={t('LOGIN_PASSWORD')}
                                placeholder={t('LOGIN_PASSWORD_PLACEHOLDER')}
                                onInputChange={onInputChange}
                                onDidBegin={onDidBeginInput}
                                onReturnPressed={onReturnPressed}
                                form={passwordForm}
                                setForm={setPaswordForm}
                            />
                        </div>

                        <div className='button-login-container' >
                            <Button className='button-login' variant="primary" onClick={() => onLogin()}>
                                { isLoading ? (<Spinner />) : (t('LOGIN_BUTTON_TITLE')) }
                            </Button>{''}
                            {loginError && <p className="error-message">{loginError}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}