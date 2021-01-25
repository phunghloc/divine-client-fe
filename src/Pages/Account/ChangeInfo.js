import React, { createRef, useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

import axios from '../../axios-constain';

function ChangeInfo(props) {
	const submitNewInfo = (form) => {
		// console.log(form);
		props.setLoadingWhenAction(true);

		const token = localStorage.getItem('token');

		axios
			.post('/user/edit/info', form, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res.data);
				props.openSuccessModal(res.data.message);
			})
			.catch((err) => {
				console.log(err);
				props.openErrorModal();
			})
			.finally(() => {
				props.setLoadingWhenAction(false);
			});
	};

	const form = createRef();

	useEffect(() => {
		form.current.setFieldsValue({
			name: props.user.name,
			phoneNumber: props.user.phoneNumber,
			status: props.user.status,
		});
	}, [form, props]);

	return (
		<div className="change-info">
			<Typography.Title style={{ textAlign: 'center' }}>
				Cập nhật thông tin cá nhân
			</Typography.Title>
			<Form
				ref={form}
				name="change-info-form"
				onFinish={submitNewInfo}
				layout="vertical"
			>
				<Form.Item
					label="Tên của bạn"
					name="name"
					rules={[
						{
							required: true,
							message:
								'Nhập tên của bạn, tên này sẽ được hiển thị trên website.',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Số điện thoại của bạn"
					name="phoneNumber"
					rules={[
						{
							required: true,
							message: 'Nhập số điện thoại của bạn.',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="Trạng thái của bạn" name="status">
					<Input.TextArea autoSize={{ minRows: 3 }} />
				</Form.Item>
				<Form.Item className="btn-group">
					<Button
						type="primary"
						size="large"
						icon={<EditOutlined />}
						htmlType="submit"
					>
						Cập nhật
					</Button>
					<Button
						type="primary"
						htmlType="button"
						size="large"
						icon={<CloseOutlined />}
						danger
						onClick={props.goBack}
					>
						Hủy bỏ
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default ChangeInfo;
