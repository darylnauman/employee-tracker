const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db",
});

//  --------- VIEWS --------- //

const viewAllEmployees = () => {
  
  const query = `
  SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, salary, IFNULL(concat(m.first_name, ' ', m.last_name), 'N/A') AS manager
  FROM employee e
  LEFT JOIN employee m
  ON m.id = e.manager_id
  JOIN role
  ON e.role_id = role.id
  JOIN department
  ON role.department_id = department.id;`
    
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

const viewAllEmployeesByDepartment = () => {
  const query = `SELECT department.id AS "Department ID", department.name AS Department FROM employees_db.department`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

const viewAllEmployeesByManager = () => {
  const query = `SELECT employee.first_name, employee.last_name, manager_id
  FROM employees_db.employee
  ORDER BY employee.manager_id;`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

const viewAllDepartments = () => {
  const query = `SELECT department.id AS "Department ID", department.name AS Department FROM employees_db.department`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

const viewAllRoles = () => {
  const query = `SELECT role.id AS "Role ID", role.title AS Role, role.salary AS Salary, role.department_id AS "Department ID" FROM employees_db.role`;
  connection.query(
    query,
    (err, results) => {
      if (err) throw err;
      console.log('\n');
      console.table(results);
      start();
  })
}

//  --------- ADDS --------- //

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
          start();
        }
      )
    })
}

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the new department name? '
      }
    ])
    .then ( (response) => {
      connection.query(
        'INSERT INTO employees_db.department SET ?',
        {
          name: response.newDepartment,
        },
        (err) => {
          if (err) throw err;
          console.log('New department added successfully!')
          start();
      })
    })
}

const getDepartments = () => {
  return new Promise( (resolve, reject) => {
  
    const query = `SELECT * FROM employees_db.department`;
    connection.query(
      query,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
  })
})
}

const addRole = async () => {
  
  const departments = await getDepartments();

  const responses = await inquirer
  .prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the new role? ',
    },
    {
      name: 'salary',
      type: 'number',
      message: "What is the role's salary? ",
    },
    {
      name: 'department',
      type: 'list',
      choices: departments.map(department => department.name),
      message: 'What department is the role in? '
    }
  ])
  
  departments.forEach(department => {
    if (department.name === responses.department) {
      responses.department = department.id;
    }
  });

  connection.query(
    'INSERT INTO employees_db.role SET ?',
    {
      title: responses.title,
      salary: responses.salary,
      department_id: responses.department,
    },
    (err) => {
      if (err) throw err;
      console.log('New role added successfully!\n')
      start();
  })
}

//  --------- REMOVES --------- //

const removeEmployee = () => {
  start();
}

//  --------- UPDATES --------- //

const updateEmployeeRole = () => {
  start();
}

const updateEmployeeManager = () => {
  start();
}

//  --------- START --------- //

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
          "View all departments",
          "View all roles",
          "Add employee",
          "Add department",
          "Add role",
          "Remove employee",
          "Update employee role",
          "Update employee manager",
          "Quit",
        ],
        name: "choice",
      },
    ])
    .then((response) => {
      // console.log(response.choice);
      switch (response.choice) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all employees by department':
          viewAllEmployeesByDepartment();
          break;
        case 'View all employees by manager':
           viewAllEmployeesByManager();
           break;
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Add role':
          addRole();
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