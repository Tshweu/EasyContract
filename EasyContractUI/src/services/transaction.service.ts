import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ITransaction } from '../models/ITransaction';
import { ICheckout } from '../models/ICheckout';
import { ITransactionDetails } from '../models/ITransactionDetails';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private _http: HttpClient) { }

  getTransactions(){
    return this._http.get<ITransaction[]>(`${environment.api}transaction`);
  }

  getTransaction(id: number){
    return this._http.get<ITransactionDetails>(`${environment.api}transaction/${id}`);
  }

  checkout(checkout: ICheckout){
    return this._http.post<ICheckout>(`${environment.api}transaction`,checkout);
  }

  returnBooks(returnBooks: ICheckout,id: number){
    return this._http.put(`${environment.api}transaction/${id}`,returnBooks);
  }

  getMemberTransactions(id: number){
    return this._http.get<ITransaction[]>(`${environment.api}transaction/member/${id}`);
  }

}
