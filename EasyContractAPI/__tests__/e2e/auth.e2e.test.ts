import request from 'supertest';
import App from '../../index';
import User from '../../models/User';
import { createTables, destroyTables } from '../../config/init';
import express, { Express } from 'express';
import Routes from '../..';
import userRoutes from '../../routes/user.routes';
import UserDTO from '../../models/dto/UserDTO';
import { LoginDTO } from '../../models/dto/LoginDTO';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

describe('Auth tests', () => {
    let user: LoginDTO = {
        email: 'john@cena.com',
        password: 'john',
    };

    beforeAll(() => {
        return createTables();
    });

    afterAll(() => {
        return destroyTables();
    });

    test('should login user and return token', async () => {
        const response = await request(new App(app).get())
            .post('/api/v1/auth/login')
            .send(user);
            
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    // test('should valid otp', async () => {
    // });
});
