import classNames from 'classnames/bind';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Topic.module.css';
import { Link } from 'react-router-dom';
import { calculateTime } from '../../../utils/calculateTime';
import { useTranslation } from "react-i18next";


let cx = classNames.bind(styles);

export const Topic = ({ topic }) => {

  const { id, title, subject, name, createdAt } = topic;
  const { t } = useTranslation();

  return (  
    <div className={cx('topic-container')}>
      <h2 className={cx('topic-title')}>{title}</h2>
      <div className={cx('topic-details')}>

        <p className={cx('topic-info')}>
          <strong>{t("ForumSubjectText")}:</strong> <span className="subject">{subject}</span>
        </p>
        <p className={cx('topic-info')}>
          <strong>{t("TopicCreatorText")}:</strong> <span className="creator">{name}</span>
        </p>
        <p className={cx('topic-info')}>
          <strong>{t("TopicPostedBeforeText")}:</strong> <span className="creation-date">{calculateTime(createdAt)}</span>
        </p>
        <div className={cx('see-discussion-container')}>
          <li className={cx('see-discussion')}>
            <Link to={`/discussion/${id}`}>{t("TopicSeeMoreButtonText")}</Link>
          </li>
        </div>
      </div>
    </div>
  );
};


