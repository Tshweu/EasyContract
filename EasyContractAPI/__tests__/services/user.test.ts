import { UserService } from '../../services/user.service';
// import User from '../../models/user/CreateRequest';
import User from '../../entities/User';
import { createTables, destroyTables } from '../../config/init';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import UserDTO from '../../models/dto/UserDTO';
import sinon from 'sinon';

describe('user service tests', () => {
    let pool: sinon.SinonStubbedInstance<mysql.Pool>;
    let connection: sinon.SinonStubbedInstance<mysql.PoolConnection>;

    beforeEach(() => {
        // Create fake connection and pool objects
        connection = {
            query: sinon.stub(),
            release: sinon.stub(),
        } as any;

        pool = {
            query: sinon.stub(),
            getConnection: sinon.stub(),
        } as any;
    });



    test('should create new user', async () => {
        let user: User = {
            name: 'test',
            surname: 'test',
            email: 'test@gmail.com',
            roleId: 1,
            companyId: 1,
        };

        const expectedUser: User = {
            id: 1,
            name: 'test',
            surname: 'test',
            email: 'test@gmail.com',
            password: 'test',
            roleId: 1,
            companyId: 1
        };

        const fakeInsertResult = { insertId: 42 } ;

        // Setup stubs
        (pool.getConnection as sinon.SinonStub).callsFake((callback: any) => callback(null, connection));
        (pool.query as sinon.SinonStub).resolves([ fakeInsertResult as ResultSetHeader, undefined]);

        let userService: UserService = new UserService(pool);

        // user.password = 'test';
        const affectedRows: number = await userService.createUser(user);
        // expect(affectedRows).toBe(1);
        expect(affectedRows).toEqual(42);

        // delete user.password;
    });

    // test('should get user by id', async () => {
    //     let userService: UserService = new UserService(pool);

    //     const foundUser: User | null = await userService.findUserById(2);
    //     // expect(foundUser).toEqual(user);
    // });

    // test('should get user by email', async () => {
    //     let userService: UserService = new UserService(pool);

    //     const foundUser: User | null = await userService.findUserByEmail(
    //         'test@gmail.com',
    //     );
    //     // expect(foundUser).toEqual(user);
    // });

    // test('should update new user', async () => {
    //     let userService: UserService = new UserService(pool);

    //     // user.surname = 'new surname';
    //     // const affectedRows: number = await userService.updateUserById(1, user);
    //     // expect(affectedRows).toBe(1);
    // });
});
