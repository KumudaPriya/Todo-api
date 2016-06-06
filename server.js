var express = require('express');
var app = express();
var PORT = process.env.PORT || 3002;

var todos = [{
	id : 1, 
	description : 'Meet mom for lunch',
	completed : false
} , {
	id : 2,
	description : 'Go to market to pick up boquet',
	completed : false
} , {
	id: 3,
	description : 'Complete Home Work',
	completed : true
}];

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

app.listen(PORT , function() {
	console.log("server is working");
});