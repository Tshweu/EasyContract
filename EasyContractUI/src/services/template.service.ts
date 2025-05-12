import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import Template from '../models/Template';
import TemplateTitle from '../models/TemplateTitle';

@Injectable({
    providedIn: 'root',
})
export class TemplateService {
    constructor(private _http: HttpClient) {}

    getTemplates() {
        return this._http.get<Template[]>(`${environment.api}template`);
    }

    createTemplate(template: Template) {
        return this._http.post<Template>(
            `${environment.api}template`,
            template,
        );
    }

    getTemplate(id: number) {
        return this._http.get<Template>(`${environment.api}template/${id}`);
    }

    getTemplateTitles() {
        return this._http.get<TemplateTitle[]>(`${environment.api}template`);
    }

    updateTemplate(template: Template) {
        return this._http.put<Template>(
            `${environment.api}template/${template.id}`,
            template,
        );
    }
}
