import '../scss/app.scss';

const notify = (elem, message) => {
	console.log(message);
};

const submitContent = async (text) => {
	submitForm.querySelector('button').setAttribute('disabled', 'disabled');
	let data = undefined;
	try {
		const res = await fetch('/api/', {
			method: 'POST',
			body: JSON.stringify({
				text,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});
		data = await res.json();
		console.log(data);
	} catch (error) {
		console.error(error);
	} finally {
		submitForm.reset();
		submitForm.querySelector('button').removeAttribute('disabled');
		return data;
	}
};

const retrieveText = async (code) => {
	retrieveForm.querySelector('button').setAttribute('disabled', 'disabled');
	let data = undefined;
	try {
		const res = await fetch(`/api/${code}`);
		data = await res.json();
		console.log(data);
	} catch (error) {
		console.error(error);
	} finally {
		retrieveForm.querySelector('button').removeAttribute('disabled');
		return data;
	}
};

const submitForm = document.querySelector('#submit-form');
const retrieveForm = document.querySelector('#retrieve-form');
// document.getElementById('submit')

submitForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const text = this.text.value;
	let { code } = await submitContent(text);
	// console.log(code);
	retrieveForm.code.value = code;
	navigator.clipboard.writeText(code);
	notify(submitForm, 'The text has been submitted');
});

retrieveForm.addEventListener('submit', async function (e) {
	e.preventDefault();

	const code = this.code.value;
	let { text } = await retrieveText(code);
	submitForm.text.value = text;
	navigator.clipboard.writeText(text);

	notify(retrieveForm, 'The text has been retrieved');
});
