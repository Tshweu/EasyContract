import { Component, inject, OnInit } from '@angular/core';
import { TemplateFormComponent } from '../../../components/forms/template-form/template-form.component';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../../services/template.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-view-template',
    imports: [TemplateFormComponent, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './view-template.component.html',
    styleUrl: './view-template.component.css',
})
export class ViewTemplateComponent implements OnInit {
    id: number;
    templateForm: FormGroup;
    loading: boolean = false;
    private _snackBar = inject(MatSnackBar);

    constructor(
        private activatedRoute: ActivatedRoute,
        private templateService: TemplateService,
        private formBuilder: FormBuilder,
    ) {
        this.id = activatedRoute.snapshot.params['id'];
        this.templateForm = this.formBuilder.group({
            id: ['', Validators.required],
            title: ['', Validators.required],
            terms: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getTemplate();
    }

    getTemplate(): void {
        this.loading = true;
        this.templateService.getTemplate(this.id).subscribe({
            next: (res) => {
                console.log(res);
                this.templateForm.setValue({
                    title: res.title,
                    terms: res.terms,
                    id: res.id,
                });
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            },
        });
    }

    updateTemplate(): void {
        this.loading = true;
        this.templateService.updateTemplate(this.templateForm.value).subscribe({
            next: (res) => {
                console.log(res);
                this.loading = false;
            },
            error: (error) => {
                console.error(error);
                this.loading = false;
            },
        });
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, { duration: 3000 });
    }
}
