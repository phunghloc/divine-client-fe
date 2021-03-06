import React from 'react';
import { Modal } from 'antd';

const ErrorModal = (props) => {
	const error = () => {
		Modal.error({
			title: 'Đã có lỗi xảy ra!',
			content: props.errorText,
			onOk: () => {
				props.setError(null);
				Modal.destroyAll();
			},
			okText: 'Đóng',
			closable: true,
		});
	};
	return <>{props.visible && error()}</>;
};

export default ErrorModal;
