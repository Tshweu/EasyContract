import request from 'supertest';
import App from '../../index';
import User from '../../models/User';
import { createTables, destroyTables } from '../../config/init';
import express, { Express } from 'express';
import Routes from '../..';
import userRoutes from '../../routes/user.routes';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

describe('User tests', () => {

    let user: User = {
        name: 'test',
        surname: 'test',
        email: 'test@gmail.com',
    };

    beforeAll(() => {
        return createTables();
    });

    afterAll(() => {
        return destroyTables();
    });

    test('should create valid user', async () => {
        user.password = 'myshwy';
        const response = await request(new App(app).get())
            .post('/api/v1/user')
            .send(user);
        expect(response.statusCode).toBe(201);
    });

    test('should get user by id', async () => {
        const response = await request(new App(app).get()).get(
            '/api/v1/user/1',
        );
        expect(response.statusCode).toBe(200);
        const existingUser: User = {
            id: 1,
            email: 'john@cena.com',
            name: 'John',
            surname: 'Cena'
        };
        expect(response.body).toStrictEqual(existingUser);
    });

    test('should update user', async () => {
        const existingUser: User = {
            id: 1,
            email: 'john2@cena.com',
            name: 'John Jones',
            surname: 'Cena'
        };
        const response = await request(new App(app).get())
            .put('/api/v1/user/1')
            .send(existingUser);
        expect(response.statusCode).toBe(201);
    });
});