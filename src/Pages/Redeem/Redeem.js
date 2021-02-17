import React, { useContext, useState } from 'react';
import {
	Layout,
	Row,
	Col,
	Image,
	Typography,
	Input,
	Button,
	Modal,
} from 'antd';

import './Redeem.scss';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';
import logo from '../../assets/images/logo_divine_pure_white.png';

export default function Redeem(props) {
	const [input, setInput] = useState('');
	const [keygame, setKeygame] = useState(null);
	const [loading, setLoading] = useState(false);
	const { userData } = useContext(AuthContext);

	const openSuccessModalHandler = () => {
		Modal.success({
			title: 'Kích hoạt thành công.',
			content: `Kích hoạt thành công game ${keygame.gameId.name}.`,
			okText: 'Xác nhận',
			onOk() {
				Modal.destroyAll();
			},
		});
	};

	const openErrorModalHandler = (errorText) => {
		Modal.error({
			title: 'Kích hoạt không thành công.',
			content: errorText,
			okText: 'Xác nhận',
			onOk() {
				Modal.destroyAll();
			},
		});
	};

	const checkKeygameHandler = () => {
		if (keygame && keygame.activatedBy) {
			return;
		}

		setLoading(true);
		axios
			.post('/check-key', { key: input })
			.then((res) => {
				setKeygame(res.data.keygame);
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				openErrorModalHandler(errorText);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const changeInputHandler = (e) => {
		setKeygame(null);
		setInput(e.target.value);
	};

	const activeGameByKeyHandler = () => {
		setLoading(true);
		const token = localStorage.getItem('token');
		axios
			.post(
				'/activate-by-key',
				{ keygame: input },
				{ headers: { Authorization: `Bearer ${token}` } },
			)
			.then((res) => {
				console.log(res);
				openSuccessModalHandler();
			})
			.catch((err) => {
				console.log(err);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi không xác định xảy ra!';
				if (err.response) openErrorModalHandler(errorText);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Layout.Content className="container redeem">
			<div className="redeem-container">
				<Row gutter={[16, 16]}>
					<Col md={8} xs={24}>
						{!keygame && (
							<div className="placeholder">
								<img alt="divine logo" src={logo} />
							</div>
						)}
						{!!keygame && (
							<Image alt="game" src={keygame.gameId.images[0].url} />
						)}
					</Col>
					<Col md={16} xs={24}>
						<Typography.Title>Đổi keygame</Typography.Title>
						<Typography.Text>
							Nhập keygame của bạn để kích hoạt game vào tài khoản của bạn.
						</Typography.Text>

						<Input
							placeholder="00000000-0000-0000-0000-000000000000"
							size="large"
							value={input}
							onChange={changeInputHandler}
						/>
						<Button
							className="check-btn"
							block
							disabled={input.length !== 36}
							loading={loading}
							type="primary"
							size="large"
							onClick={checkKeygameHandler}
							danger={!!keygame && keygame.activatedBy}
						>
							{!!keygame && keygame.activatedBy
								? 'Key đã có người sử dụng'
								: 'Kiểm tra keygame'}
						</Button>
						{!!keygame && !keygame.activatedBy && (
							<Button
								className="redeem-btn"
								block
								loading={loading}
								type="primary"
								size="large"
								onClick={activeGameByKeyHandler}
								disabled={!userData}
							>
								{!userData
									? 'Đăng nhập để kích hoạt game'
									: 'Kích hoạt keygame'}
							</Button>
						)}
					</Col>
				</Row>
			</div>
		</Layout.Content>
	);
}
