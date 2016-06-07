var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3004;

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
	var TodoId = req.params.id;
	
	var i;
	for(i = 0 ; i < todos.length ; i++) {
		
		if(todos[i].id.toString()  === TodoId) {     //converting numbert to string todos[i].id.toString()
			
			
			res.json(todos[i]);
		}
	}

	
	res.status(404).send();

	//res.send('you have requested for object with id : ' +TodoId );

});


app.post('/todos', function(req , res) {
	var body = req.body;
	

	if(body){

		body.id = todoNextId;
		
		todos.push(body);
		todoNextId = todoNextId + 1;

		console.log(body);
	}
	
	res.json(body);

});

app.listen(PORT , function() {
	console.log("server is working");
});