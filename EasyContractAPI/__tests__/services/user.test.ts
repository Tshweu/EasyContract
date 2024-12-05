import { UserService } from '../../services/user.service';
import pool from '../../config/db';
import User from '../../models/User';
import { createTables, destroyTables } from '../../config/init';

describe('user service tests', () => {
    let user: User = {
        id: 2,
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
    
    afterAll(() => {
        return pool.end();
    });
    
    test('should create new user', async () => {
        let userService: UserService = new UserService(pool);

        user.password = 'test';
        const affectedRows: number = await userService.createUser(user);
        expect(affectedRows).toBe(1);

        delete user.password;
    });

    test('should get user by id', async () => {
        let userService: UserService = new UserService(pool);

        const foundUser: User | null = await userService.findUserById(2);
        expect(foundUser).toEqual(user);
    });

    test('should get user by email', async () => {
        let userService: UserService = new UserService(pool);

        const foundUser: User | null = await userService.findUserByEmail(
            'test@gmail.com',
        );
        expect(foundUser).toEqual(user);
    });

    test('should update new user', async () => {
        let userService: UserService = new UserService(pool);

        user.surname = 'new surname';
        const affectedRows: number = await userService.updateUserById(1, user);
        expect(affectedRows).toBe(1);
    });
});
