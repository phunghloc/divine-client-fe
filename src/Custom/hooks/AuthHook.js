import { useState, useCallback } from 'react';

export const useAuth = () => {
	const [userData, setUserData] = useState(null);
	const [needLogin, setNeedLogin] = useState(false);

	const login = useCallback((userData) => {
		setUserData({
			...userData,
		});
		if (userData.token) localStorage.setItem('token', userData.token);
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
		setUserData((preCart) => {
			return { ...preCart, balance: newBalance };
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
	};
};
