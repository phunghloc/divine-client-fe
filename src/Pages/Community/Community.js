import React, { useContext, useEffect, useState } from 'react';
import { Layout, List, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import OpenSocket from 'socket.io-client';

import './Community.scss';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import axios from '../../axios-constain';
import { AuthContext } from '../../Custom/context/AuthContext';
import Skeleton from './components/Skeleton';

moment.locale('vi');

export default function Community() {
	const { userData } = useContext(AuthContext);
	const [posts, setPosts] = useState([]);
	const [loadingPosts, setLoadingPosts] = useState(false);

	useEffect(() => {
		const socket = OpenSocket(process.env.REACT_APP_BASE_URL);

		socket.emit('join community');

		socket.on('update comment', (response) => {
			setPosts((posts) => {
				const newPosts = [...posts];
				const postIndex = newPosts.findIndex(
					(post) => post._id === response.postId,
				);
				if (postIndex >= 0) {
					newPosts[postIndex].comments.push({
						...response,
						commentDate: Date.now(),
					});
				}

				return newPosts;
			});
		});

		socket.on('new post', (newPost) => {
			setPosts((posts) => [newPost, ...posts]);
		});

		socket.on('delete comment', (data) => {
			setPosts((posts) => {
				const newPosts = [...posts];
				const postIndex = newPosts.findIndex((p) => p._id === data.postId);

				if (postIndex >= 0) {
					newPosts[postIndex].comments = newPosts[postIndex].comments.filter(
						(comment) => comment._id !== data.commentId,
					);
				}

				return newPosts;
			});
		});

		socket.on('delete post', (data) => {
			setPosts((posts) => {
				return posts.filter((post) => post._id !== data.postId);
			});
		});

		return () => {
			socket.emit('leave community');
		};
	}, []);

	useEffect(() => {
		const timeout = !!userData ? 10 : 0;
		setTimeout(() => {
			setLoadingPosts(true);
			let config = {};
			if (!!userData) {
				const token = localStorage.getItem('token');
				config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
			}
			axios
				.get('/posts', config)
				.then((res) => {
					setPosts(res.data.posts);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setLoadingPosts(false);
				});
		}, timeout);
	}, [userData]);

	const changeLikeStatus = (postId, likedThisPost, likes) => {
		setPosts((prev) => {
			const newPosts = [...prev];
			const postIndex = newPosts.findIndex((post) => post._id === postId);
			newPosts[postIndex].likedThisPost = likedThisPost;
			newPosts[postIndex].likes = likes;
			return newPosts;
		});
	};

	const openErrorModal = (
		textError = 'Có lỗi chưa xác định xảy ra. Vui lòng reload lại trang và thử lại sau!',
	) => {
		Modal.error({
			title: 'Có lỗi xảy ra',
			content: textError,
			okText: 'Xác nhận',
		});
	};

	const editCommentHandler = (postId, commentId, newComment) => {
		setPosts((posts) => {
			const newPosts = [...posts];
			const postIndex = newPosts.findIndex((p) => p._id === postId);
			if (postIndex >= 0) {
				const commentIndex = newPosts[postIndex].comments.findIndex(
					(c) => c._id === commentId,
				);
				if (commentIndex >= 0) {
					newPosts[postIndex].comments[commentIndex].comment = newComment;
				}
			}
			return newPosts;
		});
	};

	const loadMoreCommentHandler = (postId, additionalComment) => {
		setPosts((posts) => {
			const newPosts = [...posts];
			const postIndex = newPosts.findIndex((post) => post._id === postId);
			if (postIndex >= 0) {
				newPosts[postIndex].comments.unshift(...additionalComment);
			}

			return newPosts;
		});
	};

	return (
		<Layout.Content className="container community">
			<CreatePost userData={userData} openErrorModal={openErrorModal} />

			{!loadingPosts ? (
				<List
					itemLayout="vertical"
					size="large"
					dataSource={posts}
					renderItem={(post) => (
						<Post
							key={post._id}
							{...post}
							userData={userData}
							changeLikeStatus={changeLikeStatus}
							openErrorModal={openErrorModal}
							editCommentHandler={editCommentHandler}
							loadMoreCommentHandler={loadMoreCommentHandler}
						/>
					)}
				/>
			) : (
				<Skeleton />
			)}
		</Layout.Content>
	);
}
