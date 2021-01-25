import React, { useContext, useEffect, useState } from 'react';
import { Layout, List, Avatar, Button, Tag, Modal, Breadcrumb } from 'antd';
import { Link, Redirect, useParams } from 'react-router-dom';
import {
	QuestionCircleOutlined,
	HomeOutlined,
	UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';

import './DetailOrder.scss';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';

moment.locale('vi');

export default function DetailOrder() {
	const { orderId } = useParams();
	const { userData } = useContext(AuthContext);

	const [blur, setBlur] = useState([]);
	const [order, setOrder] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [activatedList, setActivatedList] = useState({});
	const [errorWhenActivate, setErrorWhenActivate] = useState(null);
	const [loadingWhenActivate, setLoadingWhenActivate] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setErrorWhenActivate(null);
		const token = localStorage.getItem('token');
		if (token) {
			axios
				.get(`/order/${orderId}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					setOrder(res.data.order);
					setActivatedList(res.data.activatedList);
					setBlur(Array(res.data.order.games.length).fill(true));
				})
				.catch((err) => {
					console.log(err);
					console.log(err.response);
					setErrorWhenActivate(err.response);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [orderId, userData]);

	const toggleBlur = (index) => {
		const newBlur = [...blur];
		newBlur[index] = !newBlur[index];
		setBlur(newBlur);
	};

	const successNotification = (name) => {
		Modal.success({
			title: 'Kích hoạt thành công',
			content: (
				<p>
					Kích hoạt thành công game{' '}
					<span style={{ color: '#613400', fontWeight: 500, fontSize: 16 }}>
						{name}
					</span>
					!
				</p>
			),
			okText: 'Xác nhận',
		});
	};

	const confirmNotification = (item, index) => {
		Modal.confirm({
			title: 'Xác nhận hành động',
			icon: <QuestionCircleOutlined />,
			content: (
				<p>
					Bạn có muốn kích hoạt game{' '}
					<span style={{ color: '#613400', fontWeight: 500, fontSize: 16 }}>
						{item.game.name}
					</span>{' '}
					cho tài khoản của mình không?
				</p>
			),
			onOk() {
				activatedHandler(item, index);
			},
			okText: 'Đồng ý',
			cancelText: 'Hủy bỏ',
		});
	};

	const activatedHandler = (item, index) => {
		const keygame = item.keygame.key;
		const token = localStorage.getItem('token');
		setLoadingWhenActivate(true);
		setErrorWhenActivate(null);

		axios
			.post(
				'/activate-by-key',
				{ keygame },
				{ headers: { Authorization: `Bearer ${token}` } },
			)
			.then((res) => {
				successNotification(item.game.name);
				const newGames = [...order.games];
				newGames[index].keygame = res.data.keygame;
				setOrder((prev) => {
					return { ...prev, games: newGames };
				});
				setActivatedList((prev) => {
					return { ...prev, [res.data.gameId]: true };
				});
			})
			.catch((err) => {
				console.log(err);
				setErrorWhenActivate(err.response);
			})
			.finally(() => {
				setLoadingWhenActivate(false);
			});
	};

	if (!userData && !localStorage.getItem('token')) {
		console.log(error);
		return <Redirect to="/" />;
	}

	return (
		<Layout.Content className="container detail-order">
			<Breadcrumb>
				<Breadcrumb.Item href="/">
					<HomeOutlined />
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/tai-khoan">
						<UserOutlined />
						<span>Trang của {userData ? userData.name : 'User'}</span>
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/lich-su">Lịch sử giao dịch</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Chi tiết đơn hàng</Breadcrumb.Item>
			</Breadcrumb>
			{!!errorWhenActivate && (
				<ErrorModal
					visible={!!errorWhenActivate}
					setError={setErrorWhenActivate}
					errorText={errorWhenActivate.data.message}
				/>
			)}
			{!!order && (
				<List
					header={moment(order.createdAt).format('LLLL')}
					className="list"
					loading={loading}
					itemLayout="horizontal"
					dataSource={order.games}
					renderItem={(item, index) => {
						const isActivated = !!item.keygame.activatedBy;
						const gameId = item.game._id;
						return (
							<List.Item
								actions={[
									<Button
										key="link"
										type="primary"
										size="large"
										disabled={isActivated || activatedList[gameId]}
										loading={loadingWhenActivate}
										onClick={() => confirmNotification(item, index)}
									>
										Kích hoạt
									</Button>,
								]}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											shape="square"
											size={{
												xs: 40,
												sm: 56,
												md: 64,
												lg: 80,
												xl: 90,
												xxl: 100,
											}}
											src={item.game.images[0].url}
										/>
									}
									title={
										<Link to={`/detail-game/${gameId}`}>
											{item.game.name}{' '}
											{activatedList[gameId] && (
												<Tag color="gold">Đã sở hữu</Tag>
											)}
											{isActivated ? (
												<Tag color="red">Đã kích hoạt</Tag>
											) : (
												<Tag color="green">Có thể kích hoạt</Tag>
											)}
										</Link>
									}
									description={
										<h4>
											Keygame:{' '}
											<span
												style={{ cursor: 'pointer', marginLeft: '1rem' }}
												className={blur[index] ? 'blur' : ''}
												onClick={() => {
													toggleBlur(index);
												}}
											>
												{item.keygame.key}
											</span>
										</h4>
									}
								/>
							</List.Item>
						);
					}}
				/>
			)}
		</Layout.Content>
	);
}
