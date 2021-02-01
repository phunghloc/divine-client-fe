import React, { useState, useRef } from 'react';
import { Avatar, Button, Comment, Input, Image, Spin, Modal } from 'antd';
import {
	SnippetsOutlined,
	FileImageOutlined,
	UploadOutlined,
	CloseOutlined,
} from '@ant-design/icons';

import axios from '../../../axios-constain';

export default function CreatePost(props) {
	const [content, setContent] = useState('');
	const [file, setFile] = useState([]);
	const [spinning, setSpinning] = useState(false);
	const inputRef = useRef();
	const inputFileRef = useRef();

	const openErrorModal = (textError = 'Có lỗi xảy ra.') => {
		Modal.error({
			title: 'Có lỗi xảy ra',
			content: textError,
			okText: 'Xác nhận',
		});
	};

	const changeFile = (e) => {
		if (!e.target.files.length) return;
		const fileTailList = ['image/jpeg', 'image/jpg', 'image/png'];
		if (fileTailList.includes(e.target.files[0].type)) {
			return setFile(e.target.files);
		}
		openErrorModal('Chỉ chấp nhận file png, jpg, jpeg!');
	};

	const clearFileHandler = () => {
		setFile([]);
	};

	const submitPostHandler = () => {
		const formData = new FormData();

		for (const img of file) {
			formData.append('file[]', img);
		}

		formData.append('content', content);

		setSpinning(true);
		const token = localStorage.getItem('token');
		axios
			.post('/posts/create', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'multipart/form-data',
				},
			})
			.then((res) => {
				// console.log(res);
				setContent('');
				setFile([]);
			})
			.catch((err) => {
				const message = err.response ? err.response.data.message : null;
				openErrorModal(message);
			})
			.finally(() => {
				setSpinning(false);
			});
	};

	const PREVIEW_IMG_URL = file.length ? URL.createObjectURL(file[0]) : null;

	if (!props.userData) {
		return null;
	}

	return (
		<Spin spinning={spinning} tip="Đang đăng bài...">
			<div className="create-post community-item">
				<Comment
					avatar={<Avatar src={props.userData.avatar} alt="avatar" />}
					content={
						<Input.TextArea
							autoSize
							ref={inputRef}
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
							}}
							placeholder="Bạn muốn chia sẻ điều gì?"
							size="large"
						/>
					}
					className="create-post-container"
					actions={[
						<Button
							key="post"
							block
							size="large"
							onClick={() => inputRef.current.focus()}
							icon={
								<SnippetsOutlined style={{ color: '#F02849', fontSize: 18 }} />
							}
						>
							Tạo bài đăng
						</Button>,
						<Button
							key="img"
							block
							size="large"
							onClick={() => inputFileRef.current.click()}
							icon={
								<FileImageOutlined style={{ color: '#45BD62', fontSize: 18 }} />
							}
						>
							Kèm hình ảnh
						</Button>,
					]}
				/>
				<input
					type="file"
					ref={inputFileRef}
					style={{ display: 'none' }}
					onChange={changeFile}
					name="image"
					id="image"
					accept="jpg,jpeg,png"
				/>
				<div className="preview-img">
					{PREVIEW_IMG_URL && (
						<Image
							width={'100%'}
							preview={false}
							src={PREVIEW_IMG_URL}
							alt="image in post"
						/>
					)}
					{PREVIEW_IMG_URL && (
						<Button
							icon={<CloseOutlined />}
							onClick={clearFileHandler}
						></Button>
					)}
				</div>
				<Button
					disabled={!content.trim()}
					onClick={submitPostHandler}
					type="primary"
					size="large"
					block
					icon={<UploadOutlined />}
				>
					Đăng bài
				</Button>
			</div>
		</Spin>
	);
}
