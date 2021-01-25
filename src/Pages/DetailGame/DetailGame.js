import React, { useContext, useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import {
	Layout,
	Breadcrumb,
	Typography,
	Row,
	Col,
	Spin,
	Descriptions,
	Divider,
	Button,
	Tag,
	notification,
} from 'antd';
import { HomeOutlined, TrophyOutlined, SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './DetailGame.scss';
import axios from '../../axios-constain';
import Comments from '../../Components/Comments/Comments';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';
import CarouselSync from '../../Components/CarouselSync/CarouselSync';
import RequierementsTable from '../../Components/RequirementsTable/RequierementsTable';
import { AuthContext } from '../../Custom/context/AuthContext';

const tagsColor = [
	'red',
	'lime',
	'gold',
	'cyan',
	'blue',
	'green',
	'purple',
	'orange',
	'volcano',
	'magenta',
	'geekblue',
];

const DetailGame = (props) => {
	const [game, setGame] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { gameId } = useParams();
	const { userData, setNeedLogin, updateCart } = useContext(AuthContext);

	useEffect(() => {
		window.scrollTo(0, 0);

		setTimeout(() => {
			let config = {};
			const token = localStorage.getItem('token');
			if (token) {
				config = { headers: { Authorization: `Bearer ${token}` } };
			}
			axios
				.get(`/detail-game/${gameId}`, config)
				.then((res) => {
					setGame(res.data.game);
				})
				.catch((err) => {
					console.log(err.response);
					setError(err.response);
				});
		}, 50);
	}, [gameId, userData]);

	const openSuccessAddToCartNotification = (name) => {
		notification['success']({
			message: 'Thêm vào giỏ hàng thành công',
			description: `Thêm sản phẩm ${name} vào giỏ hàng thành công!`,
			duration: 5,
			top: 70,
			style: {
				borderRadius: '5px',
			},
		});
	};

	const addToCart = () => {
		if (!userData) {
			return setNeedLogin(true);
		}

		const token = localStorage.getItem('token');
		setLoading(true);
		axios
			.post(
				'/add-to-cart',
				{ gameId },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				const cart = [...userData.cart, res.data.game];
				openSuccessAddToCartNotification(res.data.game.name);
				updateCart(cart);
			})
			.catch((err) => {
				console.log(err);
				setError(err.response);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	if (error && error.status === 404) {
		return <Redirect to="/404" />;
	}

	let content = (
		<Spin
			tip="Đang tải thông tin game..."
			indicator={<SyncOutlined spin style={{ fontSize: 30 }} />}
			style={{ fontSize: 30 }}
		>
			<div className="spin"></div>
		</Spin>
	);

	const isInCart = userData
		? userData.cart.find((game) => game._id === gameId)
		: false;

	console.log(game);

	if (game) {
		content = (
			<>
				<Breadcrumb>
					<Breadcrumb.Item>
						<Link to="/">
							<HomeOutlined />
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link to="/tat-ca-game">
							<TrophyOutlined />
							<span>Tất cả game</span>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>{game.name}</Breadcrumb.Item>
				</Breadcrumb>

				<Typography.Title>{game.name}</Typography.Title>

				<Row gutter={[16, 16]}>
					<Col md={12} xs={24} className="img-container">
						<CarouselSync images={game.images} />
					</Col>
					<Col md={12} xs={24} className="info-container">
						<Descriptions layout="vertical" column={2} size="small">
							<Descriptions.Item label="Nhà phát triển">
								<Link
									to={`/search-game?developer=${game.developer._id}`}
									style={{ color: 'black', textDecoration: 'underline' }}
								>
									{game.developer.name}
								</Link>
							</Descriptions.Item>
							<Descriptions.Item label="Thể loại">
								<div>
									{game.tags.map((tag) => (
										<Link key={tag.tagId.label} to="/">
											<Tag
												color={
													tagsColor[tag.tagId.label.length % tagsColor.length]
												}
											>
												{tag.tagId.label}
											</Tag>
										</Link>
									))}
								</div>
							</Descriptions.Item>
						</Descriptions>
						<Divider />
						{game.linkSteam && (
							<div className="owned-box">
								<h2>Bạn đã sở hữu {game.name}.</h2>
								<div className="btn-group">
									<a
										href={game.linkSteam}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button>Chơi ngay</Button>
									</a>
								</div>
							</div>
						)}
						<div className="buy-box">
							<h2>
								Mua {game.name}
								{game.linkSteam && ' cho bạn bè'}.
							</h2>

							<div className="buy-btn">
								<h3>{game.price.toLocaleString()} VNĐ</h3>
								<Button
									onClick={addToCart}
									loading={loading}
									disabled={!!isInCart}
								>
									{!isInCart ? 'Thêm vào giỏ hàng' : 'Đã thêm vào giỏ hàng'}
								</Button>
							</div>
						</div>
					</Col>
					<Divider />
					<Typography.Text className="description">
						{game.description}
					</Typography.Text>

					<Col md={12} xs={24} className="requirements">
						<RequierementsTable
							requirement={game.minimumRequirement}
							title="Cấu hình tối thiểu"
						/>
					</Col>
					<Col md={12} xs={24} className="requirements">
						<RequierementsTable
							requirement={game.recommendRequirement}
							title="Cấu hình đề nghị"
						/>
					</Col>
					<Col xs={24} md={16} style={{ margin: 'auto' }}>
						<Comments
							userData={userData}
							comments={game.comments}
							gameId={gameId}
							game={game}
							setGame={setGame}
						/>
					</Col>
				</Row>
			</>
		);
	}
	return (
		<Layout.Content className="container content detail-game">
			{content}

			<ErrorModal
				visible={!!error}
				setError={setError}
				errorText={!!error && error.data.message}
			/>
		</Layout.Content>
	);
};

export default DetailGame;
