import { createContext } from 'react';

export const AuthContext = createContext({
	userData: null,
	needLogin: false,
	socket: null,
	setNeedLogin: () => {},
	login: () => {},
	logout: () => {},
	updateCart: () => {},
	updateBalance: () => {},
});
