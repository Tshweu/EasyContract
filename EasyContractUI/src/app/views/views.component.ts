import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule} from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './views.component.html',
  styleUrl: './views.component.css'
})
export class ViewsComponent {
  constructor(private router: Router) {}

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
