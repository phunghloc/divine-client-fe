import React, { useContext, useEffect, useState } from 'react';
import {
	Button,
	Dropdown,
	Menu,
	Modal,
	Tabs,
	Row,
	Col,
	Form,
	Input,
	Divider,
	Tooltip,
	Alert,
} from 'antd';
import {
	UserDeleteOutlined,
	UserOutlined,
	LockOutlined,
	FacebookFilled,
	GoogleOutlined,
	IdcardOutlined,
	MailOutlined,
	PhoneOutlined,
} from '@ant-design/icons';

import './Login.scss';
import LoginBanner from '../../assets/images/personnel.png';
import SignUpBanner from '../../assets/images/bird.png';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';

const Login = (props) => {
	const [activeTab, setActiveTab] = useState('0');
	const [visibleModal, setVisibleModal] = useState(false);
	const [errorSignUp, setErrorSignUp] = useState(false);
	const [successSignUp, setSuccessSignUp] = useState(null);
	const [errorLogin, setErrorLogin] = useState(false);
	const [loading, setLoading] = useState(false);
	const { needLogin, setNeedLogin, userData, login } = useContext(AuthContext);

	useEffect(() => {
		if (needLogin) {
			setActiveTab('1');
		}
	}, [needLogin]);

	useEffect(() => {
		setVisibleModal(activeTab !== '0');
	}, [activeTab]);

	const submitLoginInfo = (form) => {
		setSuccessSignUp(null);
		setErrorLogin(null);
		setLoading(true);
		axios
			.post('/auth/login', form)
			.then((res) => {
				setActiveTab('0');
				login(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				const errorText = err.response
					? err.response.data.message
					: 'Có lỗi xảy ra!';
				setErrorLogin(errorText);
			});
	};

	const submitSignupInfo = (form) => {
		setErrorSignUp(false);
		setLoading(true);
		axios
			.post('/auth/signup', form)
			.then((res) => {
				setSuccessSignUp(res.data.username);
			})
			.catch((err) => {
				setErrorSignUp(err.response.data.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const loginOverlay = (
		<Menu className="login-overlay">
			<Menu.Item>
				<button
					onClick={() => {
						setActiveTab('1');
					}}
					className="ovl-btn"
				>
					Đăng nhập
				</button>
			</Menu.Item>
			<Menu.Item>
				<button
					onClick={() => {
						setActiveTab('2');
					}}
					className="ovl-btn"
				>
					Tạo tài khoản
				</button>
			</Menu.Item>
		</Menu>
	);
	return (
		<>
			{!userData && (
				<Dropdown
					placement="bottomRight"
					overlay={loginOverlay}
					className="login"
				>
					<Button
						className="login-btn desktop-screen"
						size="large"
						type="text"
						icon={<UserDeleteOutlined />}
						loading={loading}
					>
						Đăng nhập
					</Button>
				</Dropdown>
			)}

			<Modal
				visible={visibleModal && !userData}
				onCancel={() => {
					setActiveTab('0');
					setNeedLogin(false);
				}}
				width={800}
				footer={null}
				className="login-panel"
			>
				<Tabs activeKey={activeTab} onChange={setActiveTab} centered animated>
					<Tabs.TabPane tab="Đăng nhập" key="1">
						<Row>
							<Col
								md={12}
								style={{ paddingRight: 30 }}
								className="desktop-screen"
							>
								<h2>Đăng nhập</h2>
								<p>
									Đăng nhập để theo dõi đơn hàng, lưu danh sách sản phẩm yêu
									thích, nhận nhiều ưu đãi hấp dẫn.
								</p>
								<img src={LoginBanner} alt="Login Banner" />
							</Col>

							<Col md={12} xs={24}>
								{!!errorLogin && (
									<Alert message={errorLogin} type="error" showIcon closable />
								)}
								<Form
									name="login"
									initialValues={{ remember: true }}
									layout="vertical"
									className="form"
									onFinish={submitLoginInfo}
								>
									<Form.Item
										label="Tài khoản"
										name="username"
										rules={[
											{ required: true, message: 'Nhập tài khoản của bạn!' },
										]}
									>
										<Input
											prefix={<UserOutlined />}
											size="large"
											placeholder="Tài khoản"
										/>
									</Form.Item>

									<Form.Item
										label="Mật khẩu"
										name="password"
										rules={[
											{ required: true, message: 'Nhập mật khẩu của bạn!' },
										]}
									>
										<Input.Password
											prefix={<LockOutlined />}
											size="large"
											placeholder="Mật khẩu"
										/>
									</Form.Item>

									<Button type="text" disabled>
										Quên mật khẩu?
									</Button>

									<Form.Item style={{ marginTop: 12 }}>
										<Button
											type="primary"
											htmlType="submit"
											block
											className="login-btn"
											size="large"
											loading={loading}
										>
											Đăng nhập
										</Button>
									</Form.Item>
								</Form>
								<Divider plain>
									Hoặc đăng nhập bằng tài khoản mạng xã hội
								</Divider>
								<div className="btn-group">
									<Tooltip
										placement="bottom"
										title={<span>Đang phát triển</span>}
									>
										<button disabled={true}>
											<FacebookFilled />
										</button>
									</Tooltip>
									<Tooltip
										placement="bottom"
										title={<span>Đang phát triển</span>}
									>
										<button disabled={true}>
											<GoogleOutlined />
										</button>
									</Tooltip>
								</div>
							</Col>
						</Row>
					</Tabs.TabPane>
					<Tabs.TabPane tab="Tạo tài khoản" key="2">
						<Row>
							<Col
								md={12}
								xs={24}
								style={{ paddingRight: 30 }}
								className="desktop-screen"
							>
								<h2>Tạo tài khoản</h2>
								<p>
									Tạo tài khoản để theo dõi đơn hàng, lưu danh sách sản phẩm yêu
									thích, nhận nhiều ưu đãi hấp dẫn.
								</p>
								<img src={SignUpBanner} alt="Sign up banner" />
							</Col>

							<Col md={12} xs={24}>
								{!!errorSignUp && (
									<Alert
										message={errorSignUp}
										type="error"
										showIcon
										style={{ marginBottom: 12 }}
									/>
								)}
								{successSignUp && (
									<Alert
										message={`Tạo thành công tài khoản ${successSignUp}`}
										type="success"
										showIcon
										style={{ marginBottom: 12 }}
									/>
								)}
								<Form
									name="signup"
									// initialValues={{ remember: true }}
									layout="vertical"
									className="form"
									onFinish={submitSignupInfo}
								>
									<Form.Item
										label="Họ và tên"
										name="name"
										hasFeedback
										rules={[{ required: true, message: 'Nhập tên của bạn!' }]}
									>
										<Input
											prefix={<IdcardOutlined />}
											size="large"
											placeholder="Tên của bạn"
										/>
									</Form.Item>

									<Form.Item
										label="Tài khoản"
										name="username"
										hasFeedback
										rules={[
											{
												required: true,
												message: 'Nhập tên tài khoản của bạn!',
											},
											{ min: 3, message: 'Tên tài khoản ít nhất 3 ký tự' },
											({ getFieldValue }) => ({
												validator(rule, username) {
													const re = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/;
													if (re.test(username)) {
														return Promise.resolve();
													}
													return Promise.reject('Mời nhập tài khoản hợp lệ');
												},
											}),
										]}
									>
										<Input
											prefix={<UserOutlined />}
											size="large"
											placeholder="Tài khoản"
										/>
									</Form.Item>

									<Form.Item
										label="Địa chỉ email"
										name="email"
										hasFeedback
										rules={[
											{
												required: true,
												message: 'Nhập địa chỉ email của bạn!',
											},
											({ getFieldValue }) => ({
												validator(rule, email) {
													const re = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
													if (re.test(email)) {
														return Promise.resolve();
													}
													return Promise.reject(
														'Nhập chính xác địa chỉ email!',
													);
												},
											}),
										]}
									>
										<Input
											prefix={<MailOutlined />}
											size="large"
											placeholder="Địa chỉ email"
										/>
									</Form.Item>

									<Form.Item
										label="Số điện thoại"
										name="phoneNumber"
										hasFeedback
										rules={[
											({ getFieldValue }) => ({
												validator(rule, phone) {
													const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\\./0-9]*$/g;
													if (re.test(phone)) {
														return Promise.resolve();
													}
													return Promise.reject(
														'Nhập chính xác số điện thoại!',
													);
												},
											}),
										]}
									>
										<Input
											type="number"
											prefix={<PhoneOutlined />}
											size="large"
											placeholder="Số điện thoại"
										/>
									</Form.Item>

									<Form.Item
										label="Mật khẩu"
										name="password"
										hasFeedback
										rules={[
											{ required: true, message: 'Nhập mật khẩu của bạn!' },
											{ min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
										]}
									>
										<Input.Password
											prefix={<LockOutlined />}
											size="large"
											placeholder="Mật khẩu"
										/>
									</Form.Item>

									<Form.Item
										label="Nhập lại mật khẩu"
										name="confirmPassword"
										dependencies={['password']}
										hasFeedback
										rules={[
											{ required: true, message: 'Nhập mật khẩu của bạn!' },
											({ getFieldValue }) => ({
												validator(rule, value) {
													if (!value || getFieldValue('password') === value) {
														return Promise.resolve();
													}
													return Promise.reject(
														'Mật khẩu nhập lại chưa trùng khớp!',
													);
												},
											}),
										]}
									>
										<Input.Password
											prefix={<LockOutlined />}
											size="large"
											placeholder="Nhập lại mật khẩu"
										/>
									</Form.Item>

									<Form.Item style={{ marginTop: 24 }}>
										<Button
											type="primary"
											htmlType="submit"
											block
											className="login-btn"
											size="large"
											loading={loading}
										>
											Tạo tài khoản
										</Button>
									</Form.Item>
									<small style={{ color: '#333' }}>
										Khi bạn nhấn Tạo tài khoản, bạn đã đồng ý thực hiện mọi giao
										dịch theo điều kiện sử dụng và chính sách của Divine Shop.
									</small>
								</Form>
							</Col>
						</Row>
					</Tabs.TabPane>
				</Tabs>
			</Modal>
		</>
	);
};

export default Login;
