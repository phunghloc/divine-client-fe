import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, List, Modal } from 'antd';
import OpenSocket from 'socket.io-client';
import moment from 'moment';
import 'moment/locale/vi';

import './Community.scss';
import Post from './components/Post';
import axios from '../../axios-constain';
import Skeleton from './components/Skeleton';
import { AuthContext } from '../../Custom/context/AuthContext';

moment.locale('vi');

export default function OnePost(props) {
	const { userData } = useContext(AuthContext);
	const [posts, setPosts] = useState([]);
	const [notFound, setNotFound] = useState(false);
	const [, setTimer] = useState(null);

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
					newPosts[postIndex].commentsCount++;
				}

				return newPosts;
			});
		});

		socket.on('new post', (newPost) => {
			setPosts((posts) => {
				console.log(newPost);
				console.log(posts);
				return [newPost, ...posts];
			});
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

	const fetchPosts = useCallback(
		(url, config = {}, page = 1) => {
			const postId = props.match.params.postId;
			axios
				.get(url, config)
				.then((res) => {
					setPosts((posts) => {
						if (postId) {
							return res.data.posts;
						}

						return posts.concat(res.data.posts);
					});
				})
				.catch((err) => {
					setNotFound(err.response.status);
				});
		},
		[props.match.params.postId],
	);

	useEffect(() => {
		window.scrollTo(0, 0);
		setPosts([]);
	}, []);

	useEffect(() => {
		const postId = props.match.params.postId;
		setTimer((timer) => {
			clearInterval(timer);
			return setTimeout(() => {
				const token = localStorage.getItem('token');
				let url = '/posts/';
				let config = {};

				if (token) {
					config = {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					};
				}

				if (postId) {
					url += postId;
				}

				fetchPosts(url, config);
			}, 50);
		});
	}, [props.match.params.postId, fetchPosts]);

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

	if (notFound === 404) return <Redirect to="/404" />;

	return (
		<Layout.Content className="container community">
			{!posts.length ? (
				<Skeleton />
			) : (
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
			)}
		</Layout.Content>
	);
}
