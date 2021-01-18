import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button, Row, Col, Card } from 'antd';

// import Banner1 from '../../assets/images/banner1.png';
// import Banner2 from '../../assets/images/banner2.png';
// import Banner3 from '../../assets/images/banner3.png';
// import Banner4 from '../../assets/images/banner4.png';
// import Banner5 from '../../assets/images/banner5.png';

import './Homepage.scss';
import axios from '../../axios-constain';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';

// const carousel = [Banner1, Banner2, Banner3, Banner4, Banner5];

const Homepage = (props) => {
	const [error, setError] = useState(null);
	const [newestGames, setNewestGames] = useState([]);
	useEffect(() => {
		axios
			.get('/')
			.then((res) => {
				setNewestGames(res.data.games);
			})
			.catch((err) => {
				setError(err.response.data.message);
			});
	}, []);

	return (
		<Layout.Content className="content container">
			<h2>Game mới</h2>
			<Row gutter={[16, 16]}>
				{newestGames.map((game) => {
					return (
						<Col key={game.name} xs={24} md={12} lg={6}>
							<Link to={`/detail-game/${game._id}`}>
								<Card cover={<img alt={game.name} src={game.images} />}>
									<Card.Meta title={game.name} />
									<div className="card-bottom">
										<h4>{game.price.toLocaleString()} VNĐ</h4>
										<Button type="default">Mua game</Button>
									</div>
								</Card>
							</Link>
						</Col>
					);
				})}
			</Row>
			<ErrorModal visible={!!error} errorText={error} setError={setError} />
		</Layout.Content>
	);
};

export default Homepage;
