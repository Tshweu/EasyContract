import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ContractService } from '../../../../services/contract.service';
import Contract from '../../../../models/Contract';
import { NumberCardComponent } from '../../../components/cards/number-card/number-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-manage-contract',
    imports: [
        MatPaginatorModule,
        MatButtonModule,
        MatFormFieldModule,
        RouterLink,
        MatTableModule,
        MatInputModule,
        CommonModule,
        MatSortModule,
        MatChipsModule,
        NumberCardComponent
    ],
    templateUrl: './manage-contract.component.html',
    styleUrl: './manage-contract.component.css',
})
export class ManageContractComponent {
    displayedColumns: string[] = [
        'id',
        'title',
        'date',
        'recipient',
        'status',
        'action',
    ];
    dataSource: MatTableDataSource<Contract>;
    stats: any[] = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private contractService: ContractService) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.contractService.getContracts().subscribe({
            next: (res: any) => {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                console.log(res);
            },
            error: (err: Error) => {
                //ToDo: Err Message
                console.error(err);
            },
        });
        this.contractService.getStats().subscribe({
            next: (res: any) => {
                for (const [key, value] of Object.entries(res)) {
                    this.stats.push({ title: key, total: value as number });
                }
            },
            error: (err: Error) => {
                //ToDo: Err Message
                console.error(err);
            },
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private _snackBar = inject(MatSnackBar);

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, { duration: 3000 });
    }
}
