import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../../libs/shared/ui/tabs/tab.service';
import { BomToolbarStateService } from '../../../_state/bom-toolbar.state.service';
import { ToolbarHostService } from '../../../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { CabinBomCreateToolbarFactory } from '../../../_factory/kabin/kabin-bom-create-toolbar.factory';
import { StockSelectDialogComponent } from '../../../../../../libs/shared/dialogs/stock-select-dialog/stock-select-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../../../libs/core/modal/modal.service';
import { ActivatedRoute } from '@angular/router';
import { SuspansiyonBomService } from '../../../../../../libs/core/api/suspansiyon/suspansiyon-bom.service';

@Component({
  selector: 'app-suspansiyon-bom-create',
  standalone: false,
  templateUrl: './suspansiyon-bom-create.component.html',
  styleUrl: './suspansiyon-bom-create.component.scss',
})
export class SuspansiyonBomCreateComponent implements OnInit {

  form: FormGroup;
  capasities: any = [
    { id: 1, name: "400 KG" },
    { id: 2, name: "630 KG" },
    { id: 3, name: "800 KG" },
    { id: 4, name: "1000 KG" },
  ];
  constructor(
    private fb: FormBuilder,
    private tabService: TabService,
    private suspansiyonBomService: SuspansiyonBomService,
    public host: ToolbarHostService, public _bomToolbarStateService: BomToolbarStateService, private modalService: ModalService, private route: ActivatedRoute
  ) {

    this.form = this.fb.group({
      suspansiyonTypeId: [null],
      kapasite: [null],
    });

    this.form.get('suspansiyonTypeId')?.valueChanges.subscribe(val => {
      if (val) {
        this.onKabinModelSelected(val);
      }
    });
  }
  ngOnInit(): void {

    const ctx = this._bomToolbarStateService.ctx;
    ctx.headerActions = {
      new: () => this.openStockModal(),
      edit: () => this.update(),
      delete: () => this.deleteSelected(),
    };
    this.host.setHeaderToolbar(CabinBomCreateToolbarFactory.grid(this._bomToolbarStateService.ctx));





  }

  onKabinModelSelected(id: number) {
  }








  Kaydet() {

    if (!this.form.value.suspansiyonTypeId) {
      alert('Kabin model seç');
      return;
    }

    if (this.rowData.length === 0) {
      alert('Malzeme eklemeden kaydedemezsin');
      return;
    }

    const payload = {
      suspansiyonTypeId: this.form.value.suspansiyonTypeId,

      items: this.rowData.map(x => ({
        componentName: x.componentName || '',
        stockId: x.stockId,
        quantityType: 1, // enum → Fixed
        fixedQuantity: x.quantity, // 👈 EN KRİTİK
        quantity: x.quantity,
        formula: x.formula,
        density:x.density,
        thickness:x.thickness
      }))
    };

    this.suspansiyonBomService.create(payload, () => {
      this.tabService.closeActiveTab();
    });
  }
  Kapat() {
    this.tabService.closeActiveTab()
  }
  add() { }
  update() { }
  deleteSelected() { }




  columnDefs = [
    { field: 'componentName', headerName: 'Adı', editable: true },
    { field: 'stockName', headerName: 'Malzeme Adı' },
    { width: 80, field: 'quantity', headerName: 'Miktar', editable: true },
    { width: 80, field: 'unitCode', headerName: 'Birim' },
    { width: 100, field: 'thickness', headerName: 'Kalınlık', editable: true },
    { width: 100, field: 'density', headerName: 'Yoğunluk', editable: true },
    { width: 100, field: 'formula', headerName: 'Ölçü Bağımlılığı', editable: true },
  ];
  rowData: any[] = [];
  gridApi: any;
  getList(params: any) {
    this.gridApi = params.api;
  }




  openStockModal() {
    const ref = this.modalService.open(StockSelectDialogComponent, {
      size: 'xl'
    });

    ref.result.then((items: any[]) => {
      if (!items || items.length === 0) return;

      this.addRowsToGrid(items);
    });
  }
  addRowsToGrid(items: any[]) {

    const existingIds = this.rowData.map(x => x.stockId);

    const newRows = items
      .filter(x => !existingIds.includes(x.id))
      .map(x => ({
        componentName: "",
        stockId: x.id,
        stockName: x.name,
        quantity: 1,
        unitCode: x.unitCode,
        formula: x.formula,
        density: x.density,
        thickness: x.thickness,

      }));

    this.rowData = [...this.rowData, ...newRows]; // 👈 SADECE BU
  }
}

