const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

// TO DO GET MANAGER NAME WORKING
const allEmployees = () => {
  connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, salary, employee.manager_id AS manager FROM employees_db.employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;', (err, results) => {
    if (err) throw err;
    console.log('\n');
    console.table(results);
    console.log('\n');
  })
  start();
}

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
          allEmployees();
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