import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TemplateService } from '../../../../services/template.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import Template from '../../../../models/Template';

@Component({
    selector: 'app-manage-templates',
    imports: [
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterLink,
    MatTableModule,
    MatInputModule,
    CommonModule,
    MatSortModule,
    MatChipsModule
],
    templateUrl: './manage-templates.component.html',
    styleUrl: './manage-templates.component.css',
})
export class ManageTemplatesComponent {
    private _snackBar = inject(MatSnackBar);
    displayedColumns: string[] = ['id', 'title', 'date', 'version', 'action'];
    dataSource: MatTableDataSource<Template>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private contract_service: TemplateService) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.contract_service.getTemplates().subscribe({
            next: (res: any) => {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err: any) => {
                //ToDo: Err Message
                
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

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
    }
}
