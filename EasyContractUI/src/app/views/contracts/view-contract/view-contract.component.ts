import { Component } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../../services/contract.service';
import { ContractFormComponent } from '../../../components/forms/contract-form/contract-form.component';
import { RecipientFormComponent } from '../../../components/forms/recipient-form/recipient-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
    selector: 'app-view-contract',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        RecipientFormComponent,
        MatTabsModule,
    ],
    templateUrl: './view-contract.component.html',
    styleUrl: './view-contract.component.css',
})
export class ViewContractComponent {
    contractForm: FormGroup;
    recipientForm: FormGroup;
    terms: string = '';
    id: number;
    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.id = activatedRoute.snapshot.params['id'];
        this.contractForm = this.formBuilder.group({
            title: ['', Validators.required],
        });
        this.recipientForm = this.formBuilder.group({
            id: ['',Validators.required],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            idNumber: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getContract();
    }

    getContract() {
        this.contractService.getContract(this.id).subscribe({
            next: (res) => {
                console.log(res);
                this.terms = res.terms;
                this.contractForm.setValue({ title: res.title });
                this.recipientForm.setValue({ name: res.recipient.name,surname: res.recipient.surname,idNumber: res.recipient.idNumber, email: res.recipient.email, id : res.recipient.id });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
