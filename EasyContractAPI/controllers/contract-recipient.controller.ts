import { Router, Request, Response } from 'express';
import { ContractRecipientService } from '../services/contract-recipient.service';
import db from '../config/db'
import { ContractRecipient } from '../models/ContractRecipient';


export default class ContractRecipientController{

    constructor(){}

    async getById(req: Request,res: Response){
        try{
            const contractRecipientService: ContractRecipientService = new ContractRecipientService(db);
            const contractRecipient : ContractRecipient = await contractRecipientService.findContractRecipientById(0);
            res.send(contractRecipient);
        }catch(err){
            res.status(500).send('Internal Error');
        }
    }

    async update(req: Request,res: Response){
        try {
            const body = req.body;
            const contractRecipientService: ContractRecipientService = new ContractRecipientService(db);
            //Find existing contractRecipient
            const contractRecipientId: number = parseInt(req.params.id);
            const contractRecipient = await contractRecipientService.findContractRecipientById(contractRecipientId);
            
            //If contractRecipient doesn't exist return error

            //If contractRecipient exists check that it belongs to the user

            //Update contractRecipient
            await contractRecipientService.updateContractRecipientById(contractRecipientId,contractRecipient);
        } catch (error) {
            
        }

    };

}
