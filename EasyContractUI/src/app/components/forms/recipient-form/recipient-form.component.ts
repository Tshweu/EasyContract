import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { conditions } from '../../../constants/condition';
import { statuses } from '../../../constants/status';

@Component({
  selector: 'app-recipient-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './recipient-form.component.html',
  styleUrl: './recipient-form.component.css'
})
export class RecipientFormComponent {
  @Input() recipientForm: FormGroup;
  @Output() recipientFormChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  statuses = statuses;
  conditions = conditions;

  constructor(private form_builder: FormBuilder){
    this.recipientForm = form_builder.group({});
  }
}
