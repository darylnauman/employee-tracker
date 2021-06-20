const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do? ",
        choices: [
          "View all employees",
          "View all employees by department",
          "View all employees by manager",
          "Add employee",
          "Remove employee",
          "Update employee role",
          "Update employee manager",
          "Quit",
        ],
        name: "choice",
      },
    ])
    .then((response) => {
      console.log(response.choice);
      
      switch (response.choice) {
        case 'View all employees':
          // function
          break;
        case 'View all employees by department':
          // function
          break;
        case 'View all employees by manager':
          // function
          break;
        case 'Add employee':
          // function
          break;
        case 'Remove employee':
          // function
          break;
        case 'Update employee role':
          // function
          break;
        case 'Update employee manager':
          // function
          break;
        case 'Quit':
          connection.end();
          break;
        default:
          throw new Error('invalid initial user choice');
      }
    });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  start();
});
