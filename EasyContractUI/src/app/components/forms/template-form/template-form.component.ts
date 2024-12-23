import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
    selector: 'app-template-form',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        EditorComponent,
    ],
    templateUrl: './template-form.component.html',
    styleUrl: './template-form.component.css',
})
export class TemplateFormComponent {
    @Input() templateForm: FormGroup;
    @Output() templateFormChange: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min',
        plugins: 'lists link image table code help wordcount',
        promotion: false,
        height: '70vh'
    };

    constructor(private formBuilder: FormBuilder) {
        this.templateForm = this.formBuilder.group({ title: '', terms: '' });
    }
}
