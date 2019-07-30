
USE bamazon;

CREATE TABLE departments (
    department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs DECIMAL(10, 2) NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ball Cap", "Clothing", 40, 100), ("Trucker Hat", "Clothing", 30, 90), ("T-Shirt", "Clothing", 20, 150), ("Capri Pants", "Clothing", 28, 80), ("Computer Mouse", "Electronics", 8.95, 75),("Bobble Head", "Toys", 12.99, 30), ("Crock Pot", "Kitchen Items", 64.95, 85), ("Thermos", "Camping", 20, 120), ("Hammock", "Camping", 60, 100), ("Saxaphone", "Musical Instruments", 80, 15);

SELECT * FROM products;