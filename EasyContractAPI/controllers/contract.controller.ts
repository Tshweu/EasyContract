import { Router, Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { Contract } from '../entities/Contract';
import db from '../config/db';
import { ContractStats } from '../entities/ContractStats';
import { TemplateService } from '../services/template.service';
import { Template } from '../entities/Template';
import { contractDTO } from '../models/dto/ContractDTO';
import { DateTime } from 'luxon';
import { ContractRecipientService } from '../services/contract-recipient.service';
import { ContractRecipient } from '../entities/ContractRecipient';
import { EmailService } from '../services/email.service';
import jwt from 'jsonwebtoken';

export default class ContractController {

    constructor(private contractService: ContractService,private templateService: TemplateService){
    }

    get = async(req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.body.userId);
            //pass user id into service
            const contract: Contract[] = await this.contractService.findAll(userId);
            res.send(contract);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    getStats = async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.body.userId);
            //pass user id into service
            const contract: ContractStats | null =
                await this.contractService.findStats(userId);
            res.send(contract);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const contractId: number = parseInt(req.params.id);
            const contractRecipientService = new ContractRecipientService(db);

            const contract: Contract = await this.contractService.findContractById(
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

    create = async (req: Request, res: Response) => {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            //only replace place holders when returning data not in db
            const contractDTO: contractDTO = req.body;

            const template: Template | null =
                await this.templateService.findTemplateById(contractDTO.templateId);
            console.log(contractDTO);
            if (!template) {
                res.status(400).send('Template does not exist');
                return;
            }
            
            const contract: Contract = {
                title: contractDTO.title,
                terms: template.terms,
                userId: contractDTO.userId,
                date: date,
                status: 'new',
                completed: false,
                recipient: contractDTO.recipient,
                companyId: contractDTO.companyId
            };
            const result = await this.contractService.createContract(
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

    update = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            const contractId: number = parseInt(req.params.id);

            const contract = await this.contractService.updateContractById(
                contractId,
                body,
            );
        } catch (error) {
            res.status(500).send('error updating contract');
        }
    }

    validate = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            const contractId: number = parseInt(req.params.id);

            const valid = await this.contractService.validateOTP(
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
