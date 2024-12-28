import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../services/contract.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ContractOtpFormComponent } from '../../components/forms/contract-otp-form/contract-otp-form.component'
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractService,
        private route: ActivatedRoute
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
        if (this.otpForm.valid) {
        }
    }
}
