import { Router, Request, Response } from 'express';
import { ContractService } from '../services/contract.service';
import { Contract } from '../entities/Contract';
import { ContractStats } from '../entities/ContractStats';
import { TemplateService } from '../services/template.service';
import { Template } from '../entities/Template';
import { contractDTO } from '../models/dto/ContractDTO';
import { DateTime } from 'luxon';
import { SignatoryService } from '../services/signatory.service';
import { Signatory } from '../entities/Signatory';
import { EmailService } from '../services/email.service';
import jwt from 'jsonwebtoken';
import con from '../config/db';
import { UserService } from '../services/user.service';
import User from '../entities/User';
import { ContractAuditService } from '../services/contract-audit.service';

export default class ContractController {

    constructor(private contractService: ContractService, 
        private templateService: TemplateService, 
        private signatoryService: SignatoryService,
        private userService: UserService,
        private auditService: ContractAuditService) {
    }

    get = async (req: Request, res: Response) => {
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

            const contract: Contract = await this.contractService.findContractById(
                contractId,
            );

            const signatory: Signatory =
                await this.signatoryService.findSignatoryByContractId(
                    contractId,
                );
            console.log(signatory);
            //replace placeholders with signatory details
            await this.replacePlaceholders(contract, signatory);

            const audit = await this.auditService.findContractAuditById(contractId);
            contract.auditTrail = audit;
            contract.recipient = signatory;
            res.send(contract);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            const dueDate = DateTime.now().plus({ days: 7 }).toFormat('yyyy-MM-dd hh:mm:ss');
            //only replace place holders when returning data not in db
            const contractDTO: contractDTO = req.body;
            const fullName = req.body.recipient.fullName;

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
                recipient: contractDTO.recipient,
                companyId: contractDTO.companyId,
                dueDate: dueDate,
                otp: Math.floor(Math.random() * (999999 - 100000) + 100000),
            };
            const result = await this.contractService.createContract(
                contract,
                contract.recipient,
            );

            const url = `${process.env.APP_URL}/contract/review/verify/${result}`;
            const message = `
            <h1>Contract Approval Request: </h1>
            <p>Dear ${fullName},
            Please review the contract by clicking the button below.
            Your OTP is ${contract.otp} and the contract will expire in 3 days.
            You can use the OTP and your Id Number to get access to the contract.
            Then apon your approval you can sign the contract.
            </p>
            <br>
            <a href="${url}" target="_blank">
            <button style="background-color: #008CBA;color: white"><h3>Open Contract<h3></button>
            </a><br>
            <h1>Your OTP: ${contract.otp}</h1>`

            if (result > 0) {
                const email = new EmailService();
                await email.sendMail(
                    contract.recipient.email,
                    contract.title,
                    message,
                );
                console.log('Email sent successfully!');

                res.status(201).send({});
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

    replacePlaceholders = async (contract: Contract, signatory: Signatory) => {
        let terms = contract.terms;
        terms = terms.replace(/{{fullName}}/g, signatory.fullName);
        terms = terms.replace(/{{idNumber}}/g, signatory.idNumber);
        terms = terms.replace(/{{email}}/g, signatory.email);
        contract.terms = terms;
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
                const token = jwt.sign({ id: contractId, signatoryId: valid.signatoryId }, process.env.KEY, {
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

    sign = async (req: Request, res: Response) => {
        try {
            const contractId: number = parseInt(req.params.id);
            const signatoryId: number = parseInt(req.body.signatoryId);
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            const valid = await this.contractService.updateContractStatus(
                contractId,
                "signed",
                date
            );

            const contract: Contract = await this.contractService.findContractById(
                contractId,
            );

            const signatory: Signatory =
                await this.signatoryService.findSignatoryByContractId(
                    contractId,
                );

            const user: User | null = await this.userService.findUserById(contract.userId);
            
            contract.recipient = signatory;

            if (valid) {
                let message = `
                <h1>Contract Signature Confirmation: </h1>
                <p>Dear Signatory,
                Congratulations! The contract has been signed successfully.
                </p>`
                const email = new EmailService();
                await email.sendMail(signatory.email,"Contract Signed : "+contract.title , message);

                message = `
                <h1>Contract Approval Request: </h1>
                <p>Dear user,
                Congratulations! The contract ${contract.title} has been signed successfully.
                </p>`
                if(user){
                    await email.sendMail(user.email,"Contract Signed: "+signatory.fullName , message);
                }
                res.status(200).send({});
                return;
            }
            res.status(403).send('Invalid Details');
            return;
        } catch (error) {
            console.log(error);
            res.status(500).send('error signing contract');
            return;
        }
    }
}
