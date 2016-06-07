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

app.listen(PORT , function() {
	console.log("server is working");
});