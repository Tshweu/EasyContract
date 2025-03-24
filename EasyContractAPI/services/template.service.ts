import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Template } from '../entities/Template';
import { TemplateDTO } from '../models/dto/TemplateDTO';
import { TemplateTitle } from '../entities/TemplateTitle';
import { CreateRequest } from '../models/template/CreateRequest';

export class TemplateService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async findTitles(id: number): Promise<TemplateTitle[] | null> {
        const sql = `
        SELECT 
            id,
            title,
            userId,
        FROM template
        WHERE companyId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            if(result.length > 0){
                return this.toTemplateTitlesList(result);
            }
            return null;
        } catch (error) {
            throw Error('Failed to find template');
        }
    }

    async findAll(id: number): Promise<Template[]> {
        const sql = `
        SELECT 
            id,
            title,
            terms,
            version,
            date,
            companyId
        FROM template
        WHERE companyId = ?;`;
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
        AND companyId = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [title,id]);
            if(result.length > 0){
                return true
            }
            return false;
        } catch (error: any) {
            throw Error(error.message);
        }
    }

    async findTemplateById(id: number): Promise<Template | null> {
        const sql = `
        SELECT 
            id,
            title,
            terms,
            version,
            date,
            userId,
            companyId
        FROM template
        WHERE id = ?;`;
        try {
            const [result] = await this.db.query<RowDataPacket[]>(sql, [id]);
            if(result.length > 0) {
                return this.toTemplate(result[0]);
            };
            return null;
           
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

    async createTemplate(template: CreateRequest): Promise<number> {
        try {
            const version = 1;
            let sql = `
            INSERT INTO template(
                title,
                terms,
                date,
                version,
                userId,
                companyId)
            VALUES (?,?,?,?,?,?)
            `;
            const [result] = await this.db.query<ResultSetHeader>(sql, [
                template.title,
                template.terms,
                template.date,
                version,
                template.userId,
                template.companyId
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
            userId: result.userId,
            companyId: result.companyId
        }
    }   

    private toTemplateList(result: RowDataPacket[]): Template[]{
        let templates: Template[] = [];
        for(let i = 0;i< result.length;i++){
            templates.push(this.toTemplate(result[i]));
        }
        return templates;
    }

    private toTemplateTitlesList(result: RowDataPacket[]): TemplateTitle[]{
        let templates: TemplateTitle[] = [];
        for(let i = 0;i< result.length;i++){
            templates.push({
                id: result[0].id,
                title: result[0].title
            });
        }
        return templates;
    }
}

