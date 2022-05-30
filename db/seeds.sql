INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Sales'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', 100000, 3),
('Account Manager', 50000, 2),
('Lawyer', 100000, 4),
('Software Engineer', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
('John', 'Doe', 1),
('Mike', 'Chan', 4),
('Ashley', 'Rodriguez', 3),
('Tom', 'Allen', 2);