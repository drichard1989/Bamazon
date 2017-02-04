// Here, we are simply placing the node packages that we are requiring. 

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require ("cli-table");

// Here, I am creating a connection to the mysql server.
var connection = mysql.createConnection(
{
	host: "127.0.0.1",
	port: 3306,

	user: "root",

	password: "Djokovic2017",
	database: "Bamazon"
});

// Here, I am connecting to that server. 
connection.connect(function(err){
	if(err) throw err;
	console.log("Connected as id: " + connection.threadId);
});

// Here, I am creating a query for the connection to mysql, and consoling the data that is in the table. 
connection.query('Select * FROM products', function(err, res){
	for (var i = 0; i< res.length; i++){
		console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
	}
	console.log("-----------------");
});

// Here, I am running inquerer so that I can prompt the user in terminal to answer questions about what they would like to do. 
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
	}
	


// After the input is taken from the inquierer prompt, I am running a then method that will run a function. 
]).then(function(response){
	console.log(response);
	// Here, I am going to select the stock_quantitycolumn from the products table where the item_id is equal to the id entered by the user.
	connection.query('SELECT stock_quantity, product_name, price FROM products WHERE item_id = ?' , [response.id], function(err, res){
		console.log(res);
		if (err){
			throw err;
		}

		// Now, we are going to write a conditional if statement that says if there is more in stock than requested, then we are going to update the amount available using the amount purchased as the reduction amount.
		if (res[0].stock_quantity >= response.amount) {
			var newInventoryLevel = res[0].stock_quantity - response.amount;
			connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',[newInventoryLevel, response.id], function(error, result){

				if(error){
					throw error;
				}
			});
			
			var yourCost = res[0].price * response.amount;
			console.log("Amount you spent: " + yourCost);
			console.log("You dog. You spent some money!");
			connection.end();

		}

		else if(res.stock_quantity === 0){
			console.log("We are sorry, we dont have " + res[0].product_name + "at this time.");
			connection.end();

		}

		else {
			console.log("We do not have enough of " + res[0].product_name + " in stock to sell you.");
			connection.end();
		}

	});
});




