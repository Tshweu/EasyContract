import { Request, Response, Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Pool } from 'mysql2/promise';

class AuthRoutes {
    router = Router();

    constructor(db: Pool) {
        console.log(db);
        this.intializeRoutes(db);
    }

    intializeRoutes(db: Pool) {
        let controller = new AuthController();
        
        this.router.post('/login', (req: Request, res: Response) => { controller.login(req, res, db) });
        // Create a new User
        this.router.post('/sign-up', (req: Request, res: Response) => { controller.login(req, res, db) });
        // Retrieve a single User with id
        this.router.get('/forgot', (req: Request, res: Response) => { controller.forgot(req, res, db) });
        this.router.get('/', (req: Request, res: Response) => { controller.otp(req, res, db) });
    }
}

export default AuthRoutes;
