import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractFormComponent } from '../../../components/forms/contract-form/contract-form.component';
import { RecipientFormComponent } from '../../../components/forms/recipient-form/recipient-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ContractService } from '../../../../services/contract.service';
import Contract from '../../../../models/Contract';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-create-contract',
    standalone: true,
    imports: [ContractFormComponent, RecipientFormComponent, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './create-contract.component.html',
    styleUrl: './create-contract.component.css',
})
export class CreateContractComponent {
    contractForm: FormGroup;
    recipientForm: FormGroup;
    loading: boolean = false;
    private _snackBar = inject(MatSnackBar);

    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractService,
        private router: Router
    ) {
        this.contractForm = this.formBuilder.group({
            title: ['', Validators.required],
            templateId: [0, Validators.required],
        });
        this.recipientForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            email: ['', Validators.required],
            idNumber: ['', Validators.required],
        });
    }

    generate(): void {
        this.loading = true;
        const contract: Contract = {
            ...this.contractForm.value,
            recipient: this.recipientForm.value,
        };
        this.contractService.createContract(contract).subscribe({
            next: (res) => {
                this.loading = false;
                this.openSnackBar('Contract created successfully', 'Close');
                console.log(res);
                this.router.navigateByUrl('/views/contract/manage')
            },
            error: (err: any) => {
                this.loading = false;
                this.openSnackBar('Error creating contract: '+err.message, 'Close');
                console.error(err);
            },
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, { duration: 3000 });
    }
}
