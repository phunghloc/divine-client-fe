import { useEffect, useState } from 'react';

import axios from '../../axios-constain';

let timer;

export const useSearch = () => {
	const [searchGame, setSearchGame] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [loadingSearch, setLoadingSearch] = useState(false);

	useEffect(() => {
		setLoadingSearch(true);
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
					})
					.finally(() => {
						setLoadingSearch(false);
					});
			}, 200);
		} else {
			setLoadingSearch(false);
			setSearchGame([]);
		}
	}, [searchValue]);

	return { searchGame, searchValue, setSearchValue, loadingSearch };
};
