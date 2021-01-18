import React, { useContext, useState } from 'react';
import { Button, Badge, Menu, Dropdown } from 'antd';
import { BellOutlined, WalletTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './Login.scss';
import { AuthContext } from '../../Custom/context/AuthContext';
import CashFormModal from './CashFormModal';

const UserLogined = () => {
	const [visibleCashForm, setVisibleCashForm] = useState(false);
	const { userData, logout } = useContext(AuthContext);
	const menu = (
		<Menu className="user-menu">
			<Menu.Item>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="http://www.alipay.com/"
				>
					1st menu item
				</a>
			</Menu.Item>
			<Menu.Item>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="http://www.taobao.com/"
				>
					2nd menu item
				</a>
			</Menu.Item>
			<Menu.Item>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="http://www.tmall.com/"
				>
					3rd menu item
				</a>
			</Menu.Item>
			<Menu.Item danger>a danger item</Menu.Item>
		</Menu>
	);
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
			<Menu.Item>Thông tin tài khoản</Menu.Item>

			<Menu.Item>
				<Link to="/don-hang">Lịch sử đơn hàng</Link>
			</Menu.Item>

			<Menu.Item danger onClick={logout}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);

	return (
		<div className="user-group">
			<Dropdown overlay={menu} placement="bottomCenter">
				<Button type="link" size="large">
					<Badge count={1}>
						<BellOutlined className="notify-button" />
					</Badge>
				</Button>
			</Dropdown>
			<Dropdown overlay={menuAccount} placement="bottomCenter">
				<Button type="link" size="large" className="btn-link">
					{userData.name}
				</Button>
			</Dropdown>
			<CashFormModal
				visibleCashForm={visibleCashForm}
				setVisibleCashForm={setVisibleCashForm}
			/>
		</div>
	);
};

export default UserLogined;
