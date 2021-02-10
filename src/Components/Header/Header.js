import React, { useContext } from 'react';
import { Layout, Input, Dropdown, Menu, Empty } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import logoFlat from '../../assets/images/logo-1.png';
import logoCircle from '../../assets/images/logo_divine_pure_white.png';

import './Header.scss';
import Login from '../Login/Login';
import MenuDrawer from './MenuDrawer';
import UserLogined from '../Login/UserLogined';
import { useSearch } from '../../Custom/hooks/SearchHook';
import { AuthContext } from '../../Custom/context/AuthContext';

function Header(props) {
	const { userData } = useContext(AuthContext);
	const {
		searchGame,
		setSearchValue,
		searchValue,
		loadingSearch,
	} = useSearch();

	const menu = (
		<Menu>
			{!searchValue ? (
				<Menu.Item>
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={<span>Nhập tên game để tìm kiếm...</span>}
					/>
				</Menu.Item>
			) : (
				searchGame.map((game) => (
					<Menu.Item
						key={game.name}
						icon={<img height="40" src={game.images[0].url} alt={game.name} />}
						onClick={() => {
							props.history.push(`/detail-game/${game._id}`);
						}}
					>
						<span style={{ marginLeft: '1rem' }}>{game.name}</span>
					</Menu.Item>
				))
			)}

			{searchValue && !searchGame.length && (
				<Menu.Item>
					<Empty description={<span>Không có kết quả phù hợp</span>} />
				</Menu.Item>
			)}
		</Menu>
	);

	return (
		<Layout.Header className="header">
			<div className="container-header">
				<Link className="logo-link desktop-screen" to="/">
					<img src={logoCircle} alt="Logo Divine" />
					<img src={logoFlat} alt="Logo Divine" />
				</Link>
				<Dropdown overlay={menu} trigger={['click']}>
					<Input.Search
						placeholder="Nhập để tìm kiếm sản phẩm"
						allowClear
						loading={loadingSearch}
						enterButton
						size="large"
						className="search"
						onChange={(event) => setSearchValue(event.target.value)}
					/>
				</Dropdown>
				{!!userData && <UserLogined />}
				<Login />
				<MenuDrawer userData={userData} />
			</div>
		</Layout.Header>
	);
}

export default withRouter(Header);
