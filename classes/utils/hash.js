var md5Hash = function(str) {
	var crypto = require('crypto');
	return crypto.createHash('md5').update(str).digest("hex");
}

module.exports.md5Hash = md5Hash;