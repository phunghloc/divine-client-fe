import React from 'react';
import { Skeleton as SkeletonAntd } from 'antd';

export default function Skeleton() {
	return (
		<SkeletonAntd
			avatar
			paragraph={{ rows: 4 }}
			active
			className="community-item post-item"
		/>
	);
}
