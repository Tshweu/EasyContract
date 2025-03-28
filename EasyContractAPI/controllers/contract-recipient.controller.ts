import { Router, Request, Response } from 'express';
import { ContractRecipientService } from '../services/contract-recipient.service';
import db from '../config/db'
import { ContractRecipient } from '../entities/ContractRecipient';


export default class ContractRecipientController{

    constructor(private contractRecipientService: ContractRecipientService){}

    async getById(req: Request,res: Response){
        try{
            const contractRecipient : ContractRecipient = await this.contractRecipientService.findContractRecipientById(0);
            res.send(contractRecipient);
        }catch(err){
            res.status(500).send('Internal Error');
        }
    }

    async update(req: Request,res: Response){
        try {
            const body = req.body;
            //Find existing contractRecipient
            const contractRecipientId: number = parseInt(req.params.id);
            const contractRecipient = await this.contractRecipientService.findContractRecipientById(contractRecipientId);
            
            //If contractRecipient doesn't exist return error
            
            
            //If contractRecipient exists check that it belongs to the user


            //Update contractRecipient
            await this.contractRecipientService.updateContractRecipientById(contractRecipientId,contractRecipient);
        } catch (error) {
            
        }

    };

}
