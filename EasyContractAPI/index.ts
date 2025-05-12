import express, { Application, Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import Routes from './routes';
import { UserService } from './services/user.service';
import UserController from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import AuthController from './controllers/auth.controller';
import { TemplateService } from './services/template.service';
import TemplateController from './controllers/template.controller';
import { SignatoryService } from './services/signatory.service';
import SignatoryController from './controllers/signatory.controller';
import { ContractService } from './services/contract.service';
import ContractController from './controllers/contract.controller';
import { ContractAuditService } from './services/contract-audit.service';

export default class App {
    port = process.env.PORT || 3000;
    private app: Express;

    constructor(app: Express,db: any) {
        const services = {
            userService: new UserService(db),
            authService: new AuthService(db),
            templateService: new TemplateService(db),
            signatoryService: new SignatoryService(db),
            contractService: new ContractService(db),
            auditService: new ContractAuditService(db),
        }
        const controllers = {
            templateController: new TemplateController(services.templateService),
            userController: new UserController(services.userService),
            authController: new AuthController(services.authService),
            signatoryController: new SignatoryController(services.signatoryService),
            contractController: new ContractController(
                services.contractService,
                services.templateService,
                services.signatoryService,
                services.userService,
                services.auditService,
                ),
        }
        new Routes(app,controllers);
        this.app = app;
    }

    config(): void {
        this.app.listen(this.port, () => {
            console.log(
                `[server]: Server is running at http://localhost:${this.port}`,
            );
        });
    }

    get(){
        return this.app;
    }
}

// export default app;
// const app: Express = express();
// new Routes(app);
// export default app;

    // config(): void {
    //     this.app.listen(this.port, () => {
    //         console.log(
    //             `[server]: Server is running at http://localhost:${this.port}`,
    //         );
    //     });
    // }