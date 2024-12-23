import express, { Application} from 'express';
import userRoutes from './routes/user.routes';
import contractRecipientRoutes from './routes/contract-recipient.routes';
import templateRoutes from './routes/template.routes';
import contractRoutes from './routes/contract.routes';
import authRoutes from './routes/auth.routes';

export default class Routes{

    constructor(app: Application) {
        app.use("/api/v1/auth", authRoutes);
        app.use("/api/v1/user", userRoutes);
        app.use("/api/v1/contract", contractRoutes);
        app.use("/api/v1/template", templateRoutes);
        app.use("/api/v1/recipient", contractRecipientRoutes);
    }
}
