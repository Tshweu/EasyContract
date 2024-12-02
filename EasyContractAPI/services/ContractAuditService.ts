import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Contract } from '../models/Contract';
import { ContractAudit } from '../models/ContractAudit';

export class ContractAuditService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findContractAuditByEmail(email: string): Promise<ContractAudit> {
        const sql = `
        SELECT 
            id,
            name,
            surname,
            email
        FROM contract_audit
        WHERE email = ?;`;
        try {
            const [contractAudit] = await this.db.query<RowDataPacket[]>(sql, [email]);
            return this.toContractAudit(contractAudit[0]);
        } catch (error) {
            throw Error('Failed to find contractAudit');
        }
    }

    async findContractAuditById(id: number): Promise<ContractAudit> {
        const sql = `
        SELECT 
            id,
            action,
            date,
            contractId
        FROM contract_audit
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toContractAudit(result[0]);
        } catch (error) {
            throw Error('Failed to find contractAudit');
        }
    }

    async createContractAudit(contractAudit: ContractAudit): Promise<number> {
        try {
            let sql = `
            INSERT INTO contract_audit(
                action,
                date,   
                contractId)
            VALUES (?,?,?)
            `;
           const [result] = await this.db.query<ResultSetHeader>(sql, [
                contractAudit.action,
                contractAudit.date,
                contractAudit.contractId
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private toContractAudit(result: RowDataPacket): ContractAudit {
        return {
            id: result.id,
            action: result.action,
            date: result.date,
            contractId: result.contractId
        };
    }
}

