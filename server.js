// Express Connection
const db = require('./db/connection');

const inquirer = require('inquirer');

let department = [];
let departmentDescription = [];
(async () => {
    const sql = `SELECT * FROM department`;
    const departmentArr = await new Promise((resolve, reject) =>
        db.query(sql, (err, departmentArr) => {
            if (err) {
                return;
            }
            resolve(departmentArr);
        }));
    departmentArr.forEach(element => {
        department.push(element.id)
        departmentDescription.push(element.id + ' ' + `${element.name}`);
    })
})();

let role = [];
let roleDescription = [];
(async () => {
    const sql = `SELECT * FROM roles`;
    const rolesArr = await new Promise((resolve, reject) =>
        db.query(sql, (err, rolesArr) => {
            if (err) {
                return;
            }
            resolve(rolesArr);
        }));  
    rolesArr.forEach(element => {
        role.push(element.id);
        roleDescription.push(element.id + ' ' + `${element.title}`);
    });
})();

console.log('___________________');
console.log('|                |');
console.log('|    EMPLOYEEE   |');
console.log('|     TRACKER    |');
console.log('|                |');
console.log('___________________');



// Console Menu Screen
const menuPrompt = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Role', 'Add Department', 'Update an Employee Role'],
                validate: menuInput => {
                    if (menuInput) {
                        return true;
                    }
                    else {
                        console.log("Please state what you wish to");
                        return false;
                    }
                }
            }
        ])
        .then((answers) => {
            switch (answers.menu) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Update an Employee Role":
                    updateEmployeeRole();
                    break;
            }
        })
};

const viewEmployees = async () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
    FROM employee employee
    LEFT JOIN roles role
      ON employee.role_id = role.id
    LEFT JOIN department department
    ON department.id = role.department_id`;
    const employees = await new Promise((resolve, reject) =>
        db.query(sql, (err, employees) => {
            if (err) {
                return;
            }
            resolve(employees);
            console.table(employees)
        }));
    menuPrompt()
};

const viewDepartments = async () => {
    const sql = `SELECT * FROM department`;
    const departmentArr = await new Promise((resolve, reject) =>
        db.query(sql, (err, departmentArr) => {
            if (err) {
                console.log(err);
                return;
            }
            resolve(departmentArr);
            console.table(departmentArr)

        }));
    menuPrompt()
};

const viewRoles = () => {
    const sql = `SELECT roles.*, department.name
    AS department_name
    FROM roles
    LEFT JOIN department
    ON roles.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            return;
        }
        console.table(rows)
        menuPrompt()
    });
};

const addDepartment = () => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'State the new department name',
                validate: addDepartmentInput => {
                    if (addDepartmentInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the new department name");
                        return false;
                    }
                }
            }
        ])
        .then((response) => {
            const params = [response.departmentName]
            
            db.query(sql, params, (err, rows) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                menuPrompt()
            })
            
        })
}

const addRole = () => {

    const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?,?,?)`;

    console.log('____________________');
    console.log('DEPARTMENTS IDs');
    console.log(departmentDescription);
    console.log('____________________');

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: "What's the role title?",
                validate: roleTitleInput => {
                    if (roleTitleInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the role title!");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What's the role salary?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the salary of this role!");
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'departmentID',
                message: "What's the department id the correponds to this role",
                choices: department,
                validate: menuInput => {
                    if (menuInput) {
                        return true;
                    }
                    else {
                        console.log("Please state what you wish to");
                        return false;
                    }
                }
            }
        ]).then((response) => {
            const params = [response.roleTitle, response.salary, response.departmentID]
            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                menuPrompt()
            })
        })

}

const addEmployee = () => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id)
    VALUES (?,?,?)`;
    console.log('____________________');
    console.log('ROLES IDs');
    console.log(roleDescription);
    console.log('____________________');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "What's the employee name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the employee name!");
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What's the employee last name??",
                validate: lastNameInput => {
                    if (lastNameInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the employee last name!");
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'roleID',
                message: "What's the role id that correponds to this employee",
                choices: role,
                validate: roleIdInput => {
                    if (roleIdInput) {
                        return true;
                    }
                    else {
                        console.log("Please provide the role id that correponds to this employee");
                        return false;
                    }
                }
            }
        ]).then((response) => {
            const params = [response.name, response.lastName, response.roleID]
            db.query(sql, params, (err, rows) => {
                if (err) {
                    return;
                }
                menuPrompt()
            })
        })
}

const updateEmployeeRole = () => {
    inquirer
    .prompt([
        {
            type: 'inter',
            name: 'employeeID',
            message: "What's the id of the employee you wish to update?",
            validate: idInput => {
                if (idInput) {
                    return true;
                }
                else {
                    console.log("Please provide the id of the employee you wish to update!");
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'roleID',
            message: "What's the new role id that correponds to this employee",
            choices: role,
            validate: roleIdInput => {
                if (roleIdInput) {
                    return true;
                }
                else {
                    console.log("Please provide the new role id that correponds to this employee");
                    return false;
                }
            }
        }
    ]).then((response) => {
        console.log();
        const sql = `UPDATE employee SET role_id= ? WHERE id = ?`;
        const params = [response.roleID, response.employeeID]

        db.query(sql, params, (err, rows) => {
            if (err) {
                return;
            }
            menuPrompt()
        })
    })
};

menuPrompt()