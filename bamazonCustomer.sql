DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(10, 2) NULL,
    stock_quantity INTEGER(10) NULL,
    product_sales INTEGER(10) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE departments (
    department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs DECIMAL(10, 2) NULL,
    gross_sales DECIMAL(10, 2) NULL,
    PRIMARY KEY (department_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ball Cap", "Clothing", 40, 100), ("Trucker Hat", "Clothing", 30, 90), ("T-Shirt", "Clothing", 20, 150), ("Capri Pants", "Clothing", 28, 80), ("Computer Mouse", "Electronics", 8.95, 75),("Bobble Head", "Toys", 12.99, 30), ("Crock Pot", "Kitchen Items", 64.95, 85), ("Thermos", "Camping Equipment", 20, 120), ("Hammock", "Camping Equipment", 60, 100), ("Saxaphone", "Musical Instruments", 80, 15);

INSERT INTO departments (department_name, over_head_costs, gross_sales)
VALUES ("Clothing", 3000, 0), ("Electronics", 4000, 0), ("Toys", 2000, 0), ("Kitchen Items", 3500, 0), ("Camping Equipment", 3000, 0), ("Musical Instruments", 5000, 0);


SELECT * FROM products;
SELECT * FROM departments;