var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


var app = express();
var PORT = process.env.PORT || 3005;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	console.log(queryParams);
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q')) {

		filteredTodos = _.filter(filteredTodos, function(item) {
			return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
	var TodoId = parseInt(req.params.id);

	db.todo.findById(TodoId)
	.then(function (todo) {
		if(todo) {
			res.json(todo.toJSON());
		}else {
			res.status(404).send('no todo item with this item');
		}
		
	}).catch(function (e) {
		res.status(500).json(e);
	}) ;
	// var matchedObj = _.findWhere(todos, {
	// 	id: TodoId
	// });

	// if (matchedObj) {
	// 	res.json(matchedObj);
	// } else {
	// 	res.status(404).send();
	// }


});


app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');


	db.todo.create(body)
	.then(function(todo) {

		res.json(todo.toJSON());
	}).catch(function(e) {
		console.log(e);
		res.status(400).json(e);
	});

	// if (!_.isObject(body) || !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

	// 	return res.status(400).send();
	// }


	// body.description = body.description.trim();
	// body.id = todoNextId;

	// todos.push(body);
	// todoNextId = todoNextId + 1;

	// console.log(body);


	// res.json(body);

});

app.delete('/todos/:id', function(req, res) {
	var TodoId = parseInt(req.params.id);
	var body = req.body;
	var matchedObj = _.findWhere(todos, {
		id: TodoId
	});

	if (!_.isObject(matchedObj)) {
		return res.status(404).send('object is not found');
	}

	todos = _.without(todos, matchedObj);
	res.json(matchedObj);

});



app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var ValidAttributes = {};

	var todoId = parseInt(req.params.id, 10);
	var matchedObj = _.findWhere(todos, {
		id: todoId
	});

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		ValidAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		console.log('error1');
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		ValidAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		console.log('error2');
		return res.status(400).send();
	}

	console.log('ValidAttributes : ');
	console.log(ValidAttributes);
	_.extend(matchedObj, ValidAttributes);
	res.json(matchedObj);

});

db.sequelize.sync().then(function() {

	app.listen(PORT, function() {
		console.log("server is working");
	});
});