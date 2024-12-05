import { Router } from 'express';
import ContractController from '../controllers/contract.controller';
import db from '../config/db';

class ContractRoutes {
    router = Router();
    controller = new ContractController(db);

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // Create a new Contract
        this.router.post('/', this.controller.create);
        // Retrieve All contracts
        this.router.get('/', this.controller.get);
        // Retrieve a single Contract with id
        this.router.get('/:id', this.controller.getById);
        // Update a Contract with id
        this.router.put('/:id', this.controller.update);
        // Validate contract otp
        // this.router.post('/validate/:id', this.controller.validate);
        // Recipient contract submission
        // this.router.put('/sign/:id', this.controller.sign);
    }
}

export default new ContractRoutes().router;
