import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import User from '../models/User';
import UserDTO from '../models/UserDTO';

export class UserService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findUserByEmail(email: string): Promise<User> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email
        FROM user
        WHERE email = ?;`;
        try {
            const [user] = await this.db.query<RowDataPacket[]>(sql, [email]);
            return this.toUser(user[0]);
        } catch (error) {
            throw Error('Failed to find user');
        }
    }

    async findUserById(id: number): Promise<User> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email
        FROM user
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toUser(result[0]);
        } catch (error) {
            throw Error('Failed to find user');
        }
    }

    async updateUserById(id: number, user: User): Promise<number> {
        try {
            const sql = `
            UPDATE user 
            SET 
                name = ?,
                surname = ?
            WHERE 
                id = ?;
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [user.name, user.surname, id]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createUser(user: User): Promise<number> {
        try {
            let sql = `
            INSERT INTO user(
                name,
                surname,
                email,
                password)
            VALUES (?,?,?,?)
            `;
           const [result] = await this.db.query<ResultSetHeader>(sql, [
                user.name,
                user.surname,
                user.email,
                user.password,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private toUser(result: RowDataPacket): User {
        return {
            name: result.name,
            surname: result.surname,
            email: result.email,
            id: result.id,
        };
    }
}
