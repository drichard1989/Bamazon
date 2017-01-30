var mysql = require("mysql");

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

