import React, { useEffect, useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Layout, Table, Button, Breadcrumb, List, Avatar } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';

import './OrderPage.scss';
import axios from '../../axios-constain';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';
import { AuthContext } from '../../Custom/context/AuthContext';

moment.locale('vi');

export default function OrderPage() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { userData } = useContext(AuthContext);
	useEffect(() => {
		setLoading(true);
		const token = localStorage.getItem('token');
		axios
			.get('/orders', { headers: { Authorization: `Bearer ${token}` } })
			.then((res) => {
				setData(res.data.orders);
			})
			.catch((err) => {
				console.log(err);
				setError(err.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (!localStorage.getItem('token')) {
		return <Redirect to="/" />;
	}

	return (
		<Layout.Content className="container">
			{!!error && (
				<ErrorModal
					visible={!!error}
					errorText={error.data.message}
					setError={setError}
				/>
			)}
			<Breadcrumb>
				<Breadcrumb.Item>
					<Link to="/">
						<HomeOutlined />
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					<Link to="/tai-khoan">
						<UserOutlined />
						<span>Trang của {userData ? userData.name : 'User'}</span>
					</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Lịch sử đơn hàng</Breadcrumb.Item>
			</Breadcrumb>
			<Table dataSource={data} scroll={{ x: 768 }} loading={loading}>
				<Table.Column
					title="Ngày mua"
					dataIndex="createdAt"
					key="createdAt"
					width={120}
					render={(value, record) => <p>{moment(value).format('L')}</p>}
				/>
				<Table.Column
					title="Các game"
					render={(value, record) => (
						<List
							itemLayout="horizontal"
							dataSource={record.games}
							renderItem={(game) => (
								<List.Item>
									<List.Item.Meta
										avatar={
											<Avatar
												src={game.game.images[0].url}
												shape="square"
												size="large"
											/>
										}
										title={
											<Link to={`/detail-game/${game.game._id}`}>
												{game.game.name}
											</Link>
										}
									/>
								</List.Item>
							)}
						/>
					)}
				/>
				<Table.Column
					title="Tổng giá trị đơn hàng"
					dataIndex=""
					render={(value, record) => (
						<h4>
							{record.games
								.reduce((total, game) => total + game.price, 0)
								.toLocaleString()}{' '}
							VNĐ
						</h4>
					)}
				/>
				<Table.Column
					title="Chi tiết"
					dataIndex=""
					render={(value, record) => (
						<Link to={`/don-hang/${record._id}`}>
							<Button type="primary">Xem chi tiết</Button>
						</Link>
					)}
					width={140}
					fixed="right"
				/>
			</Table>
		</Layout.Content>
	);
}
