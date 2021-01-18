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
				console.log(res.data);
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
				<Breadcrumb.Item href="/">
					<HomeOutlined />
				</Breadcrumb.Item>
				<Breadcrumb.Item href="/tat-ca-game">
					<UserOutlined />
					<span>Trang của {userData ? userData.name : 'User'}</span>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Lịch sử đơn hàng</Breadcrumb.Item>
			</Breadcrumb>
			<Table dataSource={data} scroll={{ x: 768 }} loading={loading}>
				<Table.Column
					title="Ngày mua / ID Đơn hàng"
					dataIndex="createdAt"
					key="createdAt"
					render={(value, record) => (
						<p>
							{moment(value).format('LLL')} - {record._id}
						</p>
					)}
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
						<Link to="/">
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

// {/* <Collapse
// 				defaultActiveKey={['0']}
// 				className="site-collapse-custom-collapse"
// 			>
// 				{data.map((order, index) => {
// 					const renderGames = order.games.map((game) => {
// 						return {
// 							key: game._id,
// 							name: game.game.name,
// 							image: game.game.images[0].url,
// 							keygame: game.key.key,
// 							price: game.price,
// 						};
// 					});
// 					const action = (value, record) => {
// 						return (
// 							<Button
// 								type="link"
// 								onClick={() => activeGameByKey(record.keygame)}
// 							>
// 								Kích hoạt
// 							</Button>
// 						);
// 					};
// 					return (
// 						<Collapse.Panel
// 							header={`Mã đơn hàng: ${order._id} - ${moment(
// 								order.createdAt,
// 							).format('LLL')}`}
// 							key={index}
// 							className="site-collapse-custom-panel"
// 						>
// 							<Table
// 								dataSource={renderGames}
// 								pagination={false}
// 								scroll={{ x: 576 }}
// 							>
// 								<Table.Column
// 									title="Hình ảnh game"
// 									dataIndex="image"
// 									width={120}
// 									render={(img) => <Image src={img} width={80} />}
// 								/>
// 								<Table.Column title="Tên Game" dataIndex="name" key="name" />
// 								<Table.Column
// 									title="Giá game"
// 									dataIndex="price"
// 									key="price"
// 									render={(price) => <p>{price.toLocaleString()} VNĐ</p>}
// 								/>
// 								<Table.Column
// 									title="Keygame"
// 									dataIndex="keygame"
// 									key="keygame"
// 								/>
// 								<Table.Column
// 									title=""
// 									dataIndex=""
// 									key=""
// 									render={action}
// 									fixed="right"
// 								/>
// 							</Table>
// 						</Collapse.Panel>
// 					);
// 				})}
// 			</Collapse> */}
