import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';

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
        FormsModule
    ],
    templateUrl: './template-form.component.html',
    styleUrl: './template-form.component.css',
})
export class TemplateFormComponent {

    @ViewChild('tinymceRef') tinymceRef!: EditorComponent;
    editorContent = '';
    @Input() templateForm: FormGroup;
    @Output() templateFormChange: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    init: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min',
        plugins: 'lists link image table code help wordcount',
        promotion: false,
        height: '70vh',
        toolbar:
            `undo redo | 
            formatselect | 
            bold italic backcolor | 
            alignleft aligncenter alignright alignjustify | 
            bullist numlist outdent indent | 
            date |
            fullname |
            email |
            idnumber `,
        setup: (editor: any) => {
            this.createTinyMCEButton(editor, 'date', 'Insert Date', 'date');
            this.createTinyMCEButton(editor, 'fullname', 'Insert Full Name', 'fullName');
            this.createTinyMCEButton(editor, 'email', 'Insert Email', 'email');
            this.createTinyMCEButton(editor, 'idnumber', 'Insert ID Number', 'idNumber');
        }
    };

    createTinyMCEButton(editor: any, name: string, text: string,placeHolder: string) {
        return editor.ui.registry.addButton(name, {
            text: text,
            onAction: () => {
                editor.insertContent(`<strong>{{${placeHolder}}}</strong>`);
            }
        });
    }

    constructor(private formBuilder: FormBuilder) {
        this.templateForm = this.formBuilder.group({ title: '', terms: '' });
    }

    insertText() {

        const editor = this.tinymceRef.editor;
        editor.insertContent('This was inserted at the cursor!');

        if (editor) {
        }
    }
}
