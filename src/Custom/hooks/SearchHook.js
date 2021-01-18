import { useEffect, useState } from 'react';

import axios from '../../axios-constain';

let timer;

export const useSearch = () => {
	const [searchGame, setSearchGame] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		if (searchValue) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				axios
					.get(`/search-game?name=${searchValue}`)
					.then((res) => {
						setSearchGame(res.data.games);
					})
					.catch((err) => {
						console.log(err);
					});
			}, 200);
		} else {
			setSearchGame([]);
		}
	}, [searchValue]);

	return { searchGame, searchValue, setSearchValue };
};
