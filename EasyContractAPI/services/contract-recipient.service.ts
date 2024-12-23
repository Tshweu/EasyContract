import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { ContractRecipient } from '../models/ContractRecipient';

export class ContractRecipientService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findContractRecipientById(id: number): Promise<ContractRecipient> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email,
            idNumber,
            contractId
        FROM contract_recipient
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toContractRecipient(result[0]);
        } catch (error) {
            throw Error('Failed to find contract');
        }
    }

    async findContractRecipientByContractId(id: number): Promise<ContractRecipient> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email,
            idNumber,
            contractId
        FROM contract_recipient
        WHERE contractId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toContractRecipient(result[0]);
        } catch (error) {
            throw Error('Failed to find contract');
        }
    }

    async updateContractRecipientById(
        id: number,
        contractRecipient: ContractRecipient,
    ): Promise<number> {
        try {
            const sql = `
            UPDATE contract_recipient 
            SET 
                name = ?,
                surname = ?,
                email = ?,
                idNumber = ?
            WHERE 
                id = ?;
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                contractRecipient.name,
                contractRecipient.surname,
                contractRecipient.email,
                contractRecipient.idNumber,
                id,
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createContractRecipient(
        contractRecipient: ContractRecipient,
    ): Promise<number> {
        try {
            let sql = `
            INSERT INTO contract_recipient(
                name,
                surname,
                email,
                idNumber,
                contractId)
            VALUES (?,?,?,?,?)
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                contractRecipient.name,
                contractRecipient.surname,
                contractRecipient.email,
                contractRecipient.idNumber,
                contractRecipient.contractId,
            ]);

            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private toContractRecipient(result: RowDataPacket): ContractRecipient {
        return {
            id: result.id,
            name: result.name,
            surname: result.surname,
            email: result.email,
            idNumber: result.idNumber,
            contractId: result.contractId,
        };
    }
}
