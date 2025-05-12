import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import User from '../entities/User';
import UserDTO from '../models/dto/UserDTO';

export class UserService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email,
            roleId,
            companyId
        FROM user
        WHERE email = ?;`;
        try {
            const [user] = await this.db.query<RowDataPacket[]>(sql, [email]);
            if(user.length > 0){
                return this.toUser(user[0]);
            }
            return null;
        } catch (error: any) {
            throw Error(error.message);
            throw Error('Failed to find user');
        }
    }

    async findUserById(id: number): Promise<User | null> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email,
            roleId,
            companyId
        FROM user
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            if(result.length > 0){
                return this.toUser(result[0]);
            }
            return null;
        } catch (error: any) {
            throw Error(error.message);
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
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                user.name,
                user.surname,
                id,
            ]);
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
                password,
                roleId,
                companyId)
            VALUES (?,?,?,?,?,?)
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                user.name,
                user.surname,
                user.email,
                user.password,
                1,
                1
            ]);
            return result.insertId;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    private toUser(result: RowDataPacket): User {
        return {
            name: result.name,
            surname: result.surname,
            email: result.email,
            companyId: result.companyId,
            roleId: result.roleId,
            id: result.id,
        };
    }
}
