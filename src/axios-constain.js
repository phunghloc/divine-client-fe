import axios from 'axios';

const constain = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

export default constain;
