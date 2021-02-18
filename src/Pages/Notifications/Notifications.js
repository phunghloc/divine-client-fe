import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Button, Layout } from 'antd';
import { Redirect } from 'react-router-dom';

import './Notifications.scss';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';
import NotificationsDropDown from '../../Components/Login/NotificationsDropDown';

export default function Notifications(props) {
	const { userData, setNotificationsCount } = useContext(AuthContext);
	const [token] = useState(localStorage.getItem('token'));
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [disable, setDisable] = useState(false);

	const fetchNotification = useCallback(
		(page = 1) => {
			axios
				.get(`/auth/get-notifications?page=${page}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					setNotifications((pre) => {
						const newNoti = res.data.notifications
							.reverse()
							.filter((noti) => !pre.some((n) => n._id === noti._id));
						if (newNoti.length < 8) setDisable(true);
						return [...pre, ...newNoti];
					});
					setNotificationsCount(0);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		},
		[setNotificationsCount, token],
	);

	useEffect(() => {
		if (token) {
			setLoading(true);
			fetchNotification(page);
		}
	}, [token, setNotificationsCount, fetchNotification, page]);

	const markAsReadHandler = (index, url) => {
		props.history.push(url);

		if (notifications[index].hasRead) return;

		const token = localStorage.getItem('token');
		axios.get(`/auth/mark-as-read-notification/${notifications[index]._id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	};

	const loadMoreHandler = () => {
		setPage((page) => page + 1);
	};

	if (!userData && !token) {
		return <Redirect to="/" />;
	}

	return (
		<Layout.Content className="container">
			<h1>Tất cả thông báo</h1>
			<NotificationsDropDown
				loading={loading}
				notifications={notifications}
				setVisibleNoti={() => {}}
				markAsReadHandler={markAsReadHandler}
				desktopSize
				className="notifications-dropdown"
				footer={
					<Button type="link" disabled={disable} onClick={loadMoreHandler}>
						Tải thêm thông báo
					</Button>
				}
			/>
		</Layout.Content>
	);
}
