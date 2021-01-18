import React from 'react';
import { Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

import gif404 from '../../assets/images/404.gif';

import './404.scss';

const page404 = () => {
	return (
		<Layout.Content className="container page404">
			<img src={gif404} alt="404 page not found" />
			<h2>404 page not found</h2>
			<h3>Nội dung bạn tìm kiếm không tồn tại...</h3>
			<Link to="/">
				<Button type="link" size="large" icon={<HomeOutlined />}>
					Quay lại trang chủ
				</Button>
			</Link>
		</Layout.Content>
	);
};

export default page404;
