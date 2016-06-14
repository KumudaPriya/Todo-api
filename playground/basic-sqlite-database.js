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

sequelize.sync({
	//force: true
}).then(function() {
	console.log('Everything is synced');

	Todo.findById(4).then(function (todo) {
		if(todo) {
			console.log(todo.toJSON());
		}else {
			console.log('no item with this id')
		}
	}).catch(function (e) {
		console.log(e);
	});

	/*Todo.create({
		description: 'Take out the trash'

	}).then(function(todo) {
		console.log('Finished!');
		return Todo.create({
			description: 'Clean the home',
			completed: false
		});

	}).then(function(todo) {
		console.log(todo.toJSON());
		//return Todo.findById(1);

		return Todo.findAll({
			where: {
				//completed: false
				description : {
					$like : '%Trash%'
				}
			}
		});
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function  (todo) {
				console.log(todo.toJSON());
			});
			
		} else {
			console.log('no todo item');
		}
	}).catch(function(e) {
		console.log(e);
	});*/
});