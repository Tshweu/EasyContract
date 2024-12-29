import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Contract } from '../models/Contract';
import { ContractRecipient } from '../models/ContractRecipient';
import { ContractStats } from '../models/ContractStats';

export class ContractService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findStats(id: number): Promise<ContractStats | null> {
        const sql = `
        SELECT 
            *
        FROM contract_stats
        WHERE userId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            if (result.length > 0) {
                const stats: ContractStats = {
                    total: result[0].total,
                    new: result[0].new,
                    signed: result[0].signed,
                    canceled: result[0].canceled,
                    rejected: result[0].rejected,
                    viewed: result[0].viewed,
                    expired: result[0].expired,
                };
                return stats;
            }
            return null;
        } catch (error) {
            throw Error('Failed to find template');
        }
    }

    async findAll(id: number): Promise<Contract[]> {
        const sql = `
        SELECT 
            contract.id,
            title,
            date,
            completed,
            status,
            name,
            surname,
            email,
            idNumber
        FROM contract
        LEFT JOIN contract_recipient 
        ON contract_recipient.contractId = contract.id
        WHERE userId = ?;`;
        try {
            const [contract] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toContractList(contract);
        } catch (error) {
            console.log(error);
            throw Error('Failed to find contract');
        }
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

    async createContract(
        contract: Contract,
        contractRecipient: ContractRecipient,
    ): Promise<number> {
        const con = await this.db.getConnection();
        await con.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await con.beginTransaction();
        try {
            //Get template terms

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
                contractResult.insertId,
            ]);

            await con.commit();
            return contractResult.affectedRows;
        } catch (error: any) {
            con.rollback();
            console.log('throw');
            throw new Error(error.message);
        } finally {
            this.db.releaseConnection(con);
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

    async validateOTP(
        id: number,
        otp: number,
        idNumber: string,
        date: string,
    ): Promise<boolean> {
        const con = await this.db.getConnection();
        await con.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await con.beginTransaction();
        try {
            let sql = `
            SELECT 
                c.id,
                c.title,
                c.terms,
                c.date,
                c.completed,
                c.status,
                c.otp,
                c.userId,
                cr.idNumber,
                cr.name,
                cr.surname
            FROM contract AS c
            LEFT JOIN contract_recipient AS cr
            ON cr.contractId = c.id
            WHERE c.id = ? AND c.otp = ? AND cr.idNumber = ?;`;
            const [foundContract] = await con.query<RowDataPacket[]>(sql, [
                id,
                otp,
                idNumber,
            ]);

            sql = `
            INSERT INTO contract_audit(
                action,
                date,   
                contractId)
            VALUES (?,?,?)
            `;
            if (!(foundContract.length > 0)) {
                const [caResult] = await con.query<ResultSetHeader>(sql, [
                    `Contract recipient attempted to verify details and enter otp and failed.`,
                    date,
                    id,
                ]);
                return false;
            }

            const [caResult] = await con.query<ResultSetHeader>(sql, [
                `Contract recipient ${foundContract[0].name}  ${foundContract[0].surname} successfully attempted to verify details and enter otp`,
                date,
                id,
            ]);

            await con.commit();
            return true;
        } catch (error: any) {
            con.rollback();
            console.log(error);
            throw Error('Failed to validate otp');
        } finally {
            this.db.releaseConnection(con);
            con.release();
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
            recipient: {
                name: result.name,
                surname: result.surname,
                idNumber: result.idNumber,
                email: result.email,
            },
        };
    }

    private toContractList(result: RowDataPacket[]): Contract[] {
        let contractList: Contract[] = [];
        for (let i = 0; i < result.length; i++) {
            contractList.push({
                id: result[i].id,
                title: result[i].title,
                terms: result[i].terms,
                date: result[i].date,
                completed: Boolean(result[i].completed),
                status: result[i].status,
                userId: result[i].userId,
                recipient: {
                    name: result[i].name,
                    surname: result[i].surname,
                    idNumber: result[i].idNumber,
                    email: result[i].email,
                },
            });
        }
        return contractList;
    }
}
