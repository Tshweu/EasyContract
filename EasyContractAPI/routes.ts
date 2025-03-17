import express, { Application} from 'express';
import userRoutes from './routes/user.routes';
import contractRecipientRoutes from './routes/contract-recipient.routes';
import templateRoutes from './routes/template.routes';
import contractRoutes from './routes/contract.routes';
import authRoutes from './routes/auth.routes';
import { Pool } from 'mysql2/promise';
import AuthController from './controllers/auth.controller';
import con from './config/db';

export default class Routes{

    constructor(app: Application,controllers: any) {
        app.use("/api/v1/auth", new authRoutes(controllers.authController).router);
        app.use("/api/v1/user", new userRoutes(controllers.userController).router );
        app.use("/api/v1/template", new templateRoutes(controllers.templateController).router);
        app.use("/api/v1/contract", new contractRoutes(controllers.contractController).router);
        app.use("/api/v1/recipient", new contractRecipientRoutes(controllers.contractRecipientController).router);
    }
}
