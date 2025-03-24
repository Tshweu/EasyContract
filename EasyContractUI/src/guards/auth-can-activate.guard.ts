import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const authCanActivateGuard: CanActivateFn = (route, state) => {
  return inject(UserService).loggedIn()
};
