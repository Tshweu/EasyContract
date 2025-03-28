import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractFormComponent } from '../../../components/forms/contract-form/contract-form.component';
import { RecipientFormComponent } from '../../../components/forms/recipient-form/recipient-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ContractService } from '../../../../services/contract.service';
import Contract from '../../../../models/Contract';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-contract',
    standalone: true,
    imports: [ContractFormComponent, RecipientFormComponent, MatButtonModule],
    templateUrl: './create-contract.component.html',
    styleUrl: './create-contract.component.css',
})
export class CreateContractComponent {
    contractForm: FormGroup;
    recipientForm: FormGroup;

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
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            idNumber: ['', Validators.required],
        });
    }

    generate(): void {
        const contract: Contract = {
            ...this.contractForm.value,
            recipient: this.recipientForm.value,
        };
        this.contractService.createContract(contract).subscribe({
            next: (res) => {
                console.log(res);
                this.router.navigateByUrl('/views/contract/manage')
            },
            error: (err: any) => {
                console.error(err);
            },
        });
    }
}
