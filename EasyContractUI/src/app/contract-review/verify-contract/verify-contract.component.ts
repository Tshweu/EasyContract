import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../services/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ContractOtpFormComponent } from '../../components/forms/contract-otp-form/contract-otp-form.component'
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-verify-contract',
    imports: [
    MatButtonModule,
    ContractOtpFormComponent,
    MatCardModule,
    MatProgressSpinnerModule
],
    templateUrl: './verify-contract.component.html',
    styleUrl: './verify-contract.component.css',
})
export class VerifyContractComponent {
    otpForm: FormGroup;
    loading: boolean = false;
    private _snackBar = inject(MatSnackBar);

    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.otpForm = this.formBuilder.group({
            contractId: [this.route.snapshot.params['id'], Validators.required],
            otp: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(6),
                    Validators.minLength(6),
                ],
            ],
            idNumber: ['', [Validators.required]],
        });
    }

    submit(): void {
        this.loading = true;
        if (this.otpForm.valid) {
            this.contractService.verifyContractUser(this.otpForm.value).subscribe({
                next: (res:any)=>{
                    this.loading = false;
                    sessionStorage.setItem('token',res.token);
                    this.router.navigateByUrl(`/contract/review/submit/${this.otpForm.value.contractId}`);

                },
                error: (err)=>{
                    this.loading = false;
                    console.log(err);
                }
            })
        }
    }

    openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 3000});
    }
}
