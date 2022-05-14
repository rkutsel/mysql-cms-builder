USE employee_db;

INSERT into
    department (name)
VALUES
    ("SALES"),
    ("ENGINEERING"),
    ("HR"),
    ("FACILITIES");

INSERT into
    employee_role (title, salary, department_id)
VALUES
    ("SENIOR SALES REPRESENTATIVE", "120000", 1),
    ("JUNIOR SALES REPRESENTATIVE", "950000", 1),
    ("SYSTEMS ENGINEER", "900000", 2),
    ("SENIOR IT ENGINEER", "900000", 2),
    ("SOFTWARE DEVELOPER", "1300000", 2),
    ("SENIOR HR", "900000", 3),
    ("BUILDING MANAGER", "900000", 4);

INSERT into
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("None", "", 1, Null),
    ("Jane", "Doe", 1, 1),
    ("John", "Doe", 2, 1),
    ("Jian", "Yang", 3, 1),
    ("Eric", "Bachman", 4, 1),
    ("Richard", "Hendricks", 5, 4),
    ("Jared", "Doe", 6, 1),
    ("Jack", "Barker", 7, 1);