var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});


var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});


var User = sequelize.define('user', {
	email: {
		type: Sequelize.STRING
	}
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	//force: true
}).then(function() {
	console.log('Everything is synced');


	User.findById(1).then(function(user) {
		if(!user) {
			console.log('no user');
		}
		return user.getTodos({
			where: {
				completed: true
			}
		});
	}).then(function(todos) {
		todos.forEach( function (todo) {
			console.log(todo.toJSON());
		});
	}).catch(function(e) {
		console.error(e);
	});

	/*User.create({email : 'andrew@example.com'}).then(function (user) {
		Todo.create({description : 'Morning Excercise' , completed : 'true'}).then(function (todo) {
			user.addTodo(todo);
		},function(e) {
			console.error(e);
		});	
	},function (e) {
		console.error(e);
	});*/

});