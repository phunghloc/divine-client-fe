import React, { useState } from 'react';
import { Form, Select, Modal, Button, Slider } from 'antd';
import { CloseOutlined, FilterOutlined } from '@ant-design/icons';

export default function ModalFilter(props) {
	const [range, setRange] = useState([0, 2000000]);

	return (
		<Modal
			visible={props.showFilter}
			footer={null}
			closable={false}
			onCancel={props.closeFilter}
		>
			<Form name="control-ref" layout="vertical" onFinish={props.submit}>
				<Form.Item
					label="Chọn nhà phát triển:"
					name="developer"
					initialValue=""
				>
					<Select
						showSearch
						style={{ width: '100%' }}
						placeholder="Chọn nhà phát triển"
						allowClear
						size="large"
						filterOption={(input, option) =>
							option.title.toLowerCase().includes(input.toLowerCase())
						}
					>
						<Select.Option value="" title="">
							Tất cả nhà phát triển
						</Select.Option>
						{props.devs.map((dev) => (
							<Select.Option
								key={dev.value}
								title={dev.label}
								value={dev.value}
							>
								{dev.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label="Sắp xếp:" name="sortBy" initialValue="inc-createAt">
					<Select style={{ width: '100%' }} size="large">
						<Select.Option value="inc-name">Tên A -&gt; Z</Select.Option>
						<Select.Option value="dec-name">Tên Z -&gt; A</Select.Option>
						<Select.Option value="inc-price">Giá thấp -&gt; cao</Select.Option>
						<Select.Option value="dec-price">Giá cao -&gt; thấp</Select.Option>
						<Select.Option value="inc-createAt">Mới nhất</Select.Option>
						<Select.Option value="dec-createAt">Cũ nhất</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="price"
					initialValue={[0, 2000000]}
					label="Khoảng giá (VNĐ):"
				>
					<Slider
						range
						min={0}
						max={2000000}
						step={50000}
						onChange={setRange}
						marks={{
							[range[0]]: range[0].toLocaleString(),
							[range[1]]: range[1].toLocaleString(),
						}}
					/>
				</Form.Item>

				<Form.Item className="filter-footer">
					<Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
						Lọc
					</Button>
					<Button
						type="primary"
						danger
						icon={<CloseOutlined />}
						onClick={props.closeFilter}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
}
