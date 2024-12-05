import request from 'supertest';
import App from '../../index';
import { Template } from '../../models/Template';
import { createTables, destroyTables } from '../../config/init';
import express, { Express } from 'express';
import Routes from '../..';
import templateRoutes from '../../routes/template.routes';
import { DateTime } from 'luxon';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

describe('Template tests', () => {
    const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');

    let template: Template = {
        title: 'FASFAS 22 2324',
        terms: 'aslhdn jndskcnkiuhdsj BNHJSDCN',
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

    test('should create valid template', async () => {
        const response = await request(new App(app).get())
            .post('/api/v1/template')
            .send(template);
        expect(response.statusCode).toBe(201);
    });

    test('should get template by id', async () => {
        // const response = await request(new App(app).get()).get(
        //     '/api/v1/template/1',
        // );
        // expect(response.statusCode).toBe(200);

        // const existingTemplate: Template = {

        // };
        // expect(response.body).toBe(existingTemplate);
    });

    test('should update template', async () => {
        // const response = await request(new App(app).get())
        //     .put('/api/v1/template')
        //     .send(template);
        // expect(response.statusCode).toBe(201);
        // expect(response.body).toBe(template);
    });
});
