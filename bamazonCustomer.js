
// Then create a Node application called bamazonCustomer.js. Running this application will first display 
// all of the items available for sale. Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of 
// the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

var inquirer = require('inquirer');
var mysql = require("mysql");


var requestedID;
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
        console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price);
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
    //   validate: function(value) {
    //     if (isNaN(value) === false) {
    //       return true;
    //     }
    //     return false;
    //   }
    },
  ])
  .then(function(answer1) {
    requestedID = answer1.productID;
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
        // validate: function(value) {
        //     if (isNaN(value) === false) {
        //       return true;
        //     }
        //     return false;
        //   }
      },
    ])
    .then(function(answer2) {
        console.log(answer2.unit_number);
        connection.query("SELECT * FROM products WHERE ?", { id: requestedID }, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if (answer2.unit_number < res[i].stock_quantity) {
                    console.log("you will purchase one item");
                } else {
                    console.log("Insufficient Quantity!");
                    connection.end();
                }
            }
        });

    });
};




// function checkHowMany(answer) {
//     var query = "SELECT position, song, year FROM top5000 WHERE ?";
//     connection.query(query, { id: answer.productID }, function(err, res) {
//       if (err) throw err;
//       for (var i = 0; i < res.length; i++) {
//         console.log("Product: " + res[i].product_name+" Quantity: " + res[i].stock_quantity);
//       }

//       connection.end();
//     });

// };