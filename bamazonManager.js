var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var requestedID;
var requestedQuantity;
var addedQuantity;

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "exit"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                promptAddInventory();
                break;

            case "Add New Product":
                addNew();
                break;

            case "exit":
                connection.end();
                break;
            }
        });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].stock_quantity + " | $" + res[i].price);
        }
        console.log("-----------------------------------");
        runSearch();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item: " +
                res[i].product_name +
                "Quantity: " +
                res[i].stock_quantity
            );
        }
        runSearch();
    });
}



function promptAddInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].stock_quantity + " | $" + res[i].price);
        }
        console.log("-----------------------------------");
    });

    inquirer
    .prompt([
            {
            type: "input",
            message: "Please enter the ID number of the product that you would like to add to the inventory: ",
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
            for (var i = 0; i<res.length; i++) {
                requestedQuantity = res[i].stock_quantity;
            }


        });
        addInventory();
    });
};

function addInventory() {
    console.log("testing2")
    inquirer
    .prompt([
        {
            type: "input",
            message: "How many units would you like to add?",
            name: "added_units",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ])
    .then(function(answer2) {

        var addQuantity = answer2.added_units;
        var total = parseInt(requestedQuantity) + parseInt(addQuantity);

        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                stock_quantity: total
                },
                {
                id: requestedID
                }
            ],
            function(error) {
                // if (error) throw err;
                console.log("You added " + addQuantity + " of these items!");
                runSearch();
            }
        );
    });
};



function addNew() {
        inquirer
            .prompt([
            {
                name: "product_name",
                type: "input",
                message: "What is the item you would like to add to the inventory?"
            },
            {
                name: "department_name",
                type: "input",
                message: "What department would you like to place your item in?"
            },
            {
                name: "price",
                type: "input",
                message: "What price?",
                validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                }
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "What Quantity?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                    return true;
                    }
                    return false;
                }
                }
            ])
            .then(function(answer) {
                connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your item listing was created successfully!");
                    runSearch();
                }
                );
            });
};