import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Button, Badge, Menu, Dropdown, Avatar, notification } from 'antd';
import { BellOutlined, WalletTwoTone } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import OpenSocket from 'socket.io-client';

import './Login.scss';
import Cart from '../Cart/Cart';
import CashFormModal from './CashFormModal';
import { AuthContext } from '../../Custom/context/AuthContext';
import axios from '../../axios-constain';
import NotificationsDropDown from './NotificationsDropDown';

const UserLogined = (props) => {
	const [visibleCashForm, setVisibleCashForm] = useState(false);
	const [loadingNotifications, setLoadingNotifications] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [hasFirstFetch, setHasFirstFetch] = useState(false);
	const [visibleNoti, setVisibleNoti] = useState(false);
	const {
		userData,
		logout,
		notificationsCount,
		setNotificationsCount,
	} = useContext(AuthContext);


	const openNotification = useCallback((type, data) => {
		let action = 'thích bài đăng';
		let description = `"${data.content}..."`;
		let url;

		switch (type) {
			case 'like post':
				action = 'thích bài đăng của bạn.';
				description = `"${data.content}..."`;
				url = `/cong-dong/${data.postId}`;
				break;

			case 'comment post':
				action = 'bình luận bài đăng bạn đang theo dõi.';
				description = `"${data.content}..."`;
				url = `/cong-dong/${data.postId}`;
				break;

			case 'reply game':
				action = 'trả lời bình luận trong game bạn đang theo dõi.';
				description = `"${data.game.name}"`;
				url = `/detail-game/${data.game.gameId}`;
				break;

			default:
				break;
		}

		notification.open({
			message: (
				<span>
					<strong>{data.user.name}</strong> đã {action}
				</span>
			),
			description,
			placement: 'bottomLeft',
			icon: <Avatar alt="avatar user" src={data.user.avatar} />,
			duration: 10,
			key: Math.random(),
			closeIcon: null,
			style: {
				borderRadius: 5,
				boxShadow: '0 0 20px #ccc',
				cursor: 'pointer',
			},
			onClick() {
				props.history.push(url);
			},
		});
	}, [props]);

	useEffect(() => {
		const socket = OpenSocket(process.env.REACT_APP_BASE_URL, {
			auth: {
				userId: userData.userId,
			},
		});

		socket.on('like post', (likeData) => {
			openNotification('like post', likeData);

			setNotificationsCount((oldCount) => oldCount + 1);
		});

		socket.on('comment post', (postData) => {
			openNotification('comment post', postData);

			setNotificationsCount((oldCount) => oldCount + 1);
		});

		socket.on('reply game', (replyData) => {
			openNotification('reply game', replyData);

			setNotificationsCount((oldCount) => oldCount + 1);
		});

		return () => {
			socket.emit('logout');
		};
	}, [userData.userId, setNotificationsCount, openNotification]);

	const openNotificationsDropdown = () => {
		// Nếu có notifications mới hoặc chưa fetch lần nào thì sẽ fetch notifications
		if (!visibleNoti) {
			if (userData.notifications.newNotifications || !hasFirstFetch) {
				setLoadingNotifications(true);
				setNotifications([]);
				const token = localStorage.getItem('token');
				axios
					.get('/auth/get-notifications', {
						headers: { Authorization: `Bearer ${token}` },
					})
					.then((res) => {
						setHasFirstFetch(true);
						setNotifications(res.data.notifications.reverse());
					})
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						setLoadingNotifications(false);
					});
			}
		}
		setVisibleNoti((pre) => !pre);
	};

	const markAsReadHandler = (index, url) => {
		props.history.push(url);

		if (notifications[index].hasRead) return;

		let notifyId;
		setNotifications((notifications) => {
			const newNotifications = [...notifications];
			newNotifications[index].hasRead = true;
			notifyId = newNotifications[index]._id;
			return newNotifications;
		});

		const token = localStorage.getItem('token');
		axios.get(`/auth/mark-as-read-notification/${notifyId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	};

	const menuAccount = (
		<Menu className="user-menu">
			<Menu.Item className="user-menu-balance">
				<div>
					<h2>Số dư tài khoản</h2>
					<h3>
						<WalletTwoTone twoToneColor="#52c41a" />
						{'  ' + userData.balance.toLocaleString()}VNĐ
					</h3>
				</div>
				<Button
					type="primary"
					size="large"
					onClick={() => setVisibleCashForm(true)}
				>
					Nạp thêm
				</Button>
			</Menu.Item>
			<Menu.Item>
				<Link to="/tai-khoan/">Thông tin tài khoản</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/doi-ma/">Đổi mã keygame</Link>
			</Menu.Item>

			<Menu.Item>
				<Link to="/lich-su">Lịch sử giao dịch</Link>
			</Menu.Item>

			<Menu.Item danger onClick={logout}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);

	return (
		<div className="user-group desktop-screen">
			<div className="notify-btn">
				<Button type="link" size="large" onClick={openNotificationsDropdown}>
					<Badge count={notificationsCount}>
						<BellOutlined className="notify-button" />
					</Badge>
				</Button>
				{visibleNoti && (
					<NotificationsDropDown
						loading={loadingNotifications}
						notifications={notifications}
						setVisibleNoti={setVisibleNoti}
						markAsReadHandler={markAsReadHandler}
						setNotificationsCount={setNotificationsCount}
					/>
				)}
			</div>
			<Dropdown overlay={menuAccount} placement="bottomCenter">
				<Button
					type="link"
					size="large"
					className="btn-link"
					icon={<Avatar src={userData.avatar} />}
				>
					{userData.name}
				</Button>
			</Dropdown>
			<Cart />
			<CashFormModal
				visibleCashForm={visibleCashForm}
				setVisibleCashForm={setVisibleCashForm}
			/>
		</div>
	);
};

export default withRouter(UserLogined);
