import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { getProfilePictureByEmail } from '../../../services/userService.js';
import requestItemStyles from './RequestItem.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

let cx = classNames.bind(requestItemStyles);

export const RequestItem = ({ id, onClickHandler, from, eventTitle, deleteRequest, acceptRequest }) => {
    const [ownerImage, setOwnerImage] = useState("");
    const {t} = useTranslation();

    useEffect(() => {
        getProfilePictureByEmail(from)
            .then(res => setOwnerImage(res))
            .catch(err => console.log(err));
    }, [from])
    return (
        <div className={cx('request')}>
            <img src={ownerImage} alt="Profile picture" />
            <div className={cx('req-teacher-name')}>
                <span>{from}</span>
                <hr></hr>
                <span>{eventTitle}</span>
            </div>
            <div className={cx('req-event-name')}>

            </div>
            <div className={cx('btn-container')}>
                <button className={cx('accept-button')} onClick={() => acceptRequest(id)}>
                    {t("RequestAcceptText")}
                </button>
                <button className={cx('decline-button')} onClick={() => deleteRequest(id)}>
                    {t("RequestDeclineText")}
                </button>
                <Link to={`/chat-room/${from}`} className={cx('chat-button')} >
                {t("RequestChatButtonText")}
                </Link>
            </div>
        </div>
    )
} 
