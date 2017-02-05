'use strict';

// Here, we are writing variables for the node packages that we are requiring. 

var mysql = require("mysql");
var inquirer = require("inquirer");
var myPassword = require('./keys.js');
var table = require ("console.table");

// Here, I am creating a connection variabel for the mysql server.
var connection = mysql.createConnection(
{
	host: "127.0.0.1",
	port: 3306,

	user: "root",

	password: myPassword.mySQLKey.password,
	database: "Bamazon"
});

// Here, I am using the connect method to connect to the MYSQL server. This syntax is defined in W3 as common practice. 
connection.connect(function(err){
	if(err) throw err;
	console.log("Connected as id: " + connection.threadId);
});

// Here, I am running the displayTable function, which displays the table for the user in terminal. I am writing the inquirer prompt as a callback, because I want the prompt to run after the displayTable function as completed. Initially, I had both of them global and since the query for the table data was asynchroneous and was not completeing, the inquirer function was completing first, and the table was being displayed after the inquierer return. 
displayTable(promptUser);

// Here, we define the promptUser function, which is the inquierer prompt, and also, returns the data into a then method, which runs a function that returns the data we are looking for from the table. 
function promptUser(){
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
				
				// Here, I am creating a variable that will take the column value of price with the index that is being returned, and multiply it by the amount of products that the user orders. 
				var yourCost = res[0].price * response.amount;
				console.log("Amount you spent: " + yourCost);
				console.log("You dog. You spent some money!");
				displayTable();

			}
			// Here, we are writing a case for if the stock quantity is = 0, then we tell the user we don't have any product at the time.Then we run the promtpContinue function 
			else if(res.stock_quantity === 0){
				console.log("We are sorry, we dont have " + res[0].product_name + "at this time.");
				promptContinue();

			}

			// This is the result of the only other condition that can exist, where the quantity that was asked for is more than the amount bamazon has on hand. Then we run the promtpContinue function 
			else {
				console.log("We do not have enough of " + res[0].product_name + " in stock to sell you.");
				promptContinue();
			}

		});
});
}



// 
function displayTable(callback){
	// Here, I am creating a query for the connection to mysql, and consoling the data that is in the table. 
	connection.query('Select * FROM products', function(err, res){
		// for (var i = 0; i< res.length; i++){
		// 	console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		// }
		console.table(res);
		console.log("-----------------");

		if(callback){
			callback();
		}
		else{
			promptContinue();
		}
	});
}

function promptContinue(){
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'continue',
			message: 'Would you like to purchase something else?'
		}
	]).then(function(response){
		if(response.continue){
			console.log();
			displayTable(promptUser);
		}

		else{
			console.log("Come back soon!");
			connection.end();
		}
	});
}
