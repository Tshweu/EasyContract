import { Component, inject } from '@angular/core';
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
import { auditTrail } from '../../../../models/Contract';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SignatoryService } from '../../../../services/signatory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-view-contract',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        RecipientFormComponent,
        MatTabsModule,
        MatCardModule,
        MatButtonModule
    ],
    templateUrl: './view-contract.component.html',
    styleUrl: './view-contract.component.css',
})
export class ViewContractComponent {
    contractForm: FormGroup;
    recipientForm: FormGroup;
    terms: string = '';
    id: number;
    status: string = '';
    auditTrail: auditTrail[] = [];
    loading: boolean = false;
    private _snackBar = inject(MatSnackBar);

    constructor(
        private formBuilder: FormBuilder,
        private contractService: ContractService,
        private router: Router,
        private signatoryService: SignatoryService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.id = activatedRoute.snapshot.params['id'];
        this.contractForm = this.formBuilder.group({
            title: ['', Validators.required],
        });
        this.recipientForm = this.formBuilder.group({
            id: ['', Validators.required],
            fullName: ['', Validators.required],
            email: ['', Validators.required],
            idNumber: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getContract();
    }

    getContract() {
        this.loading = true;
        this.contractService.getContract(this.id).subscribe({
            next: (res) => {
                this.loading = false;
                this.status = res.status;
                this.auditTrail = res.auditTrail;
                this.terms = res.terms;
                this.contractForm.setValue({ title: res.title });
                this.recipientForm.setValue({ fullName: res.recipient.fullName, idNumber: res.recipient.idNumber, email: res.recipient.email, id: res.recipient.id });
            },
            error: (err) => {
                this.loading = false;
                console.log(err);
            },
        });
    }

    updateRecipient(): void {
        this.loading = false;
        this.signatoryService
            .updateSignatory(this.recipientForm.value).subscribe({
                next: (res: any) => {
                    this.loading = false;
                    console.log(res);
                    this.router.navigateByUrl('/views/contract/manage');
                },
                error: (err: any) => {
                    this.loading = false;
                    console.error(err);
                }
            });
    }

    updateTitle(): void {
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, { duration: 3000 });
    }
}
