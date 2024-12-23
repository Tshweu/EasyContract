import { Injectable } from '@angular/core';
import Contract from '../models/Contract';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private _http: HttpClient) { }

  getContracts(){
    return this._http.get<Contract[]>(`${environment.api}contract`);
  }

  getStats(){
    return this._http.get<any>(`${environment.api}contract/stats`);
  }

  createContract(contract: Contract){
    return this._http.post<Contract>(`${environment.api}contract`,contract);
  }

  getContract(id:number){
    return this._http.get<Contract>(`${environment.api}contract/${id}`);
  }

  updateContract(contract: Contract){
    return this._http.put<Contract>(`${environment.api}contract/${contract.id}`,contract);
  }
}
