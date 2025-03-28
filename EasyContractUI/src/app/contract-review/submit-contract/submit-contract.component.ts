import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../services/contract.service';
import Contract from '../../../models/Contract';

@Component({
  selector: 'app-submit-contract',
  imports: [
    MatButtonModule
  ],
  templateUrl: './submit-contract.component.html',
  styleUrl: './submit-contract.component.css'
})
export class SubmitContractComponent {
  contract: Contract | undefined;
  contractId : number;
  constructor(
          private formBuilder: FormBuilder,
          private contractService: ContractService,
          private route: ActivatedRoute,
          private router: Router
      ) {
        this.contractId = this.route.snapshot.params['id'];
      }

  ngOnInit():void{
    this.getContract();
  }

  getContract(){
    this.contractService.getContract(this.contractId).subscribe({
      next:(res)=>{
        this.contract = res;
        //add toast
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  submit():void{}
}
