import React from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';
import {
	HomeOutlined,
	TrophyOutlined,
	CommentOutlined,
} from '@ant-design/icons';

import './Navbar.scss';

const navlinks = [
	{ link: '/', exact: true, title: 'Trang chủ', icon: <HomeOutlined /> },
	{
		link: '/tat-ca-game',
		exact: false,
		title: 'Tất cả game',
		icon: <TrophyOutlined />,
	},
	{
		link: '/cong-dong',
		exact: false,
		title: 'Cộng đồng',
		icon: <CommentOutlined />,
	},
];

const Navbar = () => {
	return (
		<nav className="container navbar">
			{navlinks.map((nav) => (
				<NavLink to={nav.link} exact={nav.exact} key={nav.link}>
					<Space>
						{nav.icon} {nav.title}
					</Space>
				</NavLink>
			))}
		</nav>
	);
};

export default Navbar;
