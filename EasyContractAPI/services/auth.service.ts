import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import User from '../models/User';
import UserDTO from '../models/dto/UserDTO';

export class AuthService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async updatePassword(id: number, password: string): Promise<boolean> {
        const sql = `
        UPDATE user
        SET 
            password = ?
        WHERE 
            id = ?;`;
        try {
            const [result] = await this.db.query<ResultSetHeader>(sql, [password,id]);
            if(result.affectedRows){
                return true;
            }
            return false;
        } catch (error: any) {
            throw Error(error.message);
        }
    }

}
