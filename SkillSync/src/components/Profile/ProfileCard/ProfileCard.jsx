import classNames from 'classnames/bind';
import styles from './ProfileCard.module.css';
import { extractUsernameFromEmail } from '../../../utils/usernameUtils';
import { getProfilePictureByEmail } from '../../../services/userService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


let cx = classNames.bind(styles);

export const ProfileCard = ({ email }) => {
    const [urlPicture, setUrlPicture] = useState('');

    useEffect(() => {
        console.log(email);
        getProfilePictureByEmail(email)
            .then(res => setUrlPicture(res))
            .catch(err => console.log(err));
    }, [email]);

    return (
        <>
            <Link to={`/chat-room/${email}`} className={cx('chat-button')} >
                <div className={cx('card-item')}>
                    <div className={cx('card-image-wrapper')}>
                        {/* <img src={'https://picsum.photos/200/300'} className={cx('card-image')} alt="" /> */}
                        <img src={urlPicture} className={cx('card-image')} alt="" />
                    </div>
                    <div className={cx('card-info')}>
                        {/* <p className={cx('card-info-value')}>User: {extractUsernameFromEmail(event?.email)}</p>S */}
                        <p className={cx('card-info-value')}>{extractUsernameFromEmail(email)}</p>
                    </div>
                </div>
            </Link>
        </>
    );
}