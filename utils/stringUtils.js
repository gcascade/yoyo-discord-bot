exports.getUriQueryArgs = function(uri) {
	if (!uri) {
		return;
	}
	const splitUri = uri.split('?');
	if (splitUri.length > 1) {
		const params = {};
		splitUri[1].split('&').map(param => {
			const kv = param.split('=');
			params[kv[0]] = kv[1];
		});
		return params;
	}

	return;
};