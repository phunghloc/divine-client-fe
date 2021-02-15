import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';

export default function UlityBtn(props) {
	return (
		<Dropdown
			placement="bottomRight"
			overlay={
				<Menu>
					<Menu.Item onClick={props.edit} disabled={!props.commentId}>
						<Button
							type="text"
							icon={<EditOutlined />}
							disabled={!props.commentId}
						>
							Chỉnh sửa
						</Button>
					</Menu.Item>
					<Menu.Item
						onClick={() => props.delete(props.postId, props.commentId)}
					>
						<Button type="text" icon={<DeleteOutlined />} danger>
							Xóa
						</Button>
					</Menu.Item>
				</Menu>
			}
		>
			<MoreOutlined className="option" style={{ fontSize: 18 }} />
		</Dropdown>
	);
}
