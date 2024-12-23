import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { conditions } from '../../../constants/condition';
import { statuses } from '../../../constants/status';
import { TemplateService } from '../../../../services/template.service';
import { Title } from '@angular/platform-browser';
import Template from '../../../../models/Template';
import TemplateTitle from '../../../../models/TemplateTitle';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-contract-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.css'
})
export class ContractFormComponent implements OnInit {
  @Input() contractForm: FormGroup;
  @Output() contractFormChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  templates: TemplateTitle[] = [];
  conditions = conditions;

  constructor(private fb: FormBuilder, private templateService: TemplateService){
    this.contractForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getTemplateTitles();
  }

  getTemplateTitles(): void{
    this.templateService.getTemplateTitles().subscribe({
      next: (res: TemplateTitle[])=>{
        this.templates = res;
      },
      error: (err: any)=>{

      }
    });
  }
}
