import classNames from 'classnames/bind';
import loginStyles from './Login.module.css';
import formStyles from '../../FormComponents/Form.module.css';

import * as authService from '../../../services/authService';

import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

let cx = classNames.bind(loginStyles);
let cxForms = classNames.bind(formStyles);

export const Login = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuthContext();
    const { t } = useTranslation();

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [hasErrors, setHasErrors] = useState(false);

    const changeHandler = (e) => {
        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }))
    }

    const loginHandler = async (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));

        if (!currentUser) {
            try {
                await authService.login(email, password);
                navigate('/');
            } catch (error) {
                setHasErrors(true);
            }
        }

    }

    return (
        <>
            <div className={cx('login-background')}>
                <div className={cx('shape')} />
                <div className={cx('shape')} />
            </div>
            <form className={cx('login-form')} onSubmit={loginHandler}>
                <h3>{t("LoginFormTitleText")}</h3>

                <label htmlFor="email">{t("LoginFormEmailText")}</label>
                <input type="text" placeholder={t("LoginFormEmailText")} id="email" name='email' value={values.email} onChange={changeHandler} />

                <label htmlFor="password">{t("LoginFormPasswordText")}</label>
                <input type="password" placeholder={t("LoginFormPasswordText")} id="password" name='password' value={values.password} onChange={changeHandler} />
                {hasErrors
                    ? <span>{t("LoginFormInvalidAttemptText")}</span>
                    : null
                }

                <button>{t("LoginFormSubmitButtonText")}</button>

                <div className={cxForms('social')}>
                    <p>{t("LoginFormDidnotHaveAnAccountText")} <Link to="/register">{t("LoginFormRegisterLinkText")}</Link></p>
                </div>
            </form>
        </>
    );
}