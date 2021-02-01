import React from 'react';
import { NavLink } from 'react-router-dom';
import { Space } from 'antd';

import './Navbar.scss';
import { navlinks } from './Navlinks';

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
