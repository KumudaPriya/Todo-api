var person = {
	name : 'kumuda',
	age : 17
};

function updatePerson (obj) {
	// obj = {
	// 	name : 'kumuda',
	// 	age : 18
	// };

	obj.age = 18;
}

updatePerson(person);
console.log(person);

var array = [18 , 19];

function updateArray( dummy ) {

	//dummy = [18 , 19 , 20];
	dummy.push(20);
}

updateArray(array);
console.log(array);
