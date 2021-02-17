import React, { useState } from 'react';
import {
	List,
	Avatar,
	Button,
	Image,
	Space,
	Divider,
	Modal,
	message,
} from 'antd';
import { LikeFilled, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

import UlityBtn from './UlityBtn';
import CommentEditor from './CommentEditor';
import CommentInPost from './CommentInPost';
import axios from '../../../axios-constain';

moment.locale('vi');

const IconText = ({ icon, text }) => (
	<Space>
		{React.createElement(icon)}
		{text}
	</Space>
);

export default function Post(props) {
	const [loadingLike, setLoadingLike] = useState(false);
	const [loadingMoreComment, setLoadingMoreComment] = useState(false);
	const [clickRef, setClickRef] = useState(null);

	const likePost = (postId) => {
		const token = localStorage.getItem('token');
		if (!token) return;
		setLoadingLike(true);
		axios
			.get(`/posts/toggle-like/${postId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				const { likedThisPost, likes } = res.data;
				props.changeLikeStatus(postId, likedThisPost, likes);
			})
			.catch((err) => {
				const content = err.response ? err.response.data.message : null;
				props.openErrorModal(content);
			})
			.finally(() => {
				setLoadingLike(false);
			});
	};

	const openConfirmDeleteCommentHandler = (postId, commentId) => {
		Modal.confirm({
			title: 'Xác nhận',
			content: `Bạn có chắc chắn muốn xóa ${
				commentId ? 'bình luận' : 'bài đăng'
			} này không?`,
			okText: 'Xóa',
			onOk: () => {
				deleteCommentHandler(postId, commentId);
			},
			okButtonProps: {
				danger: true,
			},
			cancelText: 'Huỷ bỏ',
		});
	};

	const deleteCommentHandler = (postId, commentId) => {
		const URL = `/posts/delete/${postId}/${commentId || ''}`;
		const token = localStorage.getItem('token');

		const loadingMessage = message.loading('Đang xóa...', 0);

		axios
			.delete(URL, { headers: { Authorization: `Bearer ${token}` } })
			.then((res) => {
				console.log(res);
				message.success('Đã xóa.', 3);
			})
			.catch((err) => {
				const content = err.response ? err.response.data.message : null;
				props.openErrorModal(content);
			})
			.finally(() => {
				loadingMessage();
			});
	};

	const loadMoreCommentHandler = () => {
		setLoadingMoreComment(true);
		axios
			.get(`/posts/loadmore/${props._id}/${props.comments[0]._id}`)
			.then((res) => {
				props.loadMoreCommentHandler(props._id, res.data.comments);
			})
			.catch((err) => {
				props.openErrorModal();
			})
			.finally(() => {
				setLoadingMoreComment(false);
			});
	};

	const editPostHandler = () => {
		console.log('edit post');
	};

	return (
		<List.Item className="community-item post-item">
			<List.Item.Meta
				avatar={
					<Avatar
						size="large"
						src={props.userId.avatar}
						alt={props.userId.name}
					/>
				}
				title={
					<Link to={`/tai-khoan/${props.userId._id}`}>{props.userId.name}</Link>
				}
				description={
					<Link to={`/cong-dong/${props._id}`}>
						{moment(props.createdAt).fromNow()}
					</Link>
				}
			/>
			<p>{props.content}</p>
			{!!props.images.length && (
				<Image src={props.images[0].url} width={'100%'} alt="Anh minh hoa" />
			)}
			<ul className="like-comment-count">
				<li>
					<IconText
						icon={LikeFilled}
						text={props.likes}
						key="list-vertical-like-o"
					/>
				</li>
				<li>
					<IconText
						icon={MessageOutlined}
						text={props.commentsCount}
						key="list-vertical-message"
					/>
				</li>
			</ul>

			{!!props.userData ? (
				<ul className="ulity-btn-group">
					<li>
						<Button
							block
							loading={loadingLike}
							onClick={() => likePost(props._id)}
							className={props.likedThisPost ? 'liked' : ''}
							icon={<LikeFilled style={{ fontSize: 18 }} />}
						>
							{!props.likedThisPost ? 'Thích' : 'Đã thích'}
						</Button>
					</li>
					<li>
						<Button
							block
							onClick={setClickRef}
							icon={<MessageOutlined style={{ fontSize: 18 }} />}
						>
							Bình luận
						</Button>
					</li>
				</ul>
			) : (
				<Divider style={{ marginBottom: 12 }} />
			)}

			{props.comments.length < props.commentsCount && (
				<div className="loadmore-btn">
					<Button
						type="link"
						size="small"
						onClick={loadMoreCommentHandler}
						loading={loadingMoreComment}
					>
						Tải thêm bình luận
					</Button>
				</div>
			)}

			{props.comments.map((comment) => (
				<CommentInPost
					key={comment._id}
					{...comment}
					postId={props._id}
					uid={props.userData ? props.userData.userId : null}
					delete={openConfirmDeleteCommentHandler}
					openErrorModal={props.openErrorModal}
					editCommentHandler={props.editCommentHandler}
				/>
			))}
			{!!props.userData && (
				<CommentEditor
					userData={props.userData}
					clickRef={clickRef}
					urlPost={`/posts/${props._id}/comment`}
					openErrorModal={props.openErrorModal}
				/>
			)}
			{!!props.userData && props.userData.userId === props.userId._id && (
				<UlityBtn
					postId={props._id}
					edit={editPostHandler}
					delete={openConfirmDeleteCommentHandler}
				/>
			)}
		</List.Item>
	);
}
