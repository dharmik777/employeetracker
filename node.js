var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // SQL Workbench link
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "trackerDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "category",
            type: "list",
            message: "Pick a Category",
            choices: ["Add Departments",
                "Add Employee",
                "View Departments",
                "View Employees",
                "Update Employee Roles"]

        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.category === "Add departments") {
                addDepartments();
            }

            else if (answer.category === "Add employee") {
                addEmployee();
            }

            else if (answer.category === "View departments") {
                viewDepartments();
            }

            else if (answer.category === "View employees") {
                viewEmployees();
            }

            else if (answer.category === "Update employee roles") {
                UpdateRoles();
            }

            else {
                connection.end();
            }
        });
}

// Select Department //
function viewDepartments() {
    connection.query("SELECT * From Department",
        function (err, res) {
            if (err) throw err
            console.table(res)
            start()
        })
}


// Select Employee //
function viewEmployees() {
    connection.query("SELECT * From Employee",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start()
        })
};


// Add Department //
function addDepartments() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Add Department"
        }
    ]).then(function (res) {
        var query = connection.query("INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                start();
            }
        )
    })
}

// Add Employee //
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "First name"
        },
        {
            name: "lastname",
            type: "input",
            message: "Last name"
        },
        {
            name: "title",
            type: "input",
            message: "Job Title"
        },
        {
            name: "pay",
            type: "input",
            message: "Salary"
        }

    ]).then(function (res) {
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: res.firstname,
                last_name: res.lastname,
                title: res.title,
                pay: res.salary
            },
            function (err) {
                if (err) throw err
                console.table(res)
                start()
            })
    }
    )
}

// Update Employee Titles //
function UpdateRoles() {
    connection.query("select * from employee", function (err, res) {
        if (err) throw err;

        console.table(res)
        inquirer.prompt([
            {
                name: "category",
                type: "list",
                message: "Select Employee ID",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
                    "15", "16", "17", "18", "19", "20"]
            },

            {
                name: "newTitle",
                type: "input",
                message: "New Title"
            }

        ]).then(function (res) {
            connection.query("UPDATE employee SET title = ?  WHERE id = ?", [res.newTitle, res.category],
                function (err) {
                    if (err) throw err
                    console.table(res)
                    start()
                })

        });
    });

}