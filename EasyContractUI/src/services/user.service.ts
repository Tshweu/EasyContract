import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) {}

  login(data:any){
    return this._http.post<any>(`${environment.api}auth/login`,data);
  }

  signup(data:any){
    return this._http.post<any>(`${environment.api}user`,data);
  }

  logoutUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
  }

  loggedIn() {
    return !!sessionStorage.getItem('token');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getUsers() {
    return this._http.get<any>(`${environment.api}user`);
  }

}
