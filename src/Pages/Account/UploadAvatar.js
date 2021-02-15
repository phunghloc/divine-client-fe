import React, { useState, useRef, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Image } from 'antd';
import { UploadOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';

import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';

export default withRouter(function UploadAvatar(props) {
	const inputFileRef = useRef();
	const [file, setFile] = useState(null);
	const { updateAvatar } = useContext(AuthContext);

	const changeFile = (e) => {
		if (!e.target.files.length) return;
		const fileTailList = ['image/jpeg', 'image/jpg', 'image/png'];
		if (fileTailList.includes(e.target.files[0].type)) {
			return setFile(e.target.files);
		}
		props.openErrorModal('Chỉ chấp nhận các file jpg, jpeg, png.');
	};

	const clickInputFile = () => {
		inputFileRef.current.click();
	};

	const uploadAvatarHandler = () => {
		if (!file) {
			return props.openErrorModal('Chọn ảnh hợp lệ trước khi cập nhật.');
		}

		const formData = new FormData();
		formData.append('file[]', file[0]);

		const token = localStorage.getItem('token');
		props.setLoadingWhenAction(true);
		axios
			.post('/user/edit/avatar', formData, {
				headers: {
					'Content-type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				updateAvatar(res.data.avatar);
				props.openSuccessModal(
					'Cập nhật ảnh đại diện thành công, quay lại trang cá nhân và xem kết quả nhé!',
				);
			})
			.catch((err) => {
				console.log(err);
				props.openErrorModal('Có lỗi xảy ra, xin vui lòng thử lại sau');
			})
			.finally(() => {
				props.setLoadingWhenAction(false);
			});
	};

	const PREVIEW_IMG_URL = file ? URL.createObjectURL(file[0]) : props.oldAvatar;

	return (
		<div className="upload">
			<input
				type="file"
				ref={inputFileRef}
				style={{ display: 'none' }}
				onChange={changeFile}
				name="image"
				id="image"
				accept="jpg,jpeg,png"
			/>
			<Image src={PREVIEW_IMG_URL} />
			<div>
				<Button
					type="primary"
					icon={<UploadOutlined />}
					size="large"
					onClick={clickInputFile}
				>
					Chọn ảnh
				</Button>
			</div>
			<div className="upload-group-btn">
				<Button
					type="primary"
					onClick={uploadAvatarHandler}
					icon={<EditOutlined />}
					size="large"
				>
					Cập nhật
				</Button>
				<Button
					type="primary"
					onClick={props.goBack}
					icon={<CloseOutlined />}
					size="large"
					danger
				>
					Hủy bỏ
				</Button>
			</div>
		</div>
	);
});
