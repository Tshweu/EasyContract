import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
    router = Router();
    controller = new AuthController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // Create a new User
        this.router.post('/login', this.controller.login);
        // Retrieve a single User with id
        this.router.get('/forgot', this.controller.forgot);
        this.router.get('/', this.controller.otp);
    }
}

export default new AuthRoutes().router;
