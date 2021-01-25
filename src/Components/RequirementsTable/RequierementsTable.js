import React from 'react';
import { Descriptions } from 'antd';

export default function RequirementsTable(props) {
	return (
		<Descriptions title={props.title} bordered column={1} >
			<Descriptions.Item label="OS">{props.requirement.os}</Descriptions.Item>
			<Descriptions.Item label="Processor">
				{props.requirement.processor}
			</Descriptions.Item>
			<Descriptions.Item label="Graphic">
				{props.requirement.graphic}
			</Descriptions.Item>
			<Descriptions.Item label="Memory">
				{props.requirement.memory} GB RAM
			</Descriptions.Item>
			<Descriptions.Item label="Storage">
				{props.requirement.storage} HDD available space
			</Descriptions.Item>
		</Descriptions>
	);
}
