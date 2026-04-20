import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { ModalService } from '../../../../../libs/core/modal/modal.service';
import { ToolbarHostService } from '../../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { PersonelSelectDialogComponent } from '../../../../../libs/shared/dialogs/personel-select-dialog/personel-select-dialog.component';
import { StockGroupToolbarStateService } from '../../_state/stock-group-toolbar.state.service';
import { StockGroupDetailCreateToolbarFactory } from '../../_factory/stock-group-detail-create-toolbar.factory';
import { StockGroupService } from '../../../../../libs/core/api/stock-group.service';
import { StockSelectDialogComponent } from '../../../../../libs/shared/dialogs/stock-select-dialog/stock-select-dialog.component';
type TabType = 'materials' | 'rules';
@Component({
  selector: 'app-stock-group-detail',
  standalone: false,
  templateUrl: './stock-group-detail.component.html',
  styleUrl: './stock-group-detail.component.scss',
})
export class StockGroupDetailComponent implements OnInit {
  form!: FormGroup;

  // 🔥 STATE
  activeTab: TabType = 'materials';
  rowData: any[] = [];
  selectedRow: any = null;

  // 🔥 GRID
  gridApi: any;

  columnDefs = [
    { width: 100, field: 'code', headerName: 'Kod', },
    { width: 220, field: 'name', headerName: 'Stok Adı', },
    { width: 50, field: 'unitCode', headerName: 'Birim', },
    { width: 70, field: 'currencyType', headerName: 'Para Birimi', },
    {
      headerName: '',
      width: 60,
      cellRenderer: () => '🗑️',
      onCellClicked: (params: any) => {
        this.removeRow(params.data);
      }
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tabService: TabService,
    private modalService: ModalService,
    public host: ToolbarHostService,
    private stockGroupService: StockGroupService,
    public _StockGroupToolbarStateService: StockGroupToolbarStateService
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.initToolbar();
    this.loadFromRoute();


  }



  private buildForm() {
    this.form = this.fb.group({
      groupId: [null],
      name: [null],
      unitCost: [0],
    });
  }
  selectedItem: any
  private initToolbar() {
    const ctx = this._StockGroupToolbarStateService.ctx;
    const active = this.tabService.activeTab();
    this.selectedItem = active.context.data;
    ctx.headerActions = {
      new: () => this.openPersonelModal(),
      delete: () => this.deleteSelected()
    };

    this.host.setHeaderToolbar(
      StockGroupDetailCreateToolbarFactory.grid(ctx)
    );
  }

  private loadFromRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const groupId = +id;
    setTimeout(() => {
      this.form.patchValue(
        {
          groupId: groupId,
          name: this.selectedItem.name,
          unitCost: this.selectedItem.unitCost,
        }
      );
    });

    this.loadStockGroup(groupId);
  }

  async loadStockGroup(id: number) {

    const res: any = await this.stockGroupService.getByStockGroupDetail(id);

    this.rowData = (res.stocks || []);


    if (this.rowData.length) {
      this.selectedRow = this.rowData[0];
    }
  }

  getList(params: any) {
    this.gridApi = params.api;
  }

  onRowClicked(event: any) {
    this.selectedRow = event.data;
  }

  removeRow(row: any) {
    this.rowData = this.rowData.filter(x => x !== row);
  }

  openPersonelModal() {
    const ref = this.modalService.open(StockSelectDialogComponent, {
      size: 'lg'
    });

    ref.result.then((items: any[]) => {
      if (!items?.length) return;
      this.addRows(items);
    });
  }

  addRows(items: any[]) {
    const newRows = items
      .map(x => ({
        id: x.id,
        code: x.code,
        name: x.name,
        unitCode: x.unitCode,
        currencyType: x.currencyType,
      }));
    this.rowData = [...this.rowData, ...newRows];
  }



  deleteSelected() {
    if (!this.selectedRow) return;
    this.removeRow(this.selectedRow);
  }






  onRowDoubleClick(event: any) {
    const row = event.data;
    if (!row) return;


    const href = `/features/stock/detay/${row.id}`;
    this.tabService.openTab({
      id: href,
      title: `Stok #${row.seriNo ?? row.id}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,

      }
    });






  }








  async Kaydet() {

    if (!this.form.value.groupId) {
      alert('Stock Group seç');
      return;
    }

    if (!this.rowData.length) {
      alert('Malzeme eklemeden kaydedemezsin');
      return;
    }

    const payload = {
      groupId: this.form.value.groupId,
      name: this.form.value.name,       // 🔥 düzelt
      unitCost: this.form.value.unitCost, // 🔥 EKLE
      stockIds: this.rowData.map(x => x.id)
    };

    try {

      await this.stockGroupService.update(payload);
      this.tabService.updateActiveTabContext({
        data: payload
      });

    } catch (err) {
      console.error(err);
      alert('Hata oluştu');
    }
  }

  Kapat() {
    this.tabService.closeActiveTab();
  }

}
