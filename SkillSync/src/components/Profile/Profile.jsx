import classNames from 'classnames/bind';

import * as eventsService from '../../services/eventsService'
import * as chatService from '../../services/chatService'

import styles from './Profile.module.css';
import { ProfileCard } from './ProfileCard/ProfileCard';
import { MiniEventCard } from './MiniEventCard/MiniEventCard';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getProfilePictureByEmail } from '../../services/userService';


let cx = classNames.bind(styles);

export const Profile = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const [urlPicture, setUrlPicture] = useState('');

    useEffect(() => {
        if (currentUser) {
            getProfilePictureByEmail(currentUser.email)
                .then(res => setUrlPicture(res))
                .catch(err => console.log(err));
        }
    });

    useEffect(() => {
        eventsService.getAllEventsForUser(currentUser?.uid)
            .then(res => {
                setMyEvents(res);
            })
            .catch(err => {
                console.log(err);
            })
    }, [currentUser?.uid])

    useEffect(() => {
        chatService.getAllChatRooms()
            .then(res => {
                const userChats = res.filter(chatRoom => chatRoom.users.includes(currentUser?.email));
                setChats(userChats);
            })
            .catch(err => {
                console.log(err);
            });
    }, [currentUser?.email]);

    return (
        <>
            <div className={cx("header-container")}>
        <h3 className={cx("my-profile-title")}>My profile</h3>
                <div className={cx("my-profile-info")}>
                    <img className={cx("icon")} src={urlPicture} />
                    <h3>{currentUser?.email}</h3>
                </div>
            </div>

            <div className={cx('profile-wrapper')}>
                <section className={cx('profile-card-wrapper')}>
                    <h3>Chats</h3>
                    {chats.map((chat) => (
                        <ProfileCard key={chat.id} email={chat.users[0] === currentUser?.email ? chat.users[1] : chat.users[0]} />
                    ))}
                </section>

                <div className={cx("outer")}>
                    <h3>My events</h3>
                    <section className={cx('my-events-wrapper')}>
                        {myEvents.map((e, index) => <MiniEventCard key={index} event={e} />)}
                    </section>
                </div>
            </div>
        </>
    )
}