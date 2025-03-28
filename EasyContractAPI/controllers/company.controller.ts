import { Router, Request, Response } from 'express';
import { CompanyService } from '../services/company.service';
import Company from '../entities/Company';
import db from '../config/db';

export default class CompanyController {
    private companyService: CompanyService;
    constructor(companyService: CompanyService){
       this.companyService = companyService;
    }

    getById = async (req: Request, res: Response)=>{
       console.log(this.companyService);
        console.log("get it")
        try {
            const id = parseInt(req.params.id);
            const company = await this.companyService.findCompanyById(id);
            res.send(company);
        } catch (err) {
            res.status(500).send('Internal Error'+err);
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            let company: Company = req.body;
            let companyService = new CompanyService(db);

            const result: number = await companyService.createCompany(company);
            if (result > 0) {
                res.status(201).send('New company created');
                return;
            } else {
                res.status(401).send('error creating company');
                return;
            }
        } catch (error) {
            res.status(500).send('error creating company');
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const company = req.body;
            let companyService = new CompanyService(db);
            const result: number = await companyService.updateCompanyById(id, company);
            if (result > 0) {
                res.status(201).send('New company created');
                return;
            } else {
                res.status(500).send('error creating company');
                return;
            }
        } catch (err) {
            res.status(500).send('error updating company');
        }
    }

    async delete(req: Request, res: Response) {
    }
}
