import React from 'react';
import { Layout, Col, Row } from 'antd';

import service1 from '../../assets/images/service1.png';
import service2 from '../../assets/images/service2.png';
import service3 from '../../assets/images/service3.png';
import service4 from '../../assets/images/service4.png';

import './Footer.scss';

const contentService = [
	{
		img: service1,
		title: 'GIAO HÀNG SIÊU TỐC',
		content: 'Hệ thống giao hàng tự động chỉ trong 3 phút',
	},
	{
		img: service2,
		title: 'BẢO HÀNH NHANH CHÓNG',
		content: 'Mọi yêu cầu hỗ trợ sẽ được đội ngũ tư vấn giải quyết trực tiếp.',
	},
	{
		img: service3,
		title: 'UY TÍN 5 SAO',
		content: 'Được cộng đồng bình chọn là shop game uy tín nhất VN.',
	},
	{
		img: service4,
		title: 'HỖ TRỢ TẬN TÌNH',
		content: 'Hệ thống hỗ trợ online liên tục từ 8h - 24h.',
	},
];

const Footer = () => {
	return (
		<Layout.Footer className="footer">
			<Row gutter={[16, 16]}>
				{contentService.map((service) => {
					return (
						<Col key={service.title} xs={24} md={12} xl={6}>
							<div className="container">
								<img src={service.img} alt={service.title} />
								<div>
									<h4>{service.title}</h4>
									<p>{service.content}</p>
								</div>
							</div>
						</Col>
					);
				})}
			</Row>
		</Layout.Footer>
	);
};

export default Footer;
