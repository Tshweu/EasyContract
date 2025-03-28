import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const authCanActivateChildGuard: CanActivateChildFn = (childRoute, state) => {
  return inject(UserService).loggedIn()
};
