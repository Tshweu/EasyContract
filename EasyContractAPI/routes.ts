import express, { Application} from 'express';
import userRoutes from './routes/user.routes';
import contractRecipientRoutes from './routes/contract-recipient.routes';
import templateRoutes from './routes/template.routes';
import contractRoutes from './routes/contract.routes';
import authRoutes from './routes/auth.routes';
import { Pool } from 'mysql2/promise';

export default class Routes{

    constructor(app: Application,db: Pool) {
        console.log(db);
        app.use("/api/v1/auth", new authRoutes(db).router);
        app.use("/api/v1/user", userRoutes);
        app.use("/api/v1/contract", contractRoutes);
        app.use("/api/v1/template", templateRoutes);
        app.use("/api/v1/recipient", contractRecipientRoutes);

    }
}
