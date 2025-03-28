import { Router, Request, Response } from 'express';
import { TemplateService } from '../services/template.service';
import { Template } from '../entities/Template';
import { TemplateTitle } from '../entities/TemplateTitle';
import { DateTime } from 'luxon';
import { CreateRequest } from '../models/template/CreateRequest';

export default class TemplateController {

    constructor(private templateService: TemplateService) { }

    get = async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.body.userId);
            //pass user id into service
            const template: Template[] = await this.templateService.findAll(userId);
            res.send(template);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    getTitles = async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id);
            //pass user id into service
            const template: TemplateTitle[] | null =
                await this.templateService.findTitles(userId);
            if (template) {
                res.status(200).send(template);
            }
            res.status(204).send();
        } catch (err) { }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            const template: Template | null =
                await this.templateService.findTemplateById(id);
            if (!template) {
                res.status(404).send('Template not found');
                return;
            }
            res.send(template);
        } catch (err) {
            res.status(500).send('Internal Error');
        }
    }

    create = async (req: Request, res: Response) => {
        try {
            const date = DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss');
            req.body.date = date;
            console.log(req.body);
            const template: CreateRequest = req.body;


            //check if template with title exists
            const found = await this.templateService.doesTemplateTitleExist(
                template.title,
                template.userId
            );

            if (found) {
                res.status(400).send('template must have unique name');
                return;
            }

            const result = await this.templateService.createTemplate(
                template
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

    update = async (req: Request, res: Response) => {
        try {
            const body = req.body;

            //Find existing template
            const templateId: number = parseInt(req.params.id);
            const template: Template | null = await this.templateService.findTemplateById(templateId);

            //If template doesn't exist return error
            if (!template) {
                res.status(404).send('template not found');
                return;
            }
            //If template exists check that it belongs to the user
            if (!(template.userId === body.userId)) {
                res.status(403).send('unauthorised');
                return;
            }
            body.version = template.version + 1;
            //Update template
            await this.templateService.updateTemplateById(templateId, body);
            res.status(200).send('Success')
            return;
        } catch (error) {
            res.status(500).send('Error Updating template');
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const templateId: number = parseInt(req.params.id);
            const template = await this.templateService.deleteTemplateById(
                templateId,
            );
        } catch (error) {
            res.status(500).send('Error deleting template');
        }
    }
}
