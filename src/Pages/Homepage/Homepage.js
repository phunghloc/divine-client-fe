import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FilterOutlined, SyncOutlined } from '@ant-design/icons';
import {
	Layout,
	Button,
	Row,
	Col,
	Card,
	PageHeader,
	Divider,
	Spin,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import './Homepage.scss';
import ModalFilter from './ModalFilter';
import axios from '../../axios-constain';
import ErrorModal from '../../Components/ErrorModal/ErrorModal';
import Skeleton from './Skeleton';

const Homepage = (props) => {
	const [error, setError] = useState(null);
	const [games, setGames] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [devs, setDevs] = useState([]);
	const [visibleFilter, setVisibleFilter] = useState(false);

	const fetchData = useCallback((queryString) => {
		const isFirstFetch = !queryString.includes('page=');
		if (isFirstFetch) setLoading(true);
		axios
			.get(`/${queryString}`)
			.then((res) => {
				setGames((preGames) => {
					if (isFirstFetch) return res.data.games;
					return [...preGames, ...res.data.games];
				});
				setTotal(res.data.total);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				setError(errorText);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const search = props.location.search;
		setVisibleFilter(false);
		fetchData(search);
	}, [props.location.search, fetchData]);

	const submit = (allValues) => {
		const query = [];
		for (const key in allValues) {
			query.push(`${key}=${allValues[key]}`);
		}
		props.history.push(`?${query.join('&')}`);
	};

	const openFilter = () => {
		setVisibleFilter(true);
		if (devs.length) return;
		axios
			.get('/devs')
			.then((res) => {
				setDevs(
					res.data.devs.map((dev) => {
						return { value: dev._id, label: dev.name };
					}),
				);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				setError(errorText);
			});
	};

	const fetchDataNextPage = () => {
		let queryString = '?';
		let queryObject = {};
		let query = props.location.search;
		if (query.startsWith('?')) {
			query = query.slice(1);
		}

		queryObject = query
			.split('&')
			.filter((q) => q)
			.reduce((total, current) => {
				const [key, value] = current.split('=');
				total[key] = value;
				return total;
			}, {});

		queryObject.page = queryObject.page ? +queryObject.page + 1 : 2;

		const queryArray = [];
		for (const key in queryObject) {
			queryArray.push(`${key}=${queryObject[key]}`);
		}

		queryString += queryArray.join('&');
		props.history.push(queryString);
	};

	return (
		<Spin
			tip="Đang tải thông tin game..."
			indicator={<SyncOutlined spin style={{ fontSize: 30 }} />}
			style={{ fontSize: 30 }}
			spinning={loading}
		>
			<Layout.Content
				className="container content"
				style={{ minHeight: '80vh' }}
			>
				<ModalFilter
					showFilter={visibleFilter}
					closeFilter={() => setVisibleFilter(false)}
					setError={setError}
					submit={submit}
					devs={devs}
				/>
				<PageHeader
					className="homepage-header"
					title="Danh sách sản phẩm"
					extra={[
						<Button
							onClick={openFilter}
							type="ghost"
							key="filter"
							icon={<FilterOutlined />}
						>
							Lọc
						</Button>,
					]}
				/>

				<InfiniteScroll
					dataLength={games.length}
					next={fetchDataNextPage}
					hasMore={total > games.length}
					loader={<Skeleton />}
					style={{ overflowX: 'hidden' }}
					endMessage={<Divider>Hết sản phẩm</Divider>}
				>
					<Row gutter={[16, 16]}>
						{games.map((game) => {
							return (
								<Col key={game._id + Math.random()} xs={24} md={12} lg={8}>
									<Link to={`/detail-game/${game._id}`}>
										<Card
											cover={<img alt={game.name} src={game.images[0].url} />}
										>
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
				</InfiniteScroll>

				<ErrorModal visible={!!error} errorText={error} setError={setError} />
			</Layout.Content>
		</Spin>
	);
};

export default Homepage;
