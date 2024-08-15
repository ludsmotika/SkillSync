import styles from './CreateEvent.module.css';
import formStyles from '../../FormComponents/Form.module.css';
import classnames from 'classnames/bind';

import * as eventService from '../../../services/eventsService.js'

import { useState } from 'react';
import { getErrorMessage } from '../../../utils/errorUtil.js';
import { useAuthContext } from '../../../contexts/AuthContext.jsx';
import { useEventsContext } from '../../../contexts/EventsContext.jsx';
import { useTranslation } from 'react-i18next';

const cx = classnames.bind(styles);
const cxForms = classnames.bind(formStyles);

export const CreateEvent = () => {
    const { eventCreate } = useEventsContext();
    const { currentUser } = useAuthContext();

    const {t} = useTranslation();

    const [values, setValues] = useState({
        subject: '',
        title: '',
        description: '',
        reward: '',
    });

    const [errors, setErrors] = useState({
        subjectError: false,
        titleError: false,
        descriptionError: false,
        rewardError: false,
    });

    const changeHandler = (e) => {
        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }))
    }

    const setError = (errorField, value) => {
        const errorMsg = getErrorMessage(errorField, value);

        setErrors(state => ({
            ...state,
            [`${errorField}Error`]: errorMsg,
        }));
    }

    const onErrorHandler = (e) => {
        const errorField = e.target.name;
        const value = e.target.value;

        setError(errorField, value)
    }

    const onCreate = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        let eventData = Object.fromEntries(formData);
        eventData.ownerID = currentUser.uid;
        eventData.ownerEmail = currentUser.email;
        eventData.email = currentUser.email;

        Object.keys(eventData).forEach(key => setError(key, eventData[key]));

        if (Object.values(errors).some(error => error.length !== 0 || error === false)) {
            return;
        } else {
            eventService.createEvent(eventData)
                .then(result => eventCreate(result))
                .catch(error => alert(error));

            e.target.reset();
        }
    }

    return (
        <>
            <form className={cx('create-form')} onSubmit={onCreate}>
                <h3>{t("CreateEventFormTitle")}</h3>

                <label htmlFor="subject">{t("ForumSubjectText")}</label>
                <input type="text" placeholder={t("CreateEventFormSubjectPlaceholderText")} id="subject" name='subject' value={values.subject} onChange={changeHandler} onBlur={onErrorHandler} className={cxForms(`${errors.subjectError.length > 0 ? 'is-invalid' : ''}`)} />
                <span>{errors.subjectError}</span>

                <label htmlFor="title">{t("PublicationTitleText")}</label>
                <input type="text" placeholder={t("CreateEventFormTitlePlaceholderText")} id="title" name='title' value={values.title} onChange={changeHandler} onBlur={onErrorHandler} className={cxForms(`${errors.titleError.length > 0 ? 'is-invalid' : ''}`)} />
                <span>{errors.titleError}</span>

                <label htmlFor="description">{t("CreateEventFormDescriptionText")}</label>
                <textarea placeholder={t("CreateEventFormDescriptionPlaceholderText")} id="description" rows="10" cols="50" name='description' value={values.description} onChange={changeHandler} onBlur={onErrorHandler} className={cxForms(`${errors.descriptionError.length > 0 ? 'is-invalid' : ''}`)} />
                <span>{errors.descriptionError}</span>

                <label htmlFor="reward">{t("CreateEventFormRewardText")}</label>
                <input type="text" placeholder={t("CreateEventFormRewardPlaceholderText")} id="reward" name='reward' value={values.reward} onChange={changeHandler} onBlur={onErrorHandler} className={cxForms(`${errors.rewardError.length > 0 ? 'is-invalid' : ''}`)} />
                <span>{errors.rewardError}</span>

                <button className={cx('create-button')}>{t("CreateEventFormSubmitButtonText")}</button>
            </form>
        </>
    );
}