import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Discussion.module.css';
import { Comment } from './Comment/Comment.jsx'
import { Publication } from './Publication/Publication.jsx';
import { useForumContext } from '../../../contexts/ForumContext';
import * as forumService from '../../../services/forumService.js'
import { useAuthContext } from '../../../contexts/AuthContext.jsx';
import { extractUsernameFromEmail } from '../../../utils/usernameUtils.js'
import { useTranslation } from "react-i18next";


let cx = classNames.bind(styles);

export const Discussion = () => {

    const { currentUser } = useAuthContext();
    const { topicSelect, topicEdit, topicDetails } = useForumContext();
    const { id } = useParams();
    const currentTopic = topicSelect(id);
    const [description, setComment] = useState('');

    const [values, setValues] = useState({
        comment: '',
    });

    const [errors, setErrors] = useState({
        commentError: false,
        guestError: false,
    });

    const {t} = useTranslation();
    const changeHandler = (e) => {

        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));

        setComment(e.target.value);
    }

    const handleComment = (e) => {
        e.preventDefault();

        if (!currentUser) {
            setErrors(state => ({
                ...state,
                [`guestError`]: "Only logged in users can comment!"
            }))
            return;
        }

        if (description == '') {
            setErrors(state => ({
                ...state,
                [`commentError`]: "Empty comment!"
            }))
            return;
        }

        const comment = { comment: { description: description, name: currentUser?.email, ownerId: currentUser.uid } };
        forumService.commentTopic(id, comment, currentTopic.comments)
            .then(comments => topicEdit(id, { ...currentTopic, comments }));

        setComment('');
        setErrors({
            commentError: false,
            guestError: false,
        })
    }

    return (
        <>
            <div className={cx('comments-container')}>
                <div className={cx('comment-post')}>
                    <Publication key={id} topic={currentTopic}></Publication>
                    <div className={cx('comments')}>
                        <h1>{t("DiscussionCommentsText")}</h1>
                        {currentTopic.comments?.length > 0
                            ? currentTopic.comments
                                .map((x, index) => <Comment key={index + 1} comment={x.comment} />)
                            : <h1>{t("DiscussionNoCommentsText")}</h1>}
                    </div>

                </div>
                <div className={cx('comment-form')}>
                    <form id="align-form" onSubmit={handleComment}>
                        <h4>{t("DiscussionLeaveACommentText")}</h4>
                        <div className={cx('form-group')}>
                            <label htmlFor="message">{t("DiscussionMessageText")}</label>
                            <textarea name="message" id="msg" cols="30" rows="5" placeholder={t("DiscussionWriteYourCommentText")} value={description} onChange={changeHandler}></textarea>
                            <span>{errors.guestError}</span>
                            <span>{errors.commentError}</span>
                        </div>
                        <div className={cx('form-group')}>
                            <button>{t("DiscussionPostCommentText")}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}