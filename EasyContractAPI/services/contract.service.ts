import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Contract } from '../entities/Contract';
import { Signatory } from '../entities/Signatory';
import { ContractStats } from '../entities/ContractStats';

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
            status,
            fullName,
            email,
            idNumber
        FROM contract
        LEFT JOIN signatory 
        ON signatory.contractId = contract.id
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
                status = ?
            WHERE 
                id = ?;
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                contract.title,
                contract.terms,
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
        signatory: Signatory,
    ): Promise<number> {
        const con = await this.db.getConnection();
        await con.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await con.beginTransaction();
        try {
            //Get template terms
            console.log("passed 1");
            let sql = `
                INSERT INTO contract(
                    title,
                    terms,
                    status,
                    date,
                    userId,
                    companyId,
                    otp)
                VALUES (?,?,?,?,?,?,?)
            `;

            const [contractResult] = await con.query<ResultSetHeader>(sql, [
                contract.title,
                contract.terms,
                contract.status,
                contract.date,
                contract.userId,
                contract.companyId,
                contract.otp,
            ]);
            console.log("passed 2");

            sql = `
                INSERT INTO signatory(
                    fullName,
                    email,
                    idNumber,
                    phoneNumber,
                    contractId)
                VALUES (?,?,?,?,?)
            `;

            const [crResult] = await con.query<ResultSetHeader>(sql, [
                signatory.fullName,
                signatory.email,
                signatory.idNumber,
                signatory.phoneNumber,
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
            return contractResult.insertId;
        } catch (error: any) {
            console.log(error.message);
            await con.rollback();
            console.log('throw');
            throw new Error('Error Creating Contract');
        } finally {
            this.db.releaseConnection(con);
            con.release();
        }
    }

    async updateContractStatus(id: number, status: string,date: string) {
        const con = await this.db.getConnection();
        await con.beginTransaction();
        try {
            let sql = `UPDATE contract SET status = ? WHERE id = ?;`;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                status,
                id
            ]);
            
            sql = `
            INSERT INTO contract_audit(
                action,
                date,   
                contractId)
            VALUES (?,?,?)
            `;
            
            const [caResult] = await con.query<ResultSetHeader>(sql, [
                `Contract status was updated to ${status}`,
                date,
                id,
            ]);

            await con.commit();
            return result.affectedRows;
        } catch (error: any) {
            await con.rollback();
            console.log(error);
            throw new Error('Status update error');
        } finally {
            this.db.releaseConnection(con);
            con.release();
        }
    }

    async validateOTP(
        id: number,
        otp: number,
        idNumber: string,
        date: string,
    ): Promise<any> {
        console.log('validate otp called');
        console.log(id, otp, idNumber, date);
        const con = await this.db.getConnection();
        await con.beginTransaction();
        try {
            let sql = `
            SELECT 
                c.id,
                c.title,
                c.terms,
                c.date,
                c.status,
                c.otp,
                c.userId,
                cr.idNumber,
                cr.id as signatoryId,
                cr.fullName
            FROM contract AS c
            LEFT JOIN signatory AS cr
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
                throw new Error('Invalid OTP or ID Number');
            }else{
                const [caResult] = await con.query<ResultSetHeader>(sql, [
                    `Contract recipient ${foundContract[0].fullNamw} successfully attempted to verify details and enter otp`,
                    date,
                    id,
                ]);
            }
            await con.commit();
            return { contract: foundContract[0].id, name: foundContract[0].fullName, signatoryId: foundContract[0].signatoryId };
        } catch (error: any) {
            await con.rollback();
            console.log(error);
            throw new Error('Validation Error');
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
            status: result.status,
            otp: result.otp,
            userId: result.userId,
            companyId: result.companyId,
            recipient: {
                fullName: result.fullName,
                idNumber: result.idNumber,
                email: result.email,
                phoneNumber: result.phoneNumber,
            },
            dateSigned: result.dateSigned,
            dueDate: result.dueDate,
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
                status: result[i].status,
                userId: result[i].userId,
                companyId: result[i].companyId,
                recipient: {
                    fullName: result[i].fullName,
                    idNumber: result[i].idNumber,
                    email: result[i].email,
                    phoneNumber: result[i].phoneNumber,
                },
                dateSigned: result[i].dateSigned,
                dueDate: result[i].dueDate,
            });
        }
        return contractList;
    }
}
