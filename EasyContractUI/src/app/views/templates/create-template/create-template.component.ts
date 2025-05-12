import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContractService } from '../../../../services/contract.service';
import { TemplateFormComponent } from '../../../components/forms/template-form/template-form.component';
import { MatButtonModule } from '@angular/material/button';
import { TemplateService } from '../../../../services/template.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-create-template',
    standalone: true,
    imports: [TemplateFormComponent, MatButtonModule],
    templateUrl: './create-template.component.html',
    styleUrl: './create-template.component.css',
})
export class CreateTemplateComponent {
    templateForm: FormGroup;
    private _snackBar = inject(MatSnackBar);

    constructor(
        private formBuilder: FormBuilder,
        private templateService: TemplateService,
        private router: Router
    ) {
        this.templateForm = this.formBuilder.group({
            title: ['', Validators.required],
            terms: ['', Validators.required],
        });
    }

    create(): void {
        this.templateService.createTemplate(this.templateForm.value).subscribe({
            next: (res: any) => {
              this.router.navigateByUrl('views/template/manage');
            },
            error: (err: any) => {
              console.log(err);
            },
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action,{duration: 3000});
    }
}
