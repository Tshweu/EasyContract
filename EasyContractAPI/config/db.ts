import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

let con = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name,
    multipleStatements: false,
    dateStrings: true
});

export default con;