import { useEffect } from 'react';
import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import axios from './axios-constain';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar';

import page404 from './Pages/404/404';
import Redeem from './Pages/Redeem/Redeem';
import Account from './Pages/Account/Account';
import EditAccount from './Pages/Account/Edit';
import Homepage from './Pages/Homepage/Homepage';
import CartPage from './Pages/CartPage/CartPage';
import Community from './Pages/Community/Community';
import OrderPage from './Pages/OrderPage/OrderPage';
import DetailGame from './Pages/DetailGame/DetailGame';
import DetailOrder from './Pages/DetailOrder/DetailOrder';

import { useAuth } from './Custom/hooks/AuthHook';
import { AuthContext } from './Custom/context/AuthContext';

function App() {
	const useAuthObj = useAuth();
	const { login } = useAuthObj;

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			axios
				.get('/auth/auto-login', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					login(res.data);
				})
				.catch((err) => {
					// console.log(err.response);
					localStorage.removeItem('token');
				});
		}
	}, [login]);
	return (
		<AuthContext.Provider value={{ ...useAuthObj }}>
			<Layout className="layout">
				<Header />
				<Navbar />
				<Switch>
					<Route path="/detail-game/:gameId" component={DetailGame} />
					<Route path="/lich-su" component={OrderPage} />
					<Route path="/tai-khoan/chinh-sua" component={EditAccount} />
					<Route path="/tai-khoan/:userId" component={Account} />
					<Route path="/tai-khoan/" component={Account} />
					<Route path="/doi-ma/" component={Redeem} />
					<Route path="/cong-dong/:postId" component={Community} />
					<Route path="/cong-dong/" component={Community} />
					<Route path="/don-hang/:orderId" component={DetailOrder} />
					<Route path="/gio-hang" component={CartPage} />
					<Route path="/" exact component={Homepage} />
					<Route path="404" component={page404} />
					<Route component={page404} />
				</Switch>

				<Footer />
			</Layout>
		</AuthContext.Provider>
	);
}

export default App;
