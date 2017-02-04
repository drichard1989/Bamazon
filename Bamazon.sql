CREATE DATABASE IF NOT EXISTS Bamazon;

USE Bamazon;

CREATE TABLE IF NOT EXISTS products(
	item_id INT NOT NULL AUTO_INCREMENT
	, product_name VARCHAR(30) NOT NULL
	, department_name VARCHAR(30) NOT NULL
	, price INT(10) NOT NULL
	, stock_quantity INT (5)
	, PRIMARY KEY (item_id)
	
);









