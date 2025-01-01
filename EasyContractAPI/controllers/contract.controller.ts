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
import jwt from 'jsonwebtoken';

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

            contract.recipient = contractRecipient;
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
                const emailResult = await email.sendMail(
                    't.t.sephiri@gmail.com',
                    contract.title,
                    'Hey there',
                    'dhalkhdakd',
                );

                if (emailResult) res.status(201).send({});
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

    async validate(req: Request, res: Response) {
        try {
            const body = req.body;
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            const contractId: number = parseInt(req.params.id);
            const contractService = new ContractService(db);

            const valid = await contractService.validateOTP(
                contractId,
                body.otp,
                body.idNumber,
                date
            );

            if (!process.env.KEY) {
                res.status(500).send('Internal Error');
                return;
            }
            //create different key for contracts
            if (valid) {
                const token = jwt.sign({ id: contractId }, process.env.KEY, {
                    expiresIn: '1 days',
                });
                res.status(200).send({ token: token });
                return;
            }
            res.status(403).send('Invalid Details');
            return;
        } catch (error) {
            console.log(error);
            res.status(500).send('error validating contract');
            return;
        }
    }
}
