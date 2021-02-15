import { createContext } from 'react';

export const AuthContext = createContext({
	userData: null,
	needLogin: false,
	notificationsCount: 0,
	setNotificationsCount: () => {},
	setNeedLogin: () => {},
	login: () => {},
	logout: () => {},
	updateCart: () => {},
	updateBalance: () => {},
	updateNotifications: () => {},
	updateAvatar: () => {},
});
