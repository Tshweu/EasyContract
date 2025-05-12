// test/auth.controller.test.ts
import sinon from 'sinon';
import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthController from '../../controllers/auth.controller';
import User from '../../entities/User';
import { AuthService } from '../../services/auth.service';

describe('AuthController - login', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let sendStub: sinon.SinonStub;
  let authService: Partial<AuthService>;
  let controller: AuthController;

  beforeEach(() => {
    process.env.KEY = 'test-secret';

    sendStub = sinon.stub();
    statusStub = sinon.stub().returns({ send: sendStub }) as any;
    res = {
      status: statusStub,
      send: sendStub
    };

    req = {
      body: {
        email: 'alice@example.com',
        password: 'plaintext'
      }
    };

    authService = {
      findUserPassword: sinon.stub()
    };

    controller = new AuthController(authService as AuthService);
  });

  it('should return token if login is successful', async () => {
    const fakeUser = {
      id: 1,
      name: 'Alice',
      surname: 'Smith',
      companyId: 101,
      password: await bcrypt.hash('plaintext', 10)
    } as User;

    (authService.findUserPassword as sinon.SinonStub).resolves(fakeUser);

    await controller.login(req as Request, res as Response);

    sinon.assert.calledOnce(authService.findUserPassword as sinon.SinonStub);
    sinon.assert.calledWith(statusStub, 200);
    sinon.assert.called(sendStub);
    const responseArg = sendStub.firstCall.args[0];
    expect(responseArg).toHaveProperty('token');
    expect(responseArg.name).toEqual('Alice Smith');
  });
});

describe('AuthController - forgot & otp', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusStub: sinon.SinonStub;
    let sendStub: sinon.SinonStub;
    let authService: Partial<AuthService>;
    let controller: AuthController;
  
    beforeEach(() => {
      sendStub = sinon.stub();
      statusStub = sinon.stub().returns({ send: sendStub }) as any;
      res = {
        status: statusStub,
        send: sendStub
      };
  
      authService = {
        findUserPassword: sinon.stub()
      };
  
      controller = new AuthController(authService as AuthService);
    });
  
    it('forgot - should call findUserPassword and not throw', async () => {
      const fakeUser: User = {
        email: 'alice@example.com'
      } as User;
  
      req = {
        body: fakeUser
      };
  
      (authService.findUserPassword as sinon.SinonStub).resolves(fakeUser);
  
      await controller.forgot(req as Request, res as Response);
  
      sinon.assert.calledOnce(authService.findUserPassword as sinon.SinonStub);
    });
  
    it('forgot - should return 500 if findUserPassword throws', async () => {
      req = {
        body: { email: 'bad@example.com' }
      };
  
      (authService.findUserPassword as sinon.SinonStub).rejects(new Error('DB fail'));
  
      await controller.forgot(req as Request, res as Response);
  
      sinon.assert.calledWith(statusStub, 500);
      sinon.assert.calledWith(sendStub, 'error creating user');
    });
  
  });

