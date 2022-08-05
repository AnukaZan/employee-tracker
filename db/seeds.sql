INSERT INTO department (name)
VALUES ('Sales'),('Accounting'),('Marketing'),('IT');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Coordinator', 45000, 1),
    ('Sales Engineer', 60000, 1),
    ('Sales Lead', 100000, 1),
    ('Marketing Director', 80000, 3), 
    ('Marketing Assistant', 46000, 3),
    ('Accountant', 70000, 2), 
    ('IT Specialist', 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Zoey', 'Yi', 1, 1),
    ('Anuka', 'Zan', 1, 1),
    ('Damon', 'Cho', 1, 1),
    ('Jose', 'Phine', 3, 4),
    ('Anh', 'Hu', 3, 4),
    ('Zh', 'Ou', 2, null),
    ('Ben', 'Jerry', 4, null);
