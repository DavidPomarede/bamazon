var inquirer = require('inquirer');
var mysql = require("mysql");
var Table = require('easy-table');

var requestedID;
var requestedItemPrice;
var requestedQuantity;
var requestedDept;
var orderTotal;
var oldSales = 0;
var newSales = 0;
var deptArray = [];

console.log("\n\n                        W E L C O M E   T O                                     ");
console.log("                                                                                ");
console.log(":::::::::      :::     ::::    ::::      :::     ::::::::: ::::::::  ::::    :::");
console.log(":+:    :+:   :+: :+:   +:+:+: :+:+:+   :+: :+:        :+: :+:    :+: :+:+:   :+:");
console.log("+:+    +:+  +:+   +:+  +:+ +:+:+ +:+  +:+   +:+      +:+  +:+    +:+ :+:+:+  +:+");
console.log("+#++:++#+  +#++:++#++: +#+  +:+  +#+ +#++:++#++:    +#+   +#+    +:+ +#+ +:+ +#+");
console.log("+#+    +#+ +#+     +#+ +#+       +#+ +#+     +#+   +#+    +#+    +#+ +#+  +#+#+#");
console.log("#+#    #+# #+#     #+# #+#       #+# #+#     #+#  #+#     #+#    #+# #+#   #+#+#");
console.log("#########  ###     ### ###       ### ###     ### ######### ########  ###    ####");
console.log("                                                                                ");
console.log("                        C U S T O M E R   P O R T A L                           \n\n");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
//   console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
    categoryID();
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      var data = [];
      console.log("-----------------------------------");

      for (var i = 0; i < res.length; i++) {
          var tableRow;
          tableRow = {"id": res[i].id, "name": res[i].product_name, "price": res[i].price};
          data.push(tableRow);
      };
// CREATING THE TABLE BELOW:

      var t = new Table;
      data.forEach(function(product) {
          t.cell('Product Id', product.id)
          t.cell('Item Name', product.name)
          t.cell('Price', product.price, Table.number(2))
          t.newRow()
      });
      console.log(t.toString());
      askCustomer();
    });
  };
  


function categoryID() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            var idkey = res[i].department_id;
            var idname = res[i].department_name;
            var deptKey = {id: idkey, name: idname};
            deptArray.push(deptKey);
        }
        // console.log(JSON.stringify(deptArray));
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
                requestedDept = res[i].department_name;
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
        var checkoutTotal = 0;
        connection.query("SELECT * FROM products WHERE ?", { id: requestedID }, function(err, res) {
            if (err) throw err;
            requestedDept = res[0].department_name;

            for (var i = 0; i < res.length; i++) {
                for (var j = 0; j < deptArray.length; j++) {
                    if (res[i].department_name === deptArray[j].name) {
                        requestedDept = deptArray[j].id;
                    }
                };

                var newQuantity = res[i].stock_quantity - requestedQuantity;
                checkoutTotal = res[i].price * requestedQuantity;

                if (res[i].product_sales > 0) {
                    oldSales = res[i].product_sales;
                    newSales = parseInt(oldSales) + parseInt(checkoutTotal);
                } else {
                    newSales = parseInt(checkoutTotal);
                }

                if (answer2.unit_number < res[i].stock_quantity) {

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                            stock_quantity: newQuantity,
                            product_sales: newSales
                            },
                            {
                            id: requestedID
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            orderTotal = requestedItemPrice * requestedQuantity;
                            console.log("You purchased " + requestedQuantity + " of these items!");
                            console.log("For a Total of $" + orderTotal + ".");
                            addGrossSales(parseInt(requestedDept), orderTotal);
                        }
                    );
                } else {
                    console.log("Insufficient Quantity of this item!");
                    connection.end();
                };
            }
        });

        function addGrossSales(input1, input2) {
                        
                    var DeptNameNew;
                    var tempInput = parseInt(input1);
                    var oldDeptTotalGross;
                    connection.query("SELECT * FROM departments WHERE ?", { department_id: tempInput}, function(err, res) {
                            if (err) throw err;

                            for (var j = 0; j < deptArray.length; j++) {
                                departmentName = JSON.stringify(res[0].department_name);
                                DeptNameNew = departmentName;
                            };
                            oldDeptTotalGross = JSON.stringify(res[0].gross_sales);
                            var queryID = parseInt(input1);
                            var purchase = parseInt(input2);
                            var addedTotal = parseInt(oldDeptTotalGross);
                            addedTotal += purchase;                
                            var querySales = addedTotal;
                
                                    connection.query(
                                        "UPDATE departments SET ? WHERE ?",
                                        [
                                            {
                                            gross_sales: querySales
                                            },
                                            {
                                            department_id: queryID
                                            }
                                        ],
                                        function(error) {                
                                            if (error) throw error;
                                            // console.log("***********************")
                                            connection.end();
                                        }
                                    );
                    });
        ;}
    });
};






