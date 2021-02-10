import React, { useContext, useState, useEffect } from 'react';
import { Button, Badge, Menu, Dropdown, Avatar } from 'antd';
import { BellOutlined, WalletTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import OpenSocket from 'socket.io-client';

import './Login.scss';
import Cart from '../Cart/Cart';
import CashFormModal from './CashFormModal';
import { AuthContext } from '../../Custom/context/AuthContext';

const UserLogined = () => {
	const [visibleCashForm, setVisibleCashForm] = useState(false);
	const { userData, logout } = useContext(AuthContext);

	useEffect(() => {
		const socket = OpenSocket(process.env.REACT_APP_BASE_URL, {
			auth: {
				userId: userData.userId,
			},
		});
		console.log('socket in header ', socket);
		return () => {
			socket.emit('logout');
		};
	}, [userData.userId]);

	const menu = <Menu className="user-menu"></Menu>;
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
			<Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
				<Button type="link" size="large">
					<Badge count={1}>
						<BellOutlined className="notify-button" />
					</Badge>
				</Button>
			</Dropdown>
			<Dropdown overlay={menuAccount} placement="bottomCenter">
				<Button type="link" size="large" className="btn-link">
					<Avatar src={userData.avatar} />
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

export default UserLogined;
