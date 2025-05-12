import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButton,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  user_form: FormGroup;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private user_service: UserService, private router: Router) {
    this.user_form = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_verify: ['', [Validators.required]],
    });
  }

  match() {
    const password = this.user_form.get('password')?.value;
    const password_verify = this.user_form.get('password_verify')?.value;
    return password === password_verify;
  }

  register(): void {
    this.loading = true;
    if (this.user_form.valid) {
      const obj = {
        name: this.user_form.get('name')?.value,
        surname: this.user_form.get('surname')?.value,
        email: this.user_form.get('email')?.value,
        password: this.user_form.get('password')?.value,
        roleId: 1
      };
      this.user_service.signup(obj).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
    }
  }

  private _snackBar = inject(MatSnackBar);
  
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action,{duration: 3000});
    }
}
