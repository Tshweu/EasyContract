import { Router, Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { Contract } from '../models/Contract';
import db from '../config/db';
import { ContractStats } from '../models/ContractStats';
import { TemplateService } from '../services/template.service';
import { Template } from '../models/Template';
import { contractDTO } from '../models/dto/ContractDTO';
import { DateTime } from 'luxon';
import { ContractRecipientService } from '../services/contract-recipient.service';
import { ContractRecipient } from '../models/ContractRecipient';
import { EmailService } from '../services/email.service';

export default class ContractController {
    async get(req: Request, res: Response) {
        try {
            const userId: number = parseInt(req.body.userId);

            const contractService = new ContractService(db);
            //pass user id into service
            const contract: Contract[] = await contractService.findAll(userId);
            res.send(contract);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async getStats(req: Request, res: Response) {
        try {
            const userId: number = parseInt(req.body.userId);

            const contractService = new ContractService(db);
            //pass user id into service
            const contract: ContractStats | null =
                await contractService.findStats(userId);
            res.send(contract);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const contractId: number = parseInt(req.params.id);
            const contractService = new ContractService(db);
            const contractRecipientService = new ContractRecipientService(db);

            const contract: Contract = await contractService.findContractById(
                contractId,
            );

            const contractRecipient: ContractRecipient =
                await contractRecipientService.findContractRecipientByContractId(
                    contractId,
                );
            
            contract.recipient = contractRecipient
            res.send(contract);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async create(req: Request, res: Response) {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            //only replace place holders when returning data not in db
            const contractDTO: contractDTO = req.body;

            const templateService = new TemplateService(db);
            const template: Template | null =
                await templateService.findTemplateById(contractDTO.templateId);
            console.log(contractDTO);
            if (!template) {
                res.status(400).send('Template does not exist');
                return;
            }

            const contractService = new ContractService(db);
            const contract: Contract = {
                title: contractDTO.title,
                terms: template.terms,
                userId: contractDTO.userId,
                date: date,
                status: 'new',
                completed: false,
                recipient: contractDTO.recipient,
            };
            const result = await contractService.createContract(
                contract,
                contract.recipient,
            );

            if (result > 0) {
                const email = new EmailService();
                const emailResult = await email.sendMail('t.t.sephiri@gmail.com','Contract','Hey there','dhalkhdakd');
                
                if(emailResult)6 res.status(201).send({});
                return;
            } else {
                res.status(500).send('error creating contract');
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('error creating contract');
            return;
        }
    }

    async update(req: Request, res: Response) {
        try {
            const body = req.body;

            const contractId: number = parseInt(req.params.id);
            const contractService = new ContractService(db);

            const contract = await contractService.updateContractById(
                contractId,
                body,
            );
        } catch (error) {
            res.status(500).send('error updating contract');
        }
    }
}
