var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3005;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var queryParams = req.query;
	var where = {};
	where.userId = req.user.id;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
		where.description = {
			$like: '%' + queryParams.q.trim() + '%'
		};
	}
	console.log(where);

	db.todo.findAll({
		where: where
	}).then(function(todos) {

		if (todos.length > 0) {

			res.json(todos);

		} else {
			res.status(404).send('no items found');
		}
	}).catch(function(e) {
		res.status(500).send(e.message);
	});

	// var filteredTodos = todos;

	// console.log(queryParams);
	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q')) {

	// 	filteredTodos = _.filter(filteredTodos, function(item) {
	// 		return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
});

app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var TodoId = parseInt(req.params.id);
	var where = {};
	where.userId = req.user.id;
	where.id = TodoId;

	db.todo.findOne({
		where: where
	}).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('no todo item with this item');
		}

	}).catch(function(e) {
		res.status(500).json(e);
	});
	// var matchedObj = _.findWhere(todos, {
	// 	id: TodoId
	// });

	// if (matchedObj) {
	// 	res.json(matchedObj);
	// } else {
	// 	res.status(404).send();
	// }


});


app.post('/todos', middleware.requireAuthentication, function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');


	db.todo.create(body)
		.then(function(todo) {

			//res.json(todo.toJSON());
			req.user.addTodo(todo).then(function() {
				return todo.reload();
			}).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				console.error(e);
				res.status(400).json(e);
			});

		}, function(e) {
			console.log(e);
			res.status(400).json(e);
		});



});

app.post('/users', function(req, res) {

	var body = _.pick(req.body, 'email', 'password');


	db.user.create(body)
		.then(function(user) {

			res.json(user.toPublicJSON());
		}).catch(function(e) {
			console.log(e);
			res.status(400).json(e);
		});



});

app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token : token
		})
			
		
	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function() {
		res.status(401).send();
	});

	// db.user.authenticate(body).then(function(user) {
	// 	var token = user.generateToken('authentication');
	// 	if (token) {
	// 		res.header('Auth', token).json(user.toPublicJSON());
	// 	} else {
	// 		res.status(401).send();
	// 	}

	// }, function() {
	// 	res.status(401).send();
	// });

});

app.delete('/users/login' , middleware.requireAuthentication , function(req , res) {
	
	req.tokenInstance.destroy().then(function () {
		res.status(204).send('succesfully logged out');
	} , function(e) {
		res.status(401).send();
	});
});

app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var TodoId = parseInt(req.params.id);
	var body = req.body;


	db.todo.destroy({
		where: {
			id: TodoId,
			userId: req.user.id
		}
	}).then(function(affectedRows) {

		if (affectedRows >= 1) {
			res.send('succesfully deleted');
		} else {
			res.status(400).send('no item with this id');
		}
	}).catch(function(e) {
		console.log(e.message);
		res.status(400).send(e.message);
	});


	// var matchedObj = _.findWhere(todos, {
	// 	id: TodoId
	// });

	// if (!_.isObject(matchedObj)) {
	// 	return res.status(404).send('object is not found');
	// }

	// todos = _.without(todos, matchedObj);
	// res.json(matchedObj);

});



app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var ValidAttributes = {};


	var todoId = parseInt(req.params.id, 10);
	var where = {};
	where.userId = req.user.id;
	where.id = todoId;

	if (body.hasOwnProperty('completed')) {
		ValidAttributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		ValidAttributes.description = body.description;
	}

	db.todo.findOne({
		where: where
	}).then(function(todo) {
		if (todo) {
			todo.update(ValidAttributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				return res.status(400).json(e);
			});
		} else {
			res.status(404).send('no todo item with this item');
		}

	}, function(e) {
		res.status(500).json(e);
	});



});

db.sequelize.sync({
	force: true
}).then(function() {

	app.listen(PORT, function() {
		console.log("server is working");
	});
});