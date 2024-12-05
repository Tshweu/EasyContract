import { Router, Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { Contract } from '../models/Contract';
import { Pool } from 'mysql2/promise';

export default class ContractController {
    contractService: ContractService;

    constructor(private db: Pool) {
        this.contractService = new ContractService(this.db);
    }

    async get(req: Request, res: Response) {
        try {
            const userId: number = parseInt(req.params.id);

            //pass user id into service
            const contract: Contract[] = await this.contractService.findAll(
                userId,
            );
            res.send(contract);
        } catch (err) {}
    }

    async getById(req: Request, res: Response) {
        try {
            const contract: Contract =
                await this.contractService.findContractById(0);
            res.send(contract);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async create(req: Request, res: Response) {
        try {
            // const contract: Contract = req.body;



            // //Update contract
            // this.contractService.createContract(contract, contract.userId);
        } catch (error) {}
    }

    async update(req: Request, res: Response) {
        try {
            const body = req.body;

            const contractId: number = parseInt(req.params.id);
            const contract = await this.contractService.updateContractById(
                contractId,
                body,
            );
        } catch (error) {}
    }
}
