const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection(
{
	host: "127.0.0.1",
	port: 3306,

	user: "root",

	password: "Djokovic2017",
	database: "Bamazon"
});

connection.connect(function(err){
	if(err) throw err;
	console.log("Connected as id: " + connection.threadId);
});

connection.query("Select * FROM products", function(err, res){
	for (var i = 0; i< res.length; i++){
		console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
	}

	console.log("-----------------");
});

inquirer.prompt([
	{
		type: "input",
		message: "Please provide the ID of the product you would like to purchase.",
		name: "id"
	},

	{
		type: "input", 
		message: "How many units of the product would you like to buy?",
		name: "amount"
	},

	{
		type: "confirm",
		message: "Are you sure?",
		name: "confirm",
		default: true
	}

]).then(function(user){

	console.log(JSON.stringify(user, null, 2));

	if (user.confirm){
		console.log("You want " + user.id);
		console.log("You want " + user.amount + " of them.");
	}

	else{
		console.log("Come back when you are ready.")
	}
});
