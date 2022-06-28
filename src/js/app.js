import '../scss/app.scss';

import { makeRequest, notify } from './util';

// const notify = (elem, message, level = 'danger') => {
// 	// alert(message);
// 	elem.querySelector('#display').innerHTML = `
// 		<div class="alert alert-${level} alert-dismissible fade show" role="alert">
// 			${message}
// 			<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove();">
// 				<span aria-hidden="true">&times;</span>
// 			</button>
// 		</div>
// 	`;
// };

const submitContent = async (form) => {
	submitForm.querySelector('button').setAttribute('disabled', 'disabled');

	// const text = form.querySelector('#subject').value;
	const file = form.querySelector('#file').files[0];

	if (file && file.size / 1000 / 1000 > 20) {
		notify(submitForm, 'File size is too large');
		submitForm.querySelector('button').setAttribute('disabled', false);
		return;
	}

	const formdata = new FormData(form);

	let data = undefined;
	try {
		const res = await fetch('/api/', {
			method: 'POST',
			body: formdata,
		});
		data = await res.json();
		if (!res.ok) {
			console.log(data);
			notify(submitForm, data.message);
			throw data.message;
		}

		submitForm.reset();
		document.querySelector('#file-name').textContent = '';
	} catch (error) {
		console.error(error);
		return { error };
	} finally {
		submitForm.querySelector('button').removeAttribute('disabled');
		return { data };
	}
};

const retrieveText = async (code) => {
	retrieveForm.querySelector('button').setAttribute('disabled', 'disabled');
	let data = undefined;
	try {
		const res = await fetch(`/api/${code}`);
		data = await res.json();
		retrieveForm.reset();
	} catch (error) {
		// console.error(error);
		notify(retrieveForm, error);
	} finally {
		retrieveForm.querySelector('button').removeAttribute('disabled');
		return data;
	}
};

const fileInput = document.querySelector('#file');
const submitForm = document.querySelector('#submit-form');
const retrieveForm = document.querySelector('#retrieve-form');
// document.getElementById('submit')

fileInput?.addEventListener('change', function (e) {
	console.log(e.target.files[0]);
	const fileName = e.target.files[0].name;
	const fileSize = e.target.files[0].size;

	document.querySelector('#file-name').textContent = `${fileName}: (${(
		fileSize /
		1000 /
		1000
	).toFixed(2)} MB)`;
});

const displayFile = (file, text) => {
	const displayArea = document.querySelector('#retrieved-file');
	displayArea.classList.remove('hide');
	if (!file) {
		displayArea.querySelector(
			'.file-link'
		).innerHTML = `<a href='/login'>This code contains a file. Login to Retrieve Files</a>`;
		return;
	}

	displayArea.querySelector('.file-link').innerHTML = `
		<h4>${text} [${file?.name}] - ${file?.size / 1000} KB</h4>
		<p class='mt-1'><a href='${
			file?.link
		}' class='text-light'>Click to Download</a></p>
	`;
};

submitForm.addEventListener('submit', async function (e) {
	e.preventDefault();
	const formData = new FormData(this);

	try {
		const { data, error } = await makeRequest({
			url: '/api/',
			method: 'POST',
			data: formData,
		});

		if (data?.code) {
			retrieveForm.code.value = data?.code;
			navigator.clipboard.writeText(data.code);
			notify(submitForm.querySelector('#display'), 'Success', 'success');
		} else {
			notify(submitForm.querySelector('#display'), error, 'danger');
		}
	} catch (err) {
		console.error(err);
		notify(submitForm.querySelector('#display'), err, 'danger');
	}
	// console.log(data, error);
});

retrieveForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	try {
		// const code = this.code.value;
		// let { text, file } = await retrieveText(code);
		// submitForm.text.value = text;
		// displayFile(file, text);
		// navigator.clipboard.writeText(text);

		// notify(retrieveForm, 'The data has been retrieved', 'success');

		const code = this.code.value;

		const { data, error } = await makeRequest({
			url: '/api/' + code,
			method: 'get',
		});

		if (error) {
			console.log(error);
			throw error.message || error;
			return;
		}

		if (data?.file) {
			displayFile(undefined, data.text);
		}

		navigator.clipboard.writeText(data.text);
		notify(retrieveForm.querySelector('#display'), 'Success', 'success');
		submitForm.text.value = data.text;
	} catch (error) {
		console.error(error);
		notify(retrieveForm.querySelector('#display'), error, 'danger');
	}
});
