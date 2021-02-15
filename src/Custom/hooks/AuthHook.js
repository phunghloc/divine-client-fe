import { useState, useCallback } from 'react';

export const useAuth = () => {
	//TODO userData = {name, balance, _id, avatar, notifications: {unread, list}}
	const [userData, setUserData] = useState(null);
	const [needLogin, setNeedLogin] = useState(false);
	const [notificationsCount, setNotificationsCount] = useState(0);

	const login = useCallback((data) => {
		setUserData({
			...data,
		});
		setNotificationsCount(data.notifications.newNotifications);
		if (data.token) localStorage.setItem('token', data.token);
	}, []);

	const logout = useCallback(() => {
		setUserData(null);
		localStorage.removeItem('token');
	}, []);

	const updateCart = useCallback((newCart) => {
		setUserData((preCart) => {
			return { ...preCart, cart: newCart };
		});
	}, []);

	const updateBalance = useCallback((newBalance) => {
		setUserData((userData) => {
			return { ...userData, balance: newBalance };
		});
	}, []);

	const updateAvatar = useCallback((newAvatar) => {
		setUserData((oldData) => {
			return { ...oldData, avatar: newAvatar };
		});
	}, []);

	return {
		userData,
		login,
		logout,
		updateCart,
		needLogin,
		setNeedLogin,
		updateBalance,
		notificationsCount,
		setNotificationsCount,
		updateAvatar,
	};
};
