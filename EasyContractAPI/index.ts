import express, { Application, Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

import Routes from './routes';

export default class App {
    port = process.env.PORT || 3000;
    private app: Express;

    constructor(app: Express) {
        new Routes(app);
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