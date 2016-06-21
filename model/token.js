var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('token' , {
		token : {
			type : DataTypes.VIRTUAL,
			allowNULL : false,
			validation : {
				len : [1]
			},
			set : function (value) {
				var hash = cryptojs.MD5(value).toString();

				this.setDataValue('token' , value);
				this.setDataValue('hashedToken' , hash);
			}
		} , 
		hashedToken : DataTypes.STRING
	});
};