import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import Template from '../models/Template';
import ContractRecipient from '../models/ContractRecipient';

@Injectable({
  providedIn: 'root'
})
export class SignatoryService {

 constructor(private _http: HttpClient) {}

    getTemplates() {
        return this._http.get<Template[]>(`${environment.api}template`);
    }
  updateSignatory(signatory: any) {
      return this._http.put<ContractRecipient>(
          `${environment.api}signatory/${signatory.id}`,signatory);
  }

}
