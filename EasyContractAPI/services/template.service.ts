import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Template } from '../models/Template';
import { TemplateDTO } from '../models/dto/TemplateDTO';

export class TemplateService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findAll(id: number): Promise<Template[]> {
        const sql = `
        SELECT 
            id,
            title,
            terms,
            version,
            date,
            userId
        FROM template
        WHERE userId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);

            return this.toTemplateList(result);
        } catch (error) {
            throw Error('Failed to find template');
        }
    }

    async doesTemplateTitleExist(title: string,id: number): Promise<boolean> {
        const sql = `
        SELECT 
            id,
            title
        FROM template
        WHERE title = ?
        AND userId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [title,id]);
            console.log(result);
            if(result.length > 0){
                return true
            }
            return false;
        } catch (error: any) {
            throw Error(error.message);
        }
    }


    async findTemplateById(id: number): Promise<Template> {
        const sql = `
        SELECT 
            id,
            title,
            terms,
            version,
            date,
            userId
        FROM template
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            return this.toTemplate(result[0]);
        } catch (error) {
            throw Error('Failed to find template');
        }
    }

    async updateTemplateById( id: number,template: Template ): Promise<number> {
        try {
            const sql = `
            UPDATE template 
            SET 
                title = ?,
                terms = ?,
                version = ?
            WHERE 
                id = ?;
            `;
           const [result] = await this.db.query<ResultSetHeader>(sql, 
                [template.title, template.terms, template.version, id]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async createTemplate(template: Template, userId: number): Promise<number> {
        try {
            let sql = `
            INSERT INTO template(
                title,
                terms,
                date,
                version,
                userId)
            VALUES (?,?,?,?,?)
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                template.title,
                template.terms,
                template.date,
                template.version,
                userId
            ]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async deleteTemplateById( id: number ): Promise<number> {
        try {
            const sql = `
            DELETE FROM template 
            WHERE 
                id = ?;
            `;
           const [result] = await this.db.query<ResultSetHeader>(sql, [id]);
            return result.affectedRows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private toTemplate(result: RowDataPacket): Template{
        return {
            id: result.id,
            title: result.title,
            terms: result.terms,
            date: result.date,
            version: result.version,
            userId: result.userId
        }
    }   

    private toTemplateList(result: RowDataPacket[]): Template[]{
        let templates: Template[] = [];
        for(let i = 0;i< result.length;i++){
            templates.push(this.toTemplate(result[0]));
        }
        return templates;
    }
}

