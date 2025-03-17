import { Router } from 'express';
import ContractController from '../controllers/contract.controller';
import verifyToken from '../helpers/token';

class ContractRoutes {
    router = Router();

    constructor(private controller: ContractController) {
        this.intializeRoutes();
    }

    intializeRoutes() {
        // Create a new contract
        this.router.post('/',verifyToken, this.controller.create);
        // Retrieve all contracts
        this.router.get('/',verifyToken, this.controller.get);
        this.router.get('/stats',verifyToken, this.controller.getStats);
        // Retrieve a single Contract with id
        this.router.get('/:id',verifyToken, this.controller.getById);
        // Update a Contract with id
        this.router.put('/:id',verifyToken, this.controller.update);
        // Validate contract otp
        this.router.post('/validate/:id', this.controller.validate);
        // Recipient contract submission
        // this.router.put('/sign/:id', this.controller.sign);
    }
}

export default ContractRoutes;
