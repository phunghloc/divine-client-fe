import React, { useContext, useState } from 'react';
import { Form, Input, Button, Modal, Alert } from 'antd';

import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';

// axios.config

const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
};
const tailLayout = {
	wrapperCol: { offset: 10, span: 14 },
};

export default function CashFormModal(props) {
	const { updateBalance } = useContext(AuthContext);
	const [cashData, setCashData] = useState(null);
	const [loadingFetchCash, setLoadingFetchCash] = useState(false);
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);

	const fetchCashTest = () => {
		setLoadingFetchCash(true);
		const token = localStorage.getItem('token');
		const config = { headers: { Authorization: `Bearer ${token}` } };
		axios
			.get('/cash', config)
			.then((res) => {
				setCashData(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoadingFetchCash(false);
			});
	};

	const sendCashCode = (form) => {
		setSuccess(null);
		setError(null);
		setLoadingFetchCash(true);
		const token = localStorage.getItem('token');
		const config = { headers: { Authorization: `Bearer ${token}` } };
		axios
			.post('/cash', form, config)
			.then((res) => {
				setSuccess(res.data.message);
				updateBalance(res.data.balance);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				setError(errorText);
			})
			.finally(() => {
				setLoadingFetchCash(false);
			});
	};

	return (
		<Modal
			title="Nạp thẻ ngay"
			visible={props.visibleCashForm}
			footer={null}
			onCancel={() => props.setVisibleCashForm(false)}
		>
			{!!success && (
				<Alert
					message="Nạp thẻ thành công"
					description={success}
					type="success"
					showIcon
				/>
			)}
			{!!error && (
				<Alert
					message="Nạp thẻ không thành công"
					description={error}
					type="error"
					showIcon
				/>
			)}
			<Form
				{...layout}
				name="cash-form"
				onFinish={sendCashCode}
				style={{ marginTop: '1rem' }}
			>
				<Form.Item
					label="Serial:"
					name="serial"
					rules={[{ required: true, message: 'Nhập mã serial thẻ!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Mã thẻ"
					name="code"
					rules={[{ required: true, message: 'Nhập mã thẻ!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" loading={loadingFetchCash}>
						Nạp thẻ
					</Button>
				</Form.Item>
			</Form>

			<div className="fetch-test">
				<Button
					type="primary"
					danger
					onClick={fetchCashTest}
					loading={loadingFetchCash}
				>
					Lấy mã test
				</Button>
				{cashData ? (
					<div className="cash-fetch">
						<h3>Test mã</h3>
						<p>Mệnh giá: {cashData.denominate} VNĐ</p>
						<p>Serial: {cashData.serial}</p>
						<p>Mã thẻ: {cashData.code}</p>
					</div>
				) : null}
			</div>
		</Modal>
	);
}
