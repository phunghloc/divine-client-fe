import React, { useState } from 'react';
import Slider from 'react-slick';
import { Image } from 'antd';

export default function CarouselSync(props) {
	const [nav1, setNav1] = useState(null);
	const [nav2, setNav2] = useState(null);

	return (
		<div>
			<Slider
				arrows={false}
				fade={true}
				asNavFor={nav2}
				ref={(slider) => setNav1(slider)}
			>
				{props.images.map((image) => (
					<div key={image.url} style={{ display: 'flex' }}>
						<img
							src={image.url}
							alt={image.path}
							width={'100%'}
							height={'100%'}
							style={{ margin: 'auto' }}
						/>
					</div>
				))}
			</Slider>
			<Slider
				asNavFor={nav1}
				ref={(slider) => setNav2(slider)}
				slidesToShow={3}
				swipeToSlide={true}
				focusOnSelect={true}
				arrows={false}
				centerMode={true}
				autoplay={true}
				autoplaySpeed={4000}
				responsive={[
					{
						breakpoint: 792,
						settings: {
							slidesToShow: 2,
						},
					},
					{
						breakpoint: 576,
						settings: {
							slidesToShow: 1,
						},
					},
				]}
			>
				{props.images.map((image) => (
					<div key={image.url}>
						<Image
							src={image.url}
							alt={image.path}
							preview={false}
							height={100}
						/>
					</div>
				))}
			</Slider>
		</div>
	);
}
