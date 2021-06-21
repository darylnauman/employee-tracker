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

const allEmployeesByDepartment = () => {
  start();
}

const allEmployeesByManager = () => {
  start();
}

// TO DO - In Progress
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name? ",
        name: "first_name"
      },
      {
        type: "input",
        message: "What is the employee's last name? ",
        name: "last_name"
      },
      {
        type: "list",
        message: "What is the employee's role? ",
        choices: [], // TO DO - GET LIST OF ROLES
        name: "role"
      },
      {
        type: "list",
        message: "Who is the employee's manager? ",
        choices: [], // TO DO - GET LIST OF MANAGERS + NULL?
        name: "" // MANAGER ID OR EMPLOYEE NAME??
      }
    ])
    .then ( (responses) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: responses.first_name,
          last_name: responses.last_name,
          role_id: 'role', // TO DO FIGURE OUT GETTING ROLE ID
          manager_id: '' // TO DO FIGURE OUT GETTING MANAGER ID
        },
        (err, res) => {
          if (err) throw err;
          console.log("New employee added");
        }
      )
    })
  start();
}

const removeEmployee = () => {
  start();
}

const updateEmployeeRole = () => {
  start();
}

const updateEmployeeManager = () => {
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
          allEmployeesByDepartment();
          break;
        case 'View all employees by manager':
          allEmployeesByManager();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Remove employee':
          removeEmployee();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
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