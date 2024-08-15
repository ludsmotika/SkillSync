import styles from './Publication.module.css';
import classNames from 'classnames/bind';
import { extractUsernameFromEmail } from '../../../../utils/usernameUtils.js'
import { calculateTime } from '../../../../utils/calculateTime';
import { useForumContext } from '../../../../contexts/ForumContext.jsx';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../../../contexts/AuthContext.jsx';
import * as forumService from '../../../../services/forumService.js';
import { useTranslation } from "react-i18next";

let cx = classNames.bind(styles);

export const Publication = ({ topic}) => {

    const { currentUser } = useAuthContext();
    const {id} = useParams();
    const { topicDelete } = useForumContext();
    const {t } = useTranslation();

    const { title, subject, comment, createdAt, name } = topic;
    const navigate = useNavigate();
  
    const onEdit = () => {
        navigate(`/editTopic/${id}`);
    }

    const onDelete = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            forumService.deleteTopic(id)
                .then(() => {
                    topicDelete(id)
                });
            navigate(`/forum`);
        }
    }

    return (
        <>
            <div className={cx('publication-view')}>
                <div className={cx('details')}>
                    <span className={cx('label')}>{t("PublicationTitleText")}:</span>
                    <span className={cx('value')}>{title}</span>
                </div>
                <div className={cx('details')}>
                    <span className={cx('label')}>{t("PublicationCommentText")}:</span>
                    <span className={cx('value')}>{comment}</span>
                </div>
                <div className={cx('details')}>
                    <span className={cx('label')}>{t("ForumSubjectText")}:</span>
                    <span className={cx('value')}>{subject}</span>
                </div>
                <div className={cx('details')}>
                    <span className={cx('label')}>{t("TopicCreatorText")}:</span>
                    <span className={cx('value')}>{name}</span>
                </div>
                <div className={cx('details')}>
                    <span className={cx('label')}>{t("TopicCreationDate")}:</span>
                    <span className={cx('value')}>{calculateTime(createdAt)}</span>
                </div>
                <div className={cx('btn-container')}>
                    {name == extractUsernameFromEmail(currentUser?.email) ?
                        <>
                            <button className={cx('btn-edit')} onClick={onEdit}>Edit</button>
                            <button className={cx('btn-delete')} onClick={onDelete}>Delete</button>
                        </>
                        : <Outlet />
                    }
                </div>
            </div>
        </>
    );
}