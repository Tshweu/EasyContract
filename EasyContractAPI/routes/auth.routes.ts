import { Request, Response, Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
    router = Router();

    constructor(private controller:AuthController) {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post('/login', this.controller.login);
        // Create a new User
        this.router.post('/sign-up', this.controller.login );
        // Retrieve a single User with id
        this.router.get('/forgot', this.controller.forgot );
        this.router.get('/otp', this.controller.otp );
    }
}

export default AuthRoutes;
