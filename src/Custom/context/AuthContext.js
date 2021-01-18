import { createContext } from 'react';

export const AuthContext = createContext({
	userData: null,
	needLogin: false,
	setNeedLogin: () => {},
	login: () => {},
	logout: () => {},
	updateCart: () => {},
	updateBalance: () => {},
});
