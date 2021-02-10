import React, { useState } from 'react';
import { Comment, Avatar, Tooltip, Input, Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

import UlityBtn from './UlityBtn';
import axios from '../../../axios-constain';

moment.locale('vi');

export default function CommentInPost(props) {
	const [edit, setEdit] = useState(false);
	const [valueEdit, setValueEdit] = useState('');
	const [canSubmit, setCanSubmit] = useState(false);
	const [loading, setLoading] = useState(false);

	const changeInputHandler = (e) => {
		setValueEdit(e.target.value);
		setCanSubmit(!!e.target.value.trim() && e.target.value !== props.comment);
	};

	const editCommentHandler = () => {
		setValueEdit(props.comment);
		setEdit(true);
		setCanSubmit(false);
	};

	const cancelEditCommentHandler = () => {
		setEdit(false);
	};
	const submitEditCommentHandler = () => {
		if (canSubmit) {
			setLoading(true);
			const token = localStorage.getItem('token');
			axios
				.put(
					`/posts/${props.postId}/${props._id}`,
					{ newComment: valueEdit },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				)
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					const content = err.response ? err.response.data.message : null;
					props.openErrorModal(content);
				})
				.finally(() => {
					setLoading(false);
					setEdit(false);
					props.editCommentHandler(props.postId, props._id, valueEdit);
				});
		}
	};

	return (
		<Spin spinning={loading} tip="Đang thực hiện yêu cầu...">
			<Comment
				author={
					<>
						<Link to={`/tai-khoan/${props.userId._id}`}>
							{props.userId.name}
						</Link>
						{props.uid === props.userId._id && (
							<UlityBtn
								delete={props.delete}
								postId={props.postId}
								commentId={props._id}
								edit={editCommentHandler}
							/>
						)}
					</>
				}
				avatar={<Avatar src={props.userId.avatar} alt={props.userId.name} />}
				content={
					edit ? (
						<Input.TextArea
							rows={1}
							size="large"
							className="edit-input"
							autoSize
							placeholder="Nhập nội dung chỉnh sửa..."
							value={valueEdit}
							onChange={changeInputHandler}
						/>
					) : (
						<p>{props.comment}</p>
					)
				}
				datetime={
					<Tooltip title={moment(props.commentDate).format('LLLL')}>
						<span style={{ color: '#999' }}>
							{moment(props.commentDate).fromNow()}
						</span>
					</Tooltip>
				}
				actions={
					edit && [
						<Button
							type="link"
							key="submit"
							onClick={submitEditCommentHandler}
							disabled={!canSubmit}
						>
							Lưu
						</Button>,
						<Button
							type="link"
							danger
							key="cancel"
							onClick={cancelEditCommentHandler}
						>
							Huỷ bỏ
						</Button>,
					]
				}
			/>
		</Spin>
	);
}
