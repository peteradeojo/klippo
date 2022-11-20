import './scss/index.scss';

import { IClip } from '../../src/models/Clip';
import { get, post } from './js/auth';
import { displayOutput, Response as UIResponse } from './js/ui';

// Path: public\src\index.js
const inputForm = document.querySelector(
	'#input-form'
) as HTMLFormElement | null;

inputForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const inputTitle = (
		inputForm.querySelector('#input-title') as HTMLInputElement
	).value;

	const inputContent = (
		inputForm.querySelector('#input-textarea') as HTMLInputElement
	).value;

	if (!inputTitle || !inputContent) {
		return alert('Please fill out all fields');
	}

	try {
		const res = (await post(
			'/',
			JSON.stringify({ title: inputTitle, content: inputContent })
		)) as UIResponse<IClip>;

		displayOutput<IClip>(res.data);
	} catch (err) {
		console.error(err);
	} finally {
		inputForm.reset();
	}
});

const searchForm = document.querySelector(
	'#search-form'
) as HTMLFormElement | null;

searchForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const searchInput = (
		searchForm.querySelector('#search-input') as HTMLInputElement
	).value;

	if (!searchInput) {
		return alert('Please enter a code');
	}

	try {
		const res = (await get('/' + searchInput)) as UIResponse<IClip>;

		displayOutput<IClip>(res.data);
	} catch (err) {
		console.error(err);
	} finally {
		searchForm.reset();
	}
});
