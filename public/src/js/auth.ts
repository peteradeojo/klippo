export const fetchToken = (): string | null => {
	const token = sessionStorage.getItem('token');
	if (token) {
		return token;
	}

	return null;
};

export const post = async (
	url: string,
	data: string | FormData
): Promise<object | Error> => {
	const token = fetchToken();

	try {
		const res = await fetch(url, {
			method: 'post',
			body: data,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type':
					typeof data === 'string' ? 'application/json' : 'multipart/form-data',
			},
		});

		return await res.json();
	} catch (err) {
		throw err;
	}
};

export const get = async (url: string): Promise<object | Error> => {
	const token = fetchToken();

	try {
		const res = await fetch(url, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return await res.json();
	} catch (err) {
		throw err;
	}
};
