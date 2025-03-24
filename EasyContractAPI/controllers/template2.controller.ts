import { Router, Request, Response } from 'express';
import { Template } from '../entities/Template';
import db from '../config/db';
import { TemplateService } from '../services/template.service';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';

export default class Template2Controller {

    constructor(private templateService: TemplateService){}

    get = async(req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.body.userId);
            //pass user id into service
            const template2: Template[] = await this.templateService.findAll(userId);
            res.send(template2);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const templateId: number = parseInt(req.params.id);

            const template: Template | null = await this.templateService.findTemplateById(
                templateId,
            );

            res.send(template);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async create(req: Request, res: Response) {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            //only replace place holders when returning data not in db
            const template2DTO: Template = req.body;
            const template: Template | null =
                await this.templateService.findTemplateById(template2DTO.id);
            console.log(template2DTO);
            if (!template) {
                res.status(400).send('Template does not exist');
                return;
            }
        

           
                res.status(500).send('error creating template2');
                return;
            
        } catch (error) {
            console.log(error);
            res.status(500).send('error creating template2');
            return;
        }
    }

    async update(req: Request, res: Response) {
        try {
            const body = req.body;

            const template2Id: number = parseInt(req.params.id);

            // const template2 = await this.template2Service.updateTemplate2ById(
            //     template2Id,
            //     body,
            // );
        } catch (error) {
            res.status(500).send('error updating template2');
        }
    }
}
