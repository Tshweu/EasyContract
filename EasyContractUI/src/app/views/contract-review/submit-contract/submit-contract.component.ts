import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-submit-contract',
  imports: [
    MatButtonModule
  ],
  templateUrl: './submit-contract.component.html',
  styleUrl: './submit-contract.component.css'
})
export class SubmitContractComponent {
  terms = '';

  submit():void{}
}
