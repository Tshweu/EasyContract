import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../services/contract.service';
import Contract from '../../../models/Contract';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-contract',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './submit-contract.component.html',
  styleUrl: './submit-contract.component.css'
})
export class SubmitContractComponent {
  contract: Contract | undefined;
  contractId : number;
  loading: boolean = false;
  private _snackBar = inject(MatSnackBar);
  
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
    this.loading = true;
    this.contractService.getRecipientContract(this.contractId).subscribe({
      next:(res)=>{
        this.loading = false;
        this.contract = res;
        //add toast
      },
      error:(err)=>{
        this.loading = false;
        console.log(err);
      }
    })
  }

  submit():void{
    this.loading = true;
    if(this.contract){
      this.contractService.updateContract(this.contract).subscribe({
        next:(res)=>{
          this.loading = false;
        },
        error:(err)=>{
          this.loading = false;
          console.log(err);
        }
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 3000});
  }
}
