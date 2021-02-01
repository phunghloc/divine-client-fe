import React, { useContext, useEffect, useState } from 'react';
import {
	Layout,
	Row,
	Col,
	Card,
	Button,
	Typography,
	Image,
	Statistic,
	Spin,
	Result,
} from 'antd';
import {
	FieldTimeOutlined,
	EditOutlined,
	MoneyCollectOutlined,
	ShoppingOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { Redirect, useParams, Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

import './Account.scss';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';

moment.locale('vi');

export default function Account(props) {
	const { userData } = useContext(AuthContext);
	const { userId } = useParams();
	const [user, setUser] = useState({});
	const [loadingWhenFetching, setLoadingWhenFetching] = useState(false);
	const [errorFetching, setErrorFetching] = useState(null);

	useEffect(() => {
		if (userData) {
			const id = userId || userData.userId;
			setLoadingWhenFetching(true);
			axios
				.get(`/user/${id}`)
				.then((res) => {
					setLoadingWhenFetching(false);
					setUser(res.data.user);
				})
				.catch((err) => {
					console.log(err);
					setLoadingWhenFetching(false);
					setErrorFetching(err.response);
				});
		}
	}, [userData, userId]);

	if (errorFetching && errorFetching.status === 404) {
		return <Redirect to="/404" />;
	}

	const IS_OWNER_PROFILE = userData && userData.userId === userId;
	const IS_OWNER = userData && userData.userId === user._id;
	const OWNED_GAMES = user.activatedGames ? user.activatedGames.length : 0;

	if (IS_OWNER_PROFILE) {
		return <Redirect to="/tai-khoan" />;
	}

	return (
		<Spin
			tip="Đang tải thông tin người dùng..."
			indicator={<SyncOutlined spin style={{ fontSize: 30 }} />}
			spinning={loadingWhenFetching}
		>
			<Layout.Content className="container account content">
				<div className="account-header">
					<Row>
						<Col md={6} xs={24} className="avatar">
							<Image src={user.avatar} />
						</Col>
						<Col md={10} xs={24} className="info">
							<Typography.Title level={2}>{user.name}</Typography.Title>
							<Typography.Paragraph className="create-date">
								<FieldTimeOutlined style={{ fontSize: '16px' }} />{' '}
								{moment(user.createdAt).format('LL')}
							</Typography.Paragraph>
							<Typography.Paragraph className="text">
								{user.status}
							</Typography.Paragraph>
						</Col>
						<Col md={8} xs={24} className="level">
							<div className="card">
								<Statistic
									title="Sở hữu"
									value={OWNED_GAMES}
									valueStyle={{ color: '#95de64' }}
									prefix={<ShoppingOutlined />}
									suffix="games"
								/>
							</div>
							<div className="card">
								<Statistic
									title="Số dư"
									value={user.balance}
									valueStyle={{ color: '#95de64' }}
									prefix={<MoneyCollectOutlined />}
									suffix="VNĐ"
								/>
							</div>
							{IS_OWNER && (
								<Link to="/tai-khoan/chinh-sua">
									<Button type="primary" icon={<EditOutlined />} block>
										Chỉnh sửa tài khoản
									</Button>
								</Link>
							)}
						</Col>
					</Row>
				</div>
				<Typography.Title level={2}>
					Game đã sở hữu({OWNED_GAMES})
				</Typography.Title>
				{user.activatedGames ? (
					<Row gutter={[16, 16]}>
						{user.activatedGames.map((game) => {
							return (
								<Col key={game.name} xs={24} md={12} lg={6}>
									<Link to={`/detail-game/${game._id}`}>
										<Card
											cover={<img alt={game.name} src={game.images[0].url} />}
										>
											<Card.Meta title={game.name} />
											{IS_OWNER && (
												<div className="card-bottom">
													<Button type="default">Chơi game</Button>
												</div>
											)}
										</Card>
									</Link>
								</Col>
							);
						})}
					</Row>
				) : (
					<Result
						status="404"
						title="Kho game trống"
						subTitle="Bạn chưa sở hữu game nào, hãy quay lại cửa hàng và mua vài game nhé :)"
						extra={
							<Link to="/">
								<Button type="primary">Cửa hàng</Button>
							</Link>
						}
					/>
				)}
			</Layout.Content>
		</Spin>
	);
}
