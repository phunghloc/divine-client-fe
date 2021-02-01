import { useState, useCallback } from 'react';
// import OpenSocket from 'socket.io-client';

export const useAuth = () => {
	const [userData, setUserData] = useState(null);
	const [needLogin, setNeedLogin] = useState(false);
	// const [socket, setSocket] = useState(null);

	// useEffect(() => {
	// 	setSocket(OpenSocket(process.env.REACT_APP_BASE_URL));
	// }, []);

	// useEffect(() => {
	// 	if (socket) {
	// 		if (userData) {
	// 			console.log('login success')
	// 			socket.emit('login success', userData.userId);
	// 		} else {
	// 			socket.emit('logout');
	// 		}
	// 	}
	// }, [userData, socket]);

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
		// socket,
	};
};
