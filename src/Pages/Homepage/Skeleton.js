import React from 'react';
import { Row, Col, Card, Skeleton as SkeAntd } from 'antd';

export default function Skeleton() {
	return (
		<Row gutter={[16, 16]}>
			{[1, 2, 3].map((ske) => (
				<Col key={ske} xs={24} md={12} lg={8}>
					<Card style={{ textAlign: 'center' }}>
						<SkeAntd active title={{ width: '100%' }} />
						<SkeAntd.Button active />
					</Card>
				</Col>
			))}
		</Row>
	);
}
