var cryptojs = require('crypto-js');

module.exports = function(db) {
	return {

		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth') || '';

			// To chech whether hashed token is present in database
			db.token.findOne({
				hashedToken: cryptojs.MD5(token).toString()

			}).then(function(tokenInstance) {
				if(!tokenInstance) {
					throw new Error();
				}
				
				req.tokenInstance = tokenInstance;
				// To check whether there is a registered user with ths token
				return db.user.findByToken(token);

			}).then(function(user) {
				req.user = user;
				next();

			}).catch(function() {
				res.status(401).send();
			});

			
		}
	};
}