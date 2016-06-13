var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3005;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/' , function (req , res) {
	res.send('Todo API Root');
});


app.get('/todos' , function(req , res) {
	res.json(todos);
});

app.get('/todos/:id' , function (req, res) {
	var TodoId = parseInt(req.params.id);
	var matchedObj =  _.findWhere(todos , {id : TodoId });
	
	if(matchedObj) {
		res.json(matchedObj);
	}else {
		res.status(404).send();
	}


});


app.post('/todos', function(req , res) {

	console.log('present no of id'+todoNextId);
	var body = _.pick(req.body , 'description' ,'completed');
	

	if(!_.isObject(body) || !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {

		return res.status(400).send();
	}
	
	//body = _.pick(body , 'description' ,'completed');
	body.description = body.description.trim();
	body.id = todoNextId;
		
	todos.push(body);
	todoNextId = todoNextId + 1;

	console.log(body);

	
	res.json(body);

});

app.delete('/todos/:id' , function(req , res) {
	var TodoId = parseInt(req.params.id);
	var body = req.body;
	var matchedObj =  _.findWhere(todos , {id : TodoId });

	if(!_.isObject(matchedObj)) {
		return res.status(404).send('object is not found');
	}

	todos = _.without(todos , matchedObj);
	res.json(matchedObj);

});

 

app.put('/todos/:id' , function(req , res) {
	var body = _.pick(req.body , 'description' ,'completed');
	var ValidAttributes = {};

	var todoId = parseInt(req.params.id , 10);
	var matchedObj =  _.findWhere(todos , {id : todoId });

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		ValidAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')) {
		console.log('error1');
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >  0) {
		ValidAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')) {
		console.log('error2');
		return res.status(400).send();
	}

	console.log('ValidAttributes : ');
	console.log(ValidAttributes);
	_.extend(matchedObj , ValidAttributes);
	res.json(matchedObj);

});

app.listen(PORT , function() {
	console.log("server is working");
});