import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonelService } from '../../../core/api/personel.service';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-personel-select-dialog',
  standalone: false,
  templateUrl: './personel-select-dialog.component.html',
  styleUrl: './personel-select-dialog.component.scss',
})
export class PersonelSelectDialogComponent {
  isLoading: any;
  gridApi!: GridApi;
  rowData: any[] = [];
  selectedRows: any[] = [];

  quickFilter = '';

  columnDefs: ColDef[] = [

    { width: 150, field: 'name', headerName: 'Ad', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 150, field: 'lastName', headerName: 'Soyad', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    { width: 150, field: 'departman', headerName: 'Departman', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    // { width: 70, field: 'totalMonthlyCost', headerName: 'Var Sayılan Maaş', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
  ];

  constructor(public activeModal: NgbActiveModal, private personelService: PersonelService) { }

  async ngOnInit() {
    // TODO: API'den çek
    this.rowData = await this.personelService.getList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    this.selectedRows = this.gridApi.getSelectedRows();
    
  }


  confirm() {
   
    this.activeModal.close(this.selectedRows);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
