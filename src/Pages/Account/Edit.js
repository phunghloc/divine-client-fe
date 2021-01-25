import React, { useContext, useEffect, useState } from 'react';
import { Layout, Tabs, Spin, Modal } from 'antd';
import {
	SyncOutlined,
	IdcardOutlined,
	UserOutlined,
	SecurityScanOutlined,
} from '@ant-design/icons';
import { Redirect } from 'react-router-dom';

import './Edit.scss';
import ChangeInfo from './ChangeInfo';
import axios from '../../axios-constain';
import UploadAvatar from './UploadAvatar';
import ChangePassword from './ChangePassword';
import { AuthContext } from '../../Custom/context/AuthContext';

const LOADING_TEXT = 'Đang tải thông tin người dùng...';
const POSTING_TEXT = 'Đang cập nhật thông tin người dùng';

export default function Edit(props) {
	const { userData } = useContext(AuthContext);
	const [user, setUser] = useState({});
	const [loadingText, setLoadingText] = useState(LOADING_TEXT);
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem('token');

	useEffect(() => {
		setLoading(true);
		if (userData) {
			axios
				.get('/user/edit', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setUser(res.data.user);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [userData, token]);

	const goBack = () => {
		props.history.goBack();
	};

	const openErrorModal = (
		errorText = 'Có lỗi xảy ra, xin vui lòng thử lại sau!',
	) => {
		Modal.error({
			title: 'Không hợp lệ!',
			okText: 'Xác nhận',
			content: errorText,
		});
	};

	const openSuccessModal = (successText = 'Cập nhật thành công!') => {
		Modal.success({
			title: 'Cập nhật thành công!',
			okText: 'Xác nhận',
			content: successText,
			onOk() {
				goBack();
			},
		});
	};

	const setLoadingWhenAction = (status) => {
		setLoadingText(status ? POSTING_TEXT : LOADING_TEXT);
		setLoading(status);
	};

	if (!token) {
		return <Redirect to="/" />;
	}

	return (
		<Spin
			tip={loadingText}
			indicator={<SyncOutlined spin style={{ fontSize: 30 }} />}
			spinning={loading}
		>
			<Layout.Content className="container account content">
				<Tabs defaultActiveKey="2" centered animated size="large">
					<Tabs.TabPane
						tab={
							<span>
								<UserOutlined />
								Đổi ảnh đại diện
							</span>
						}
						key="1"
					>
						<UploadAvatar
							goBack={goBack}
							oldAvatar={user.avatar}
							openErrorModal={openErrorModal}
							openSuccessModal={openSuccessModal}
							setLoadingWhenAction={setLoadingWhenAction}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<IdcardOutlined />
								Thông tin cá nhân
							</span>
						}
						key="2"
					>
						<ChangeInfo
							user={user}
							goBack={goBack}
							openErrorModal={openErrorModal}
							openSuccessModal={openSuccessModal}
							setLoadingWhenAction={setLoadingWhenAction}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						tab={
							<span>
								<SecurityScanOutlined />
								Đổi mật khẩu
							</span>
						}
						key="3"
					>
						<ChangePassword
							goBack={goBack}
							openErrorModal={openErrorModal}
							openSuccessModal={openSuccessModal}
							setLoadingWhenAction={setLoadingWhenAction}
						/>
					</Tabs.TabPane>
				</Tabs>
			</Layout.Content>
		</Spin>
	);
}
