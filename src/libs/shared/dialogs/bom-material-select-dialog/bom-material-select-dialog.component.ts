import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridApi } from 'ag-grid-community';
import { StockService } from '../../../core/api/stock.service';

@Component({
  selector: 'app-bom-material-select-dialog',
  standalone: false,
  templateUrl: './bom-material-select-dialog.component.html',
  styleUrl: './bom-material-select-dialog.component.scss',
})
export class BomMaterialSelectDialogComponent {
  @Input() items: any[] = [];









  gridApi!: GridApi;
  rowData: any[] = [];
  selectedRows: any[] = [];

  quickFilter = '';

  columnDefs: ColDef[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 40,
    },
    { width: 100, field: 'code', headerName: 'Kod', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 300, field: 'name', headerName: 'Malzeme', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 100, field: 'unitCode', headerName: 'Birim', },
  ];

  constructor(public activeModal: NgbActiveModal,private stockService:StockService) { }

  async ngOnInit() {
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
