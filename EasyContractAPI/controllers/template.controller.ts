import { Router, Request, Response } from 'express';
import { TemplateService } from '../services/template.service';
import { Template } from '../models/Template';
import db from '../config/db';
import { TemplateTitle } from '../models/TemplateTitle';
import { DateTime } from 'luxon';

export default class TemplateController {
    async get(req: Request, res: Response) {
        try {
            const templateService = new TemplateService(db);

            const userId: number = parseInt(req.body.userId);
            //pass user id into service
            const template: Template[] = await templateService.findAll(userId);
            res.send(template);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async getTitles(req: Request, res: Response) {
        try {
            const templateService = new TemplateService(db);

            const userId: number = parseInt(req.params.id);
            //pass user id into service
            const template: TemplateTitle[] | null =
                await templateService.findTitles(userId);
            if (template) {
                res.status(200).send(template);
            }
            res.status(204).send();
        } catch (err) {}
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const templateService = new TemplateService(db);

            const template: Template | null =
                await templateService.findTemplateById(id);
            if (!template) {
                res.status(404).send('Template not found');
                return;
            }
            res.send(template);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    async create(req: Request, res: Response) {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            const template: Template = req.body;
            template.date = date;
            template.version = 1;
            const templateService = new TemplateService(db);

            //check if template with title exists
            const found = await templateService.doesTemplateTitleExist(
                template.title,
                template.userId,
            );

            if (found) {
                res.status(400).send('template must have unique name');
                return;
            }

            const result = await templateService.createTemplate(
                template,
                template.userId,
            );

            if (result > 0) {
                res.status(201).send({});
                return;
            } else {
                res.status(500).send('error creating template');
                return;
            }
        } catch (error) {
            res.status(500).send('Error Creating template');
        }
    }

    async update(req: Request, res: Response) {
        try {
            const body = req.body;
            const templateService = new TemplateService(db);

            //Find existing template
            const templateId: number = parseInt(req.params.id);
            const template: Template | null = await templateService.findTemplateById(templateId);

            //If template doesn't exist return error
            if(!template){
                res.status(404).send('template not found');
                return;
            }
            //If template exists check that it belongs to the user
            if(!(template.userId === body.userId)){
                res.status(403).send('unauthorised');
                return;
            }
            body.version = template.version + 1;
            //Update template
            await templateService.updateTemplateById(templateId, body);
            res.status(200).send('Success')
            return;
        } catch (error) {
            res.status(500).send('Error Updating template');
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const templateService = new TemplateService(db);

            const templateId: number = parseInt(req.params.id);
            const template = await templateService.deleteTemplateById(
                templateId,
            );
        } catch (error) {
            res.status(500).send('Error deleting template');
        }
    }
}
