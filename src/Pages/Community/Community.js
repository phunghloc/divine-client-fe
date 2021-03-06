import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Divider, Layout, List, Modal } from 'antd';
import OpenSocket from 'socket.io-client';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/vi';

import './Community.scss';
import Post from './components/Post';
import axios from '../../axios-constain';
import Skeleton from './components/Skeleton';
import CreatePost from './components/CreatePost';
import { AuthContext } from '../../Custom/context/AuthContext';

moment.locale('vi');

export default function Community(props) {
	const { userData } = useContext(AuthContext);
	const [posts, setPosts] = useState([]);
	const [lastPostId, setLastPostId] = useState(null);
	const [, setTimer] = useState(null);
	const [hasMore, setHasMore] = useState(true);

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

	const fetchPosts = useCallback((url, config = {}, page = 1) => {
		axios
			.get(url, config)
			.then((res) => {
				setPosts((posts) => {
					if (res.data.posts.length < 2) {
						setHasMore(false);
					}
					return posts.concat(res.data.posts);
				});
			})
			.catch((err) => {
				const errorText = err.response ? err.response.data.message : null;
				openErrorModal(errorText);
			});
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
		setPosts([]);
	}, []);

	useEffect(() => {
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

				if (lastPostId) url += `?lastPostId=${lastPostId}`;

				fetchPosts(url, config);
			}, 50);
		});
	}, [fetchPosts, lastPostId]);

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
			{!posts.length ? (
				<Skeleton />
			) : (
				<InfiniteScroll
					dataLength={posts.length}
					next={() => setLastPostId((page) => posts[posts.length - 1]._id)}
					hasMore={hasMore}
					loader={<Skeleton />}
					endMessage={<Divider>Đã hết bài đăng</Divider>}
				>
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
				</InfiniteScroll>
			)}
		</Layout.Content>
	);
}
