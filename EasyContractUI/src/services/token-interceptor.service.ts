import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  constructor(private injector: Injector,private _userService: UserService) { }

  intercept(req:any, next:any) {
    const tokenizedReq = req.clone(
      {
        headers: req.headers.set('Authorization', 'bearer ' + this._userService.getToken())
      }
    );
    return next.handle(tokenizedReq);
  }
}
