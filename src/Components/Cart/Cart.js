import React, { useContext } from 'react';
import { Dropdown, Badge, Button, Menu, Empty, Avatar } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

import './Cart.scss';
import { AuthContext } from '../../Custom/context/AuthContext';

const Cart = (props) => {
	const { userData } = useContext(AuthContext);
	const cart = userData ? userData.cart : [];
	const cartOverlay = (
		<Menu
			className="cart-overlay"
			onClick={() => {
				props.history.push('/gio-hang');
			}}
		>
			{cart.map((game) => (
				<Menu.Item key={game.name}>
					<div className="cart-item">
						<Avatar src={game.images[0].url} shape="square" size="large" />
						<p>{game.name.slice(0, 22)}</p>
						<p>{game.price.toLocaleString()} VNĐ</p>
					</div>
				</Menu.Item>
			))}

			<Menu.Item>
				{!cart.length ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="Chưa có sản phẩm nào trong giỏ hàng"
					/>
				) : (
					<div className="cart-item">
						<h3>Tổng cộng:</h3>
						<h3>
							{cart
								.reduce((total, game) => total + game.price, 0)
								.toLocaleString()}
							VNĐ
						</h3>
					</div>
				)}
			</Menu.Item>
		</Menu>
	);
	return (
		<Dropdown overlay={cartOverlay} placement="bottomCenter">
			<Button
				className="cart-btn"
				size="large"
				type="text"
				onClick={() => props.history.push('/gio-hang')}
			>
				<Badge count={cart.length}>
					<ShoppingCartOutlined />
				</Badge>
			</Button>
		</Dropdown>
	);
};

export default withRouter(Cart);
