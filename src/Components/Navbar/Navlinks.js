import {
	HomeOutlined,
	TrophyOutlined,
	CommentOutlined,
} from '@ant-design/icons';

export const navlinks = [
	{ link: '/', exact: true, title: 'Trang chủ', icon: <HomeOutlined /> },
	{
		link: '/doi-ma',
		exact: false,
		title: 'Keygame',
		icon: <TrophyOutlined />,
	},
	{
		link: '/cong-dong',
		exact: false,
		title: 'Cộng đồng',
		icon: <CommentOutlined />,
	},
];
