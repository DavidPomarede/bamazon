var inquirer = require('inquirer');
var mysql = require("mysql");


var requestedID;
var requestedItemPrice;
var requestedQuantity;


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].product_name + " | $" + res[i].price);
      }
      console.log("-----------------------------------");
      askCustomer();
    });
  };
  


function askCustomer() {

    inquirer
    .prompt([
            {
            type: "input",
            message: "Please enter the ID number of the product you would like to buy: ",
            name: "productID",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                }
            },
    ])
    .then(function(answer1) {
        requestedID = answer1.productID;
        connection.query("SELECT * FROM products WHERE ?", { id: requestedID }, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                requestedItemPrice = res[i].price;
            };
        });
        howManyUnits();
    });
};


function howManyUnits() {
    inquirer
    .prompt([
        {
            type: "input",
            message: "How many units would you like to buy?",
            name: "unit_number",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ])
    .then(function(answer2) {

        // when a customer purchases anything from the store, 
        // the price of the product multiplied by the quantity purchased
        // is added to the product's product_sales column.

        requestedQuantity = answer2.unit_number;

        var productSales = res[i].stock_quantity * requestedQuantity;

        connection.query("SELECT * FROM products WHERE ?", { id: requestedID }, function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                var newQuantity = res[i].stock_quantity - requestedQuantity;
                if (answer2.unit_number < res[i].stock_quantity) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                            stock_quantity: newQuantity,
                            // product_sales: productSales   *********
                            },
                            {
                            id: requestedID
                            }
                        ],
                        function(error) {
                            // if (error) throw err;
                            var total = requestedItemPrice * requestedQuantity;
                            console.log("You purchased " + requestedQuantity + " of these items!");
                            console.log("For a Total of $" + total + ".");
                            connection.end();
                        }
                    );
                } else {
                    console.log("Insufficient Quantity of this item!");
                    connection.end();
                };
            }
        });

    });
};