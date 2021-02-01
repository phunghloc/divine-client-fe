import React from 'react';
import { Comment, Avatar, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

import UlityBtn from './UlityBtn';

moment.locale('vi');

export default function CommentInPost(props) {
	return (
		<Comment
			author={
				<>
					<Link to={`/tai-khoan/${props.userId._id}`}>{props.userId.name}</Link>
					{props.uid === props.userId._id && (
						<UlityBtn
							delete={props.delete}
							postId={props.postId}
							commentId={props._id}
						/>
					)}
				</>
			}
			avatar={<Avatar src={props.userId.avatar} alt={props.userId.name} />}
			content={<p>{props.comment}</p>}
			datetime={
				<Tooltip title={moment(props.commentDate).format('LLLL')}>
					<span style={{ color: '#999' }}>
						{moment(props.commentDate).fromNow()}
					</span>
				</Tooltip>
			}
		></Comment>
	);
}
