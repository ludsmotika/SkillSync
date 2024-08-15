import React, { useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Forum.module.css';
import { Topic } from './Topic/Topic';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ForumContext } from '../../contexts/ForumContext';
import { useTranslation } from 'react-i18next';


let cx = classNames.bind(styles);

export const Forum = () => {

    const { topics } = useContext(ForumContext);
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [subjects, setSubjects] = useState([]);

    useEffect(() => { setSubjects(getAllSubjects(topics)) }, [topics]);

    function getAllSubjects(topicsArray) {
        const subjectsSet = [];
        let i = 0;
        topicsArray.forEach(topic => {
            if (!subjectsSet.includes(topic.subject)) {
                subjectsSet[i++] = topic.subject;
            }
        });
        return subjectsSet;
    }

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredTopics = topics.filter((topic) =>
        (selectedSubject === 'all' || topic?.subject.toLowerCase() === selectedSubject.toLowerCase()) &&
        topic?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={cx('forum')}>
            <div className={cx('forum-heading')}>
                <h1 className={cx('forum-heading-title')}>
                    {t("ForumWelcomeText")}
                </h1>

                <div className={cx('forum-search')}>
                    <label>{t("ForumSearchText")}</label>
                    <input
                        className={cx('forum-topics-search')}
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className={cx('select-dropdown')}>
                    <label>{t("ForumSubjectText")}</label>
                    <select
                        className={cx('select-subject')}
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                    >
                        <option key={0} value = "all">
                            {t("AllSubjectsOption")}
                        </option>
                        {subjects?.map((subject, index) => (
                            <option key={index + 1} value={subject.toLowerCase()}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>

                <li className={cx('create-topic')}>
                    <i className={cx('header-icon', 'fa-solid', 'fa-play')}></i>
                    <Link to="/createTopic">{t("ForumCreateTopicButtonText")}</Link>
                </li>
            </div>
            <div className={cx('topics-container')}>
                {filteredTopics?.map((filteredTopic, index) => (
                    <Topic key={index} topic={filteredTopic} />
                ))}
            </div>
        </div>
    );
};

