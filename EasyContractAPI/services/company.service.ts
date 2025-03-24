import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';
import Company from '../entities/Company';

export class CompanyService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findCompanyById(id: number): Promise<Company | null> {
        const sql = `
        SELECT 
            *
        FROM Company
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            if(result.length > 0){
                return this.toCompany(result[0]);
            }
            return null;
        } catch (error: any) {
            throw Error(error.message);
        }
    }

    async updateCompanyById(id: number, Company: Company): Promise<number> {
        try {
            const sql = `
            UPDATE Company 
            SET 
                name = ?,
            WHERE 
                id = ?;
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                Company.name,
                id,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createCompany(Company: Company): Promise<number> {
        try {
            let sql = `
            INSERT INTO Company(
                name,
               )
            VALUES (?,?,?,?)
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                Company.name,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    private toCompany(result: RowDataPacket): Company {
        return {
            name: result.name,
            id: result.id,
        };
    }
}
