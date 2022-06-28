export const notify = (elem, message, level = 'danger') => {
	elem.innerHTML = `
		<div class="alert alert-${level} alert-dismissible fade show" role="alert">
			${message}
			<button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove();">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	`;
};

export const makeRequest = async (
	{ url, method = 'GET', data, type, accept = 'json' },
	headers = {}
) => {
	try {
		const methods = ['post', 'put', 'patch', 'get', 'delete'];
		method = method.toLowerCase();

		const options = {};

		if (methods.includes(method)) {
			options.method = method;
			options.body = type == 'json' ? JSON.stringify(data) : data;
		} else {
			return { error: `Invalid method: ${method}` };
		}

		// headers = {
		// 	'Content-type': headers['Content-type'] || 'application/json',
		// 	Accept: headers.Accept || 'application/json',
		// };

		options.headers = headers;

		const res = await fetch(url, options);
		if (res.ok) {
			let data;
			if (accept === 'json') {
				data = await res.json();
			} else {
				data = await res.text();
			}
			return { data };
		} else {
			throw await res.json();
		}
	} catch (error) {
		// console.error(error);
		return { error };
	}
};
