DROP DATABASE IF EXISTS test;

CREATE DATABASE IF NOT EXISTS test;

CREATE TABLE
    test.user (
        id int AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        UNIQUE (email)
    );

INSERT INTO
    test.user (name, surname, email, password)
VALUES
    (
        "John",
        "Cena",
        "john@cena.com",
        "$2b$10$EzR9sx7toswINYQyi4F4MOJxf1LreMa3kOtqMwpL2LX9w1xQMEyyK"
    );

CREATE TABLE
    test.template (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        terms LONGTEXT NOT NULL,
        date DATETIME NOT NULL,
        userId int NOT NULL,
        version int NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id),
        UNIQUE (title)
    );

CREATE TABLE
    test.contract (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        terms LONGTEXT NOT NULL,
        userId INT NOT NULL,
        date DATETIME NOT NULL,
        completed BOOLEAN DEFAULT false NOT NULL,
        status VARCHAR(50),
        otp VARCHAR(6),
        FOREIGN KEY (userId) REFERENCES user(id)
    );

CREATE TABLE
    test.contract_recipient (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        idNumber VARCHAR(13) NOT NULL,
        contractId INT NOT NULL,
        FOREIGN KEY (contractId) REFERENCES contract (id)
    );

CREATE TABLE
    test.contract_audit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contractId INT NOT NULL,
        Action VARCHAR(255) NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contractId) REFERENCES contract (id)
    );

INSERT INTO
    test.contract (title, terms, status, date, userId)
VALUES
    (
        "The first agreement",
        "<p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>{{name}}{{surname}}</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>{{name}}{{surname}}</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>{{name}}{{surname}}</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>{{name}}{{surname}}</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>&nbsp;</p>
 <p>&nbsp;</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>Yoh these terms are crazy</p>
 <p>It really is awesome</p>
 <p>{{idNumber}}</p>",
        "new",
        "2014-07-01 01:01:01",
        1
    ),
    (
        "The first 2 agreement",
        "saldjvbl jBSLKCDBjc ljb BLDBDBKJ BB ",
        "new",
        "2014-07-01 01:01:01",
        1
    ),
    (
        "The first 3 agreement",
        "saldjvbl jBSLKCDBjc ljb BLDBDBKJ BB ",
        "canceled",
        "2014-07-01 01:01:01",
        1
    ),
    (
        "The first 4 agreement",
        "saldjvbl jBSLKCDBjc ljb BLDBDBKJ BB ",
        "signed",
        "2014-07-01 01:01:01",
        1
    );

INSERT INTO
    test.contract_recipient (name, surname, email, idNumber, contractId)
VALUES
    (
        "jason",
        "jones",
        "jason@gmail.com",
        "78356373",
        1
    ),
    (
        "jason",
        "jones",
        "jason@gmail.com",
        "78356373",
        2
    ),
    (
        "jason",
        "jones",
        "jason@gmail.com",
        "78356373",
        3
    ),
    (
        "jason",
        "jones",
        "jason@gmail.com",
        "78356373",
        4
    );

INSERT INTO
    test.contract_audit (action, date, contractId)
VALUES
    ("Created New Contract", "2014-07-01 01:01:01", 1);

CREATE VIEW
    contract_stats AS
SELECT
    COUNT(*) AS total,
    COUNT(
        CASE
            WHEN status = 'new' THEN 1
        END
    ) AS new,
    COUNT(
        CASE
            WHEN status = 'signed' THEN 1
        END
    ) AS signed,
    COUNT(
        CASE
            WHEN status = 'canceled' THEN 1
        END
    ) AS canceled,
    COUNT(
        CASE
            WHEN status = 'rejected' THEN 1
        END
    ) AS rejected,
    COUNT(
        CASE
            WHEN status = 'viewed' THEN 1
        END
    ) AS viewed,
    COUNT(
        CASE
            WHEN status = 'expired' THEN 1
        END
    ) AS expired,
    userId
FROM
    test.contract
GROUP BY
    userId;