import classNames from 'classnames/bind';
import styles from './EventDetails.module.css';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { EventsContext } from '../../../contexts/EventsContext';
import { getProfilePictureByEmail } from '../../../services/userService.js';
import * as requestService from '../../../services/requestsService.js';
import * as eventsService from '../../../services/eventsService.js';
import { extractUsernameFromEmail } from '../../../utils/usernameUtils.js';
import { useTranslation } from 'react-i18next';

let cx = classNames.bind(styles);

export const EventDetails = () => {
    const { currentUser } = useContext(AuthContext);
    const { eventSelect, eventDelete } = useContext(EventsContext);
    const { id } = useParams();
    const currentEvent = eventSelect(id);
    const [ownerImage, setOwnerImage] = useState("");
    const [isSent, setIsSent] = useState(false);

    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        getProfilePictureByEmail(currentEvent?.email)
            .then(res => setOwnerImage(res))
            .catch(err => console.log(err));


        requestService.exists(currentEvent?.email, currentUser?.email, currentEvent?.id)
            .then(res => {
                setIsSent(res);
            }).catch(err => console.log(err))

    }, [currentEvent?.email, currentUser?.email, currentEvent?.id]);

    const sendRequest = () => {

        if (isSent == true) {
            return;
        }

        requestService.createRequest({
            to: currentEvent.email,
            from: currentUser.email,
            eventId: currentEvent.id,
            eventTitle: currentEvent.title
        })
            .then(res => {
                setIsSent(true);
            })
            .catch()
    }

    const deleteHandler = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            eventsService.deleteEvent(id)
                .then(() => eventDelete(id))
                .catch(err => console.log(err));
            navigate('/events');
        }
    }

    return (
        <div className={cx("details-container")}>
            <div className={cx("details-box")}>
                <div className={cx("props-container")}>
                    <p className={cx("owner-email")}>{currentEvent?.ownerEmail}</p>
                    <div className={cx("header-props-container")}>
                        {ownerImage ?
                            <img className={cx("icon")} src={ownerImage} /> :
                            <img className={cx("icon")} src={"https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"} />
                        }

                        <div className={cx("title-box")}>
                            <h1>{currentEvent?.title}</h1>
                        </div>
                    </div>

                    <p>{currentEvent?.description}</p>
                    <div className={cx("pills-container")}>
                        <p>{t("EventCardSubjectText")}: {currentEvent?.subject}</p>
                    </div>

                    <p className={cx("reward-text")}>{t("EventCardRewardText")}: {currentEvent?.reward}</p>

                    <div className={cx("buttons-container")}>
                        {currentUser?.email === currentEvent?.email ?
                            <>
                                <button className={cx("delete-button", "button")} onClick={deleteHandler}>{t("EventCardDeleteButtonText")}</button>
                            </>
                            :
                            <>
                                <button onClick={sendRequest} className={cx("choose-button", "button")}>
                                    <i className={cx('hear-icon', 'fa-solid', 'fa-solid fa-graduation-cap')}></i>
                                    {isSent ? t("EventDetailsRequestAlreadySentText") :  t("EventDetailsRequestSentText")}
                                </button>

                            </>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}