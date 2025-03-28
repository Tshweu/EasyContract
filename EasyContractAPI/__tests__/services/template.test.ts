import { TemplateService } from '../../services/template.service';
import { Template } from '../../entities/Template';
import pool from '../../config/db';
import { createTables, destroyTables } from '../../config/init';
import { DateTime } from 'luxon';
import { TemplateTitle } from '../../entities/TemplateTitle';

describe('template service tests', () => {
    const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
    let template: Template = {
        title: 'FASFAS 2324',
        terms: ' BNHJSDCN',
        date: date,
        userId: 1,
        version: 1,
    };

    beforeAll(() => {
        return createTables();
    });

    afterAll(() => {
        return destroyTables();
    });

    afterAll(() => {
        return pool.end();
    });

    test('should create new template', async () => {
        let templateService: TemplateService = new TemplateService(pool);

        const affectedRows: number = await templateService.createTemplate(
            template,
            1,
        );
        expect(affectedRows).toBe(1);
    });

    test('should get all user templates ', async () => {
        let templateService: TemplateService = new TemplateService(pool);

        const foundTemplate: Template[] = await templateService.findAll(1);
        expect(foundTemplate.length).toBeGreaterThan(0);
    });

    test('should get all user templates titles ', async () => {
        let templateService: TemplateService = new TemplateService(pool);

        const foundTemplate: TemplateTitle[] | null = await templateService.findTitles(1);
        if(foundTemplate){
            expect(foundTemplate.length).toBeGreaterThan(0);
        }
    });

    test('should update template by id', async () => {
        let templateService: TemplateService = new TemplateService(pool);

        const affectedRows: number = await templateService.updateTemplateById(
            1,
            template,
        );
        expect(affectedRows).toBe(1);
    });

    test('should get template by id', async () => {
        let templateService: TemplateService = new TemplateService(pool);
        template.id = 1;
        const foundTemplate: Template | null = await templateService.findTemplateById(
            1,
        );
        expect(foundTemplate).toStrictEqual(template);
    });

    test('should delete template', async () => {
        let templateService: TemplateService = new TemplateService(pool);

        const affectedRows: number = await templateService.deleteTemplateById(
            1,
        );
        expect(affectedRows).toBe(1);
    });
});
