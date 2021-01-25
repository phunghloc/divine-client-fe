import React from 'react';
import { Typography, Form, Input, Button } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';

import axios from '../../axios-constain';

export default function ChangePassword(props) {
	const submitNewIPassword = (form) => {
		// console.log(form);
		props.setLoadingWhenAction(true);
		const token = localStorage.getItem('token');

		axios
			.post('/user/edit/password', form, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				props.openSuccessModal(res.data.message);
			})
			.catch((err) => {
				console.log(err);
				if (err.response) {
					props.openErrorModal(err.response.data.message);
				}
			})
			.finally(() => {
				props.setLoadingWhenAction(false);
			});
	};
	return (
		<div className="change-info">
			<Typography.Title style={{ textAlign: 'center' }}>
				Thay đổi mật khẩu
			</Typography.Title>
			<Form
				name="change-info-form"
				onFinish={submitNewIPassword}
				layout="vertical"
			>
				<Form.Item
					label="Nhập mật khẩu cũ"
					name="oldPassword"
					rules={[
						{
							required: true,
							message:
								'Nhập tên của bạn, tên này sẽ được hiển thị trên website.',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="Nhập mật khẩu mới"
					name="password"
					rules={[
						{
							min: 6,
							message: 'Mật khẩu ít nhất 6 ký tự.',
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="Nhập lại mật khẩu mới"
					name="confirmPassword"
					dependencies={['password']}
					// rules={[
					// 	({ getFieldValue }) => ({
					// 		validator(_, value) {
					// 			if (!value || getFieldValue('password') === value) {
					// 				return Promise.resolve();
					// 			}
					// 			return Promise.reject('Nhập lại mật khẩu chưa trùng khớp!');
					// 		},
					// 	}),
					// ]}
				>
					<Input.Password />
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
