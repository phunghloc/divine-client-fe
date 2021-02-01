import React, { useEffect, useRef, useState } from 'react';
import { Comment, Avatar, Input, Spin } from 'antd';

import axios from '../../../axios-constain';

export default function CommentEditor(props) {
	const inputRef = useRef();
	const [comment, setComment] = useState(props.oldComment || '');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		!!props.clickRef && inputRef.current.focus();
	}, [props.clickRef]);

	const submitCommentHandler = () => {
		setSubmitting(true);

		const token = localStorage.getItem('token');
		axios
			.post(
				props.urlPost,
				{ comment: comment.trim() },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				console.log(res);
				setComment('');
				setSubmitting(false);
			})
			.catch((err) => {
				setSubmitting(false);
				console.log(err);
			});
	};

	const changeCommentInputHandler = (e) => {
		setComment(e.target.value);
	};

	const checkKeyPress = (e) => {
		if (e.code === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
			submitCommentHandler();
		}
	};

	return (
		<Spin spinning={submitting}>
			<Comment
				className="comment-editor"
				avatar={
					<Avatar src={props.userData.avatar} alt={props.userData.name} />
				}
				content={
					<Input.TextArea
						rows={1}
						ref={inputRef}
						autoSize
						onChange={changeCommentInputHandler}
						value={comment}
						onKeyPress={checkKeyPress}
						placeholder="Nhập bình luận..."
						size="large"
					/>
				}
			/>
		</Spin>
	);
}
