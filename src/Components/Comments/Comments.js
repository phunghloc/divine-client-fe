import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Comment,
	Avatar,
	Input,
	Form,
	Button,
	Spin,
	List,
	Tooltip,
	Typography,
	Modal,
} from 'antd';
import moment from 'moment';
import 'moment/locale/vi';

import axios from '../../axios-constain';
import './Comment.scss';

moment.locale('vi');

const Editor = ({
	onChange,
	onSubmit,
	submitting,
	value,
	minRows = 2,
	btnTitle = 'Đăng bình luận',
}) => (
	<>
		<Form.Item>
			<Input.TextArea
				placeholder="Nhập bình luận của bạn..."
				autoSize={{ minRows }}
				onChange={onChange}
				value={value}
			/>
		</Form.Item>
		<Form.Item style={{ textAlign: 'right' }}>
			<Button
				htmlType="submit"
				loading={submitting}
				onClick={onSubmit}
				type="primary"
			>
				{btnTitle}
			</Button>
		</Form.Item>
	</>
);

export default function Comments(props) {
	const [comment, setComment] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [reply, setReply] = useState({ position: null, value: '' });

	const changeValueHandler = (e) => {
		setComment(e.target.value);
	};

	const openErrorModalHandler = (content = 'Xin vui lòng thao tác lại.') => {
		Modal.error({
			title: 'Phát sinh lỗi!',
			content,
			okText: 'Xác nhận',
		});
	};

	const openConfirmModalHandler = (commentId, replyId) => {
		const content = !replyId ? 'Bình luận' : 'Trả lời bình luận';
		Modal.confirm({
			title: `${content} sẽ bị xóa vĩnh viễn.`,
			content: `Bạn có chắc chắn muốn xóa ${content.toLocaleLowerCase()} này không?`,
			okButtonProps: {
				danger: true,
			},
			okText: 'Xóa',
			cancelText: 'Hủy bỏ',
			onOk() {
				deleteHandler(commentId, replyId);
			},
		});
	};

	const submitHandler = (e) => {
		if (!comment.trim())
			return openErrorModalHandler('Bình luận không hợp lệ!');
		setSubmitting(true);

		const token = localStorage.getItem('token');
		axios
			.post(
				`/detail-game/${props.gameId}/comment`,
				{ comment },
				{ headers: { Authorization: `Bearer ${token}` } },
			)
			.then((res) => {
				setComment('');
				const newComment = { ...res.data.comment };
				newComment.userId = {
					avatar: props.userData.avatar,
					name: props.userData.name,
					_id: props.userData.userId,
				};

				const newGame = { ...props.game };
				newGame.comments.unshift(newComment);
				props.setGame(newGame);
			})
			.catch((err) => {
				console.log(err);
				const message = err.response
					? err.response.data.message
					: 'Có lỗi xảy ra.';
				openErrorModalHandler(message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const deleteHandler = (commentId, replyId) => {
		setSubmitting(true);
		const token = localStorage.getItem('token');
		axios
			.delete(
				`/detail-game/${props.gameId}/${commentId}${
					replyId ? '/' + replyId : ''
				}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			)
			.then((res) => {
				const newGame = { ...props.game };

				// Xóa comment
				if (!replyId) {
					newGame.comments = newGame.comments.filter(
						(comment) => comment._id !== commentId,
					);
				}
				// Xóa reply
				else {
					const commentIndex = newGame.comments.findIndex(
						(comment) => comment._id === commentId,
					);

					newGame.comments[commentIndex].replies = newGame.comments[
						commentIndex
					].replies.filter((reply) => reply._id !== replyId);
				}

				props.setGame(newGame);
			})
			.catch((err) => {
				console.log(err);
				const message = err.response
					? err.response.data.message
					: 'Có lỗi xảy ra.';
				openErrorModalHandler(message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const toggleReplyTextArea = (index) => {
		if (reply.position === index) return;
		setReply({ position: index, value: '' });
	};

	const changeReplyHandler = (e) => {
		setReply((pre) => {
			return { ...pre, value: e.target.value };
		});
	};

	const submitReplyHandler = (commentId) => {
		if (!reply.value.trim())
			return openErrorModalHandler('Bình luận không hợp lệ!');

		setSubmitting(true);

		const token = localStorage.getItem('token');

		axios
			.post(
				`/detail-game/${props.gameId}/${commentId}`,
				{ comment: reply.value },
				{ headers: { Authorization: `Bearer ${token}` } },
			)
			.then((res) => {
				console.log(res);
				setReply({ position: null, value: '' });

				const newGame = { ...props.game };

				const commentIndex = newGame.comments.findIndex(
					(comment) => comment._id === commentId,
				);
				console.log(commentIndex);
				newGame.comments[commentIndex].replies.push({
					...res.data.reply,
					userId: {
						avatar: props.userData.avatar,
						name: props.userData.name,
						_id: props.userData.userId,
					},
				});
				props.setGame(newGame);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<Spin spinning={submitting} tip="Đang thực hiện thao tác.">
			<Typography.Title level={3}>
				{props.comments.length} bình luận.
			</Typography.Title>
			{props.userData && (
				<Comment
					className="textarea-comment"
					avatar={
						<Avatar src={props.userData.avatar} alt={props.userData.name} />
					}
					content={
						<Editor
							onChange={changeValueHandler}
							onSubmit={submitHandler}
							submitting={submitting}
							value={comment}
						/>
					}
				/>
			)}

			<List
				pagination={{ pageSize: 5 }}
				className="comment-list"
				itemLayout="horizontal"
				dataSource={props.comments}
				renderItem={(comment, index) => (
					<li className="comment-item" key={comment._id}>
						<Comment
							actions={
								!!props.userData && [
									<Button
										type="link"
										key="link"
										className="ulity-btn"
										onClick={() => toggleReplyTextArea(index)}
									>
										Trả lời
									</Button>,
									!!props.userData &&
										props.userData.userId === comment.userId._id && (
											<Button
												danger
												type="link"
												key="delete"
												className="ulity-btn"
												onClick={() => openConfirmModalHandler(comment._id)}
											>
												Xóa
											</Button>
										),
								]
							}
							author={
								<Link
									className="account"
									to={`/tai-khoan/${comment.userId._id}`}
								>
									{comment.userId.name}
								</Link>
							}
							avatar={comment.userId.avatar}
							content={comment.comment}
							datetime={
								<Tooltip title={moment(comment.createdDate).format('LLLL')}>
									<span>{moment(comment.createdDate).fromNow()}</span>
								</Tooltip>
							}
						>
							{comment.replies.map((reply) => (
								<Comment
									actions={
										!!props.userData && [
											<Button
												type="link"
												key="link"
												className="ulity-btn"
												onClick={() => toggleReplyTextArea(index)}
											>
												Trả lời
											</Button>,
											props.userData &&
												props.userData.userId === reply.userId._id && (
													<Button
														danger
														type="link"
														key="delete"
														className="ulity-btn"
														onClick={() =>
															openConfirmModalHandler(comment._id, reply._id)
														}
													>
														Xóa
													</Button>
												),
										]
									}
									key={reply._id}
									author={
										<Link
											className="account"
											to={`/tai-khoan/${reply.userId._id}`}
										>
											{reply.userId.name}
										</Link>
									}
									avatar={reply.userId.avatar}
									content={reply.comment}
									datetime={
										<Tooltip title={moment(reply.createdDate).format('LLLL')}>
											<span>{moment(reply.createdDate).fromNow()}</span>
										</Tooltip>
									}
								/>
							))}
							{reply.position === index && (
								<Comment
									className="textarea-comment"
									avatar={
										<Avatar
											src={props.userData.avatar}
											alt={props.userData.name}
										/>
									}
									content={
										<Editor
											onChange={changeReplyHandler}
											onSubmit={() => submitReplyHandler(comment._id)}
											submitting={submitting}
											value={reply[index]}
											minRows={1}
											btnTitle="Trả lời"
										/>
									}
								/>
							)}
						</Comment>
					</li>
				)}
			/>
		</Spin>
	);
}
