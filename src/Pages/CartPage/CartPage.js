import React, { useContext, useState, useEffect } from 'react';
import {
	Layout,
	Breadcrumb,
	Result,
	Button,
	Table,
	Image,
	Row,
	Col,
	Statistic,
	Tooltip,
	Spin,
	Tag,
} from 'antd';
import {
	HomeOutlined,
	HistoryOutlined,
	CheckCircleFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './CartPage.scss';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';

export default function CartPage() {
	const [loading, setLoading] = useState(false);
	const [loadingGetCart, setLoadingGetCart] = useState(false);
	const [cart, setCart] = useState([]);
	const [error, setError] = useState(null);
	const [successPurchase, setSuccessPurchase] = useState(false);
	const { userData, updateCart, updateBalance } = useContext(AuthContext);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setLoadingGetCart(true);
			setError(null);
			axios
				.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
				.then((res) => {
					const cart = res.data.cart.map((item) => {
						return { ...item, images: item.images[0].url, key: item._id };
					});
					setCart(cart);
				})
				.catch((err) => {
					console.log(err);
					const errorText = err.response
						? err.response.data.message
						: 'Có lỗi không xác định xảy ra!';
					setError(errorText);
				})
				.finally(() => {
					setLoadingGetCart(false);
				});
		}
	}, []);

	const removeItemFromCart = (index) => {
		setLoading(true);
		setError(null);

		const id = cart[index]._id;
		const token = localStorage.getItem('token');

		axios
			.delete(`/delete-cart-item/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				const newCart = [...userData.cart];
				newCart.splice(index, 1);
				updateCart(newCart);

				const newRenderCart = [...cart];
				newRenderCart.splice(index, 1);
				setCart(newRenderCart);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				setError(errorText);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const postPurchaseGame = () => {
		setLoading(true);
		setError(null);
		const games = cart.map((game) => game._id);
		const token = localStorage.getItem('token');
		axios
			.post(
				'/purchase',
				{ games },
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			)
			.then((res) => {
				updateBalance(res.data.newBalance);
				updateCart([]);
				setCart([]);
				setSuccessPurchase(true);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				setError(errorText);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const TOTAL_PRICE = cart.reduce((total, item) => total + item.price, 0);
	const BALANCE_AFTER_PURCHASE = userData ? userData.balance - TOTAL_PRICE : 0;

	return (
		<Layout.Content className="container cart-page">
			<Breadcrumb style={{ marginBottom: '1rem' }}>
				<Breadcrumb.Item>
					<Link to="/">
						<HomeOutlined />
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Giỏ hàng của bạn</Breadcrumb.Item>
			</Breadcrumb>
			<Spin spinning={loadingGetCart} tip="Đang tải dữ liệu">
				{!!error && (
					<ErrorModal visible={!!error} setError={setError} errorText={error} />
				)}

				{!!cart.length && (
					<Row gutter={[12, 12]}>
						<Col lg={16} xs={24}>
							<Table dataSource={cart} pagination={false} scroll={{ x: 576 }}>
								<Table.Column
									title="Hình ảnh game"
									dataIndex="images"
									key="images"
									width={150}
									render={(image) => <Image src={image} width={120} />}
								/>
								<Table.Column
									title="Tên game"
									dataIndex="name"
									key="name"
									render={(name, itSelf) => (
										<Link to={`/detail-game/${itSelf._id}`}>{name}</Link>
									)}
								/>
								<Table.Column
									title="Tình trạng"
									dataIndex="owned"
									key="owned"
									render={(owned) =>
										owned ? (
											<Tag color="gold" icon={<CheckCircleFilled />}>
												Đã sở hữu
											</Tag>
										) : null
									}
								/>
								<Table.Column
									title=""
									key="price"
									dataIndex="price"
									width={120}
									fixed="right"
									render={(price, record, index) => (
										<>
											<h4>{price.toLocaleString()} VNĐ</h4>
											<Button
												loading={loading}
												type="link"
												onClick={() => {
													removeItemFromCart(index);
												}}
											>
												Xóa bỏ
											</Button>
										</>
									)}
								/>
							</Table>
						</Col>
						<Col lg={8} xs={24} className="purchase">
							<div className="purchase-container">
								<Statistic
									suffix="VNĐ"
									value={TOTAL_PRICE}
									title="Tổng thanh toán"
								/>
								<Statistic
									suffix="VNĐ"
									title="Số dư tài khoản"
									value={userData ? userData.balance : 0}
								/>
								<Statistic
									suffix="VNĐ"
									title="Số dư còn lại"
									value={BALANCE_AFTER_PURCHASE}
									valueStyle={{
										color: BALANCE_AFTER_PURCHASE >= 0 ? 'green' : 'red',
									}}
								/>
								<Tooltip
									placement="bottom"
									title={
										BALANCE_AFTER_PURCHASE >= 0
											? 'Bạn có thể tiến hành thanh toán'
											: 'Tài khoản không đủ để thực hiện thanh toán, vui lòng nạp thêm vào tài khoản.'
									}
								>
									<Button
										block
										size="large"
										onClick={postPurchaseGame}
										loading={loading}
										disabled={BALANCE_AFTER_PURCHASE < 0}
									>
										Thanh Toán
									</Button>
								</Tooltip>
							</div>
						</Col>
					</Row>
				)}
				{successPurchase && !cart.length && (
					<Result
						status="success"
						title="Thanh toán thành công."
						subTitle="Truy cập vào trang lịch sử đơn hàng của bạn để nhận keygame nhé :)"
						extra={[
							<Link to="/" key="home">
								<Button type="primary" icon={<HomeOutlined />}>
									Trang chủ
								</Button>
							</Link>,
							<Link to="/lich-su" key="history">
								<Button type="primary" icon={<HistoryOutlined />} danger>
									Lịch sử
								</Button>
							</Link>,
						]}
					/>
				)}
				{!successPurchase && !cart.length && (
					<Result
						status="404"
						title="Giỏ hàng trống"
						subTitle="Quay lại trang chủ đặt vài game nhé :)"
						extra={
							<Link to="/">
								<Button type="primary">Quay lại trang chủ</Button>
							</Link>
						}
					/>
				)}
			</Spin>
		</Layout.Content>
	);
}
