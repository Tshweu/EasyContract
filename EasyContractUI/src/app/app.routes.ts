import { Routes } from '@angular/router';
import { authCanActivateChildGuard } from '../guards/auth-can-activate-child.guard';
import { authCanActivateGuard } from '../guards/auth-can-activate.guard';
import { LoginComponent } from './auth/login/login.component';
import { ViewsComponent } from './views/views.component';
import { ManageTemplatesComponent } from './views/templates/manage-templates/manage-templates.component';
import { ViewTemplateComponent } from './views/templates/view-template/view-template.component';
import { ViewContractComponent } from './views/contracts/view-contract/view-contract.component';
import { ManageContractComponent } from './views/contracts/manage-contract/manage-contract.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CreateContractComponent } from './views/contracts/create-contract/create-contract.component';
import { CreateTemplateComponent } from './views/templates/create-template/create-template.component';

export const routes: Routes = [
    {
        path: 'views',
        component: ViewsComponent,
        // canActivate: [authCanActivateGuard],
        // canActivateChild: [authCanActivateChildGuard],
        children: [
          {
            path: 'template/manage',
            component: ManageTemplatesComponent,
          },
          {
            path: 'template/create',
            component: CreateTemplateComponent,
          },
          {
            path: 'template/:id',
            component: ViewTemplateComponent,
          },
          {
            path: 'contract/manage',
            component: ManageContractComponent,
          },
          {
            path: 'contract/create',
            component: CreateContractComponent,
          },
          {
            path: 'contract/:id',
            component: ViewContractComponent,
          },
        ],
      },
      {
        path: 'submission',
        component: ViewsComponent,
        // canActivate: [authCanActivateGuard],
        // canActivateChild: [authCanActivateChildGuard],
        children: [
          {
            path: 'template/manage',
            component: ManageTemplatesComponent,
          },
          {
            path: 'template/create',
            component: CreateTemplateComponent,
          },
          {
            path: 'template/:id',
            component: ViewTemplateComponent,
          }
        ],
      },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'login', component: LoginComponent },
      { path: '**', redirectTo: 'login' },
];
