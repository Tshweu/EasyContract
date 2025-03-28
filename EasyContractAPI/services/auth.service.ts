import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import User from '../entities/User';
import UserDTO from '../models/dto/UserDTO';    

export class AuthService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findUserPassword(email: string): Promise<User | null> {
            const sql = `
            SELECT
                id,
                name,
                surname,
                email,
                password,
                companyId
            FROM user
            WHERE email = ?;`;
            try {
                //Why get all user data??
                //Refactor to return less user data
                const [result] = await this.db.query<RowDataPacket[]>(sql, [email]);
                if(result.length > 0){
                    let user : User = {
                    name: result[0].name,
                    surname: result[0].surname,
                    email: result[0].email,
                    id: result[0].id,
                    password: result[0].password,
                    roleId: result[0].roleId,
                    companyId: result[0].companyId
                    };
                    return user;
                }
                return null;
            } catch (error: any) {
                throw Error(error.message);
            }
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
