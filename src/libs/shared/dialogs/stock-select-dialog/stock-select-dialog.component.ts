import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { StockService } from '../../../core/api/stock.service';
@Component({
  selector: 'app-stock-select-dialog',
  standalone: false,
  templateUrl: './stock-select-dialog.component.html',
  styleUrl: './stock-select-dialog.component.scss',
})
export class StockSelectDialogComponent {
  isLoading: any;
  gridApi!: GridApi;
  rowData: any[] = [];
  selectedRows: any[] = [];

  quickFilter = '';

  columnDefs: ColDef[] = [
    // {
    //   headerName: '',
    //   checkboxSelection: true,
    //   headerCheckboxSelection: true,
    //   width: 40,
    // },
    { width: 100, field: 'code', headerName: 'Kod', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 300, field: 'name', headerName: 'Malzeme', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 100, field: 'unitCode', headerName: 'Birim', },
  ];

  constructor(public activeModal: NgbActiveModal, private stockService: StockService) { }

  async ngOnInit() {
    // TODO: API'den çek
    this.rowData = await this.stockService.getList();
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
