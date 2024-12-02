import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Contract } from '../models/Contract';
import { ContractRecipient } from '../models/ContractRecipient';

export class ContractService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findContractById(id: number): Promise<Contract> {
        const sql = `
        SELECT 
            id,
            title,
            terms,
            date,
            completed,
            status,
            otp,
            userId
        FROM contract
        WHERE id = ?;`;
        try {
            const [contract] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toContract(contract[0]);
        } catch (error) {
            throw Error('Failed to find contract');
        }
    }

    async updateContractById(id: number, contract: Contract): Promise<number> {
        try {
            const sql = `
            UPDATE contract 
            SET 
                title = ?,
                terms = ?,
                completed = ?,
                status = ?
            WHERE 
                id = ?;
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                contract.title,
                contract.terms,
                contract.completed,
                contract.status,
                id,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createContract(contract: Contract, contractRecipient: ContractRecipient): Promise<number> {
        const con = await this.db.getConnection();
        await con.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await con.beginTransaction();
        try {
            let sql = `
                INSERT INTO contract(
                    title,
                    terms,
                    status,
                    date,
                    userId)
                VALUES (?,?,?,?,?)
            `;

            const [contractResult] = await con.query<ResultSetHeader>(sql, [
                contract.title,
                contract.terms,
                contract.status,
                contract.date,
                contract.userId,
            ]);

            sql = `
                INSERT INTO contract_recipient(
                    name,
                    surname,
                    email,
                    idNumber,
                    contractId)
                VALUES (?,?,?,?,?)
            `;

            const [crResult] = await con.query<ResultSetHeader>(sql, [
                contractRecipient.name,
                contractRecipient.surname,
                contractRecipient.email,
                contractRecipient.idNumber,
                contractResult.insertId,
            ]);

            sql = `
                INSERT INTO contract_audit(
                    action,
                    date,   
                    contractId)
                VALUES (?,?,?)
            `;

            const [caResult] = await con.query<ResultSetHeader>(sql, [
                'User Created Contracted',
                contract.date,
                contractResult.insertId
            ]);

            await con.commit();
            return contractResult.affectedRows;
        } catch (error: any) {
            con.rollback();
            console.log('throw');
            throw new Error(error.message);
        }
        finally{
            this.db.releaseConnection(con)
            con.release();
        }
    }

    async updateContractStatus(id: number, status: string) {
        try {
            let sql = `
            UPDATE contract(
            SET    
                status = ?,
            WHERE
                id = ?
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                id,
                status,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private toContract(result: RowDataPacket): Contract {
        return {
            id: result.id,
            title: result.title,
            terms: result.terms,
            date: result.date,
            completed: Boolean(result.completed),
            status: result.status,
            otp: result.otp,
            userId: result.userId,
        };
    }
}
