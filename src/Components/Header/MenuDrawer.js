import React, { useContext, useEffect, useState } from 'react';
import { Button, Drawer, Menu, Avatar, Badge } from 'antd';
import {
	MenuOutlined,
	UserOutlined,
	ShoppingCartOutlined,
	BellOutlined,
} from '@ant-design/icons';
import { NavLink, Link } from 'react-router-dom';

import logoFlat from '../../assets/images/logo-1.png';
import logoCircle from '../../assets/images/logo_divine_pure_white.png';

import { navlinks } from '../Navbar/Navlinks';
import { AuthContext } from '../../Custom/context/AuthContext';

export default function MenuDrawer(props) {
	const { setNeedLogin, userData, logout, notificationsCount } = useContext(
		AuthContext,
	);
	const [visible, setVisible] = useState(false);
	const [totalNotifications, setTotalNotifications] = useState(0);

	useEffect(() => {
		if (userData) {
			setTotalNotifications(userData.cart.length + notificationsCount);
		} else {
			setTotalNotifications(0);
		}
	}, [userData, notificationsCount]);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	const openLoginModal = () => {
		setNeedLogin(true);
		setVisible(false);
	};

	const header = (
		<Link className="logo-link" to="/" onClick={onClose}>
			<img src={logoCircle} alt="Logo Divine" style={{ height: 56 }} />
			<img src={logoFlat} alt="Logo Divine" />
		</Link>
	);

	return (
		<>
			<Button
				size="large"
				type="link"
				className="menu-mobile-btn"
				onClick={showDrawer}
			>
				<Badge count={totalNotifications}>
					<MenuOutlined />
				</Badge>
			</Button>
			<Drawer
				title={header}
				placement="left"
				onClose={onClose}
				visible={visible}
				closable={false}
				width={320}
				headerStyle={{ backgroundColor: '#4267b2' }}
				className="drawer-mobile" // css in app.scss
			>
				<Menu
					mode="inline"
					defaultSelectedKeys={['/']}
					selectedKeys={[]}
					onClick={onClose}
				>
					{navlinks.map((nav) => (
						<Menu.Item key={nav.link} icon={nav.icon}>
							<NavLink to={nav.link} exact={nav.exact}>
								{nav.title}
							</NavLink>
						</Menu.Item>
					))}
					<Menu.Divider />
					<Menu.Item icon={<ShoppingCartOutlined />}>
						<NavLink to="/gio-hang" exact>
							Giỏ hàng <Badge count={userData ? userData.cart.length : 0} />
						</NavLink>
					</Menu.Item>
					<Menu.Divider />
					{!userData && (
						<Menu.Item icon={<UserOutlined />} onClick={openLoginModal}>
							Đăng nhập
						</Menu.Item>
					)}
					{!!userData && (
						<Menu.Item icon={<BellOutlined />}>
							<NavLink to="/thong-bao">
								Thông báo <Badge count={notificationsCount} />
							</NavLink>
						</Menu.Item>
					)}
					{!!userData && (
						<Menu.SubMenu
							key="sub2"
							icon={<Avatar src={userData.avatar} alt="avatar" />}
							title={userData.name}
						>
							<Menu.Item>
								<NavLink to="/tai-khoan/">Thông tin tài khoản</NavLink>
							</Menu.Item>
							<Menu.Item>
								<NavLink to="/doi-ma/">Đổi mã keygame</NavLink>
							</Menu.Item>
							<Menu.Item>
								<NavLink to="/lich-su">Lịch sử giao dịch</NavLink>
							</Menu.Item>
							<Menu.Item danger onClick={logout}>
								Đăng xuất
							</Menu.Item>
						</Menu.SubMenu>
					)}
				</Menu>
			</Drawer>
		</>
	);
}
