import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ImageSlider } from "../ImageSlider/ImageSlider";
import classNames from 'classnames/bind';
import homeStyles from './Home.module.css';
import { getProfilePictureByEmail } from '../../services/userService';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { useEventsContext } from '../../contexts/EventsContext';
//import { EventCard } from '../Events/EventCard/EventCard';

let cx = classNames.bind(homeStyles);

export const Home = () => {
    const { t } = useTranslation();

    const { events } = useEventsContext(); 
    const filteredEvents = events.filter(event => !event.teacherEmail).slice(0, 3);

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [urlPicture, setUrlPicture] = useState('');

    useEffect(() => {
        if (currentUser) {
            getProfilePictureByEmail(currentUser.email)
                .then(res => setUrlPicture(res))
                .catch(err => console.log(err));
        }
    });

    const slides = [
        { url: "https://firebasestorage.googleapis.com/v0/b/skillsync-fd0a1.appspot.com/o/images%2FFirstSliderImage.png?alt=media&token=9ed7abb3-a8a3-4cd8-a663-c19d1cfb4770", title: "AI generated inovative collaboration learning image" },
        { url: "https://firebasestorage.googleapis.com/v0/b/skillsync-fd0a1.appspot.com/o/images%2FSecondSliderImage.jpg?alt=media&token=24981b92-fb38-4162-b44a-f9afce586111", title: "collaboration learning" },
        { url: "https://firebasestorage.googleapis.com/v0/b/skillsync-fd0a1.appspot.com/o/images%2FThirdSliderImage.jpg?alt=media&token=a408a1a0-5515-488d-9b9e-0b25f4c310fb", title: "online meeting" },
    ];

    return (
        <div className={cx('home-main-container')}>
            <div className={cx("home-header")}>
                <p className={cx("home-header-title")}>SkillSync</p>
                <div className={cx("float-right-container")}>
                    <ul>
                        {
                            currentUser
                                ?
                                <div className={cx("home-header-profile")}>
                                    <img className={cx("icon")} src={urlPicture} />
                                    <p>{currentUser.email}</p>
                                </div>
                                :
                                <div className={cx("home-header-nav")}>
                                    <li className={cx("home-header-nav-item")}>
                                        <Link to="/register">{t("RegisterButtonText")}</Link>
                                    </li>
                                    <li className={cx("home-header-nav-item")}>
                                        <Link to="/login">{t("LoginButtonText")}</Link>
                                    </li>
                                </div>
                        }
                    </ul>
                    <LanguageSelector/>
                </div>
            </div>

            <div className={cx("container")}>
                <ImageSlider slides={slides} />
            </div>
            {/* <div className={cx('event-wrapper')}>
            {
                            currentUser
                                ?
                                <>{filteredEvents.map((e, index) => <EventCard key={index} event={e} />)}</>
                                :
                                <h3>Login in to see latest requests</h3>
                        }
            </div> */}
        </div>
    )
}