function guestDeny(id, token, res) {
	if (id == 'guest' && token == 'guest') {
		res.status(400).json({ ok: false, message: 'You can not change the authorized user on the DEMO version' });
		return false;
	}
	return true;
}
exports.guestDeny = guestDeny;
function requestActions(res_post, res, req_post) {
	res_post.on('data', (data) => {
		const data_obj = JSON.parse(data);
		if (data_obj.ok === true) {
			res.status(200).send(data_obj);
		} else {
			res.status(res_post.statusCode).send(data_obj);
		}
	});
	req_post.on('error', (e) => {
		console.error(e);
		res.status(500).json({ ok: false, message: 'internal server error, please try again later and check your internet connection' });
	});
}
exports.requestActions = requestActions;
function checkIDToken(id, res, token) {
	if (!id) {
		res.status(400).json({ ok: false, message: 'missing ID or email' });
		return false;
	}
	if (!token) {
		res.status(400).json({ ok: false, message: 'missing token or password' });
		return false;
	}
	return true;
}
exports.checkIDToken = checkIDToken;
function checkURL(url, res) {
	if (!url) {
		res.status(400).json({ ok: false, message: 'missing url' });
		return false;
	}
	return true;
}
exports.checkURL = checkURL;
