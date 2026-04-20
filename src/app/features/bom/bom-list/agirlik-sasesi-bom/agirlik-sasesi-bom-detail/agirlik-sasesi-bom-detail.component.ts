import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabService } from '../../../../../../libs/shared/ui/tabs/tab.service';
import { ModalService } from '../../../../../../libs/core/modal/modal.service';
import { ToolbarHostService } from '../../../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { BomToolbarStateService } from '../../../_state/bom-toolbar.state.service';
import { CabinBomCreateToolbarFactory } from '../../../_factory/kabin/kabin-bom-create-toolbar.factory';
import { StockSelectDialogComponent } from '../../../../../../libs/shared/dialogs/stock-select-dialog/stock-select-dialog.component';
import { BomMaterialSelectDialogComponent } from '../../../../../../libs/shared/dialogs/bom-material-select-dialog/bom-material-select-dialog.component';
import { AgirlikSasesiBomService } from '../../../../../../libs/core/api/agirlik-sasesi/agirlik-sasesi-bom.service';

type TabType = 'materials' | 'rules';
@Component({
  selector: 'app-agirlik-sasesi-bom-detail',
  standalone: false,
  templateUrl: './agirlik-sasesi-bom-detail.component.html',
  styleUrl: './agirlik-sasesi-bom-detail.component.scss',
})
export class AgirlikSasesiBomDetailComponent implements OnInit {
  form!: FormGroup;

  // 🔥 STATE
  activeTab: TabType = 'materials';
  rowData: any[] = [];
  selectedRow: any = null;

  // 🔥 GRID
  gridApi: any;
  ruleColumnDefs = [
    {
      width: 40,
      headerName: '',
      cellRenderer: () => '🗑️',
      onCellClicked: (params: any) => {
        this.removeRule(params.data);
      }
    },
    { field: 'componentName', headerName: 'Bileşen', editable: true },
    { field: 'stockName', headerName: 'Malzeme', editable: true },
    { width: 80, field: 'en', headerName: 'En', editable: true },
    { width: 80, field: 'boy', headerName: 'Boy', editable: true },
    { width: 80, field: 'thickness', headerName: 'Kalınlık', editable: true },
    { width: 60, field: 'quantity', headerName: 'Adet', editable: true, valueParser: (p: any) => Number(p.newValue) || 0 },
    { width: 60, field: 'length', headerName: 'Uzunluk', editable: true, valueParser: (p: any) => Number(p.newValue) || 0 },
    { width: 80, field: 'density', headerName: 'Yoğunluk', editable: true },
    { width: 80, field: 'actionType', headerName: 'İşlem Türü', editable: true },
    { width: 80, field: 'minCapacity', headerName: 'Kapasite (Min)', editable: true },
    { width: 80, field: 'maxCapacity', headerName: 'Kapasite (Max)', editable: true },
    { width: 100, field: 'minDepth', headerName: 'Kabin Derinliği (Min)', editable: true },
    { width: 100, field: 'maxDepth', headerName: 'Kabin Derinliği (Max)', editable: true },
    { width: 100, field: 'makineDairesiVarMi', headerName: 'Makine Dairesi var mı?', editable: true },
    { width: 80, field: 'kasnakKonumu', headerName: 'Kasnak Altta mı?', editable: true },
    { width: 80, field: 'kasnakCap', headerName: 'Kasnak Çapı', editable: true },
    { width: 320, field: 'description', headerName: 'Açıklama', editable: true },
        { width: 320, field: 'formula', headerName: 'Formül', editable: true },
  ];
  columnDefs = [
    { width: 400, field: 'componentName', headerName: 'Adı', editable: true },
    { field: 'stockName', headerName: 'Malzeme', editable: true },
    { width: 120, field: 'en', headerName: 'En', editable: true },
    { width: 120, field: 'boy', headerName: 'Boy', editable: true },
    { width: 75, field: 'thickness', headerName: 'Kalınlık', editable: true },
    { width: 60, field: 'quantity', headerName: 'Adet', editable: true, valueParser: (p: any) => Number(p.newValue) || 0 },
    { width: 60, field: 'length', headerName: 'Uzunluk', editable: true },
    { width: 60, field: 'amount', headerName: 'Miktar', editable: true, valueParser: (p: any) => Number(p.newValue) || 0 },
    { width: 50, field: 'unitCode', headerName: 'Birim', },
    { width: 75, field: 'density', headerName: 'Yoğunluk', editable: true },
    { width: 320, field: 'formula', headerName: 'Formül', editable: true },
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
    private agirlikSasesiBomService: AgirlikSasesiBomService,
    private modalService: ModalService,
    public host: ToolbarHostService,
    public _bomToolbarStateService: BomToolbarStateService
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.initToolbar();
    this.loadFromRoute();
  }
  private buildForm() {
    this.form = this.fb.group({
      agirlikSasesiTypeId: [null]
    });
  }
  selectedItem: any
  private initToolbar() {
    const ctx = this._bomToolbarStateService.ctx;
    const active = this.tabService.activeTab();
    this.selectedItem = active.context.data;

    ctx.headerActions = {
      new: () => this.openStockModal(),
      delete: () => this.deleteSelected()
    };

    this.host.setHeaderToolbar(
      CabinBomCreateToolbarFactory.grid(ctx)
    );
  }

  private loadFromRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const agirlikSasesiTypeId = +id;

    setTimeout(() => {
      this.form.patchValue({ agirlikSasesiTypeId: agirlikSasesiTypeId });
    });

    this.loadBom(agirlikSasesiTypeId);
  }

  async loadBom(id: number) {

    const res: any = await this.agirlikSasesiBomService.getByModel(id);
    this.rowData = (res.items || []).map((x: any) => ({
      id: x.id,
      componentName: x.componentName,
      stockId: x.stockId,
      stockName: x.stockName,
      quantity: x.quantity,
      unitCode: x.unitCode,
      formula: x.formula,
      density: x.density,
      thickness: x.thickness,
      en: x.en,
      boy: x.boy,
      length: x.length,
      description: x.description,
      kasnak: x.kasnakCap
    }));

    // 🔥 KRİTİK
    this.capacityRules = res.rules || [];

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

  openStockModal() {
    const ref = this.modalService.open(StockSelectDialogComponent, {
      size: 'lg'
    });

    ref.result.then((items: any[]) => {
      if (!items?.length) return;
      this.addRows(items);
    });
  }

  addRows(items: any[]) {

    const existing = this.rowData.map(x => x.componentName);

    const newRows = items
      .filter(x => !existing.includes(x.componentName))
      .map(x => ({
        componentName: x.name,
        stockId: x.id,
        stockName: x.name,
        quantity: 1,
        unitCode: x.unitCode,
        formula: x.formula,
        density: x.density,
        thickness: x.thickness,
        en: x.en,
        boy: x.boy,
        length: x.length,
        description: x.description,
        kasnak: x.kasnakCap
      }));

    this.rowData = [...this.rowData, ...newRows];
  }

  deleteSelected() {
    if (!this.selectedRow) return;
    this.removeRow(this.selectedRow);
  }








  /////////////////////////ADD RULE////////////////////////////

  capacityRules: any[] = [];

  addRule() {

    const ref = this.modalService.open(BomMaterialSelectDialogComponent, {
      size: 'lg'
    }, {
      items: this.rowData
    });

    ref.result.then((selected: any[]) => {

      if (!selected || !selected.length) return;


      selected.forEach(element => {

        const newRule: any = {
          componentName: element.componentName,
          stockName: element.name,
          stockId: element.id,

          // 🔥 KOŞULLAR
          minCapacity: null,
          maxCapacity: null,
          minDepth: null,
          maxDepth: null,
          AgirlikDairesiVarMi: null,
          kasnakKonumu: null,

          // 🔥 AKSİYON
          actionType: "Ekle",
          quantity: 1,
          length: null,
          // 🔥 YENİ
          stockType: null,
          thickness: null,
          density: null,
          en: null,
          boy: null,

          priority: 1,
          description: null,
          kasnak: null
        };

        // 🔥 SADECE BURASI
        this.capacityRules = [
          ...this.capacityRules,
          newRule
        ];
      });

      // 🔥 EN KRİTİK SATIR

    }).catch(() => { });
  }
  removeRule(rule: any) {
    this.capacityRules = this.capacityRules.filter(r => r !== rule);
  }







  async Kaydet() {

    if (!this.form.value.agirlikSasesiTypeId) {
      alert('Kabin model seç');
      return;
    }

    if (!this.rowData.length) {
      alert('Malzeme eklemeden kaydedemezsin');
      return;
    }

    ;

    const payload = {
      agirlikSasesiTypeId: this.form.value.agirlikSasesiTypeId,
      items: this.rowData.map(x => ({
        componentName: x.componentName,
        stockId: x.stockId,
        quantityType: 1,
        quantity: x.quantity,
        formula: x.formula,
        density: x.density,
        thickness: x.thickness,
        en: x.en,
        boy: x.boy,
        length: x.length,
        kasnak: x.kasnakCap
      })),
      // 🔥 KRİTİK NOKTA
      rules: this.capacityRules.map(r => ({
        componentName: r.componentName,

        // 🔥 KOŞULLAR
        minCapacity: r.minCapacity == '' ? null : r.minCapacity,
        maxCapacity: r.maxCapacity == '' ? null : r.maxCapacity,
        minDepth: r.minDepth == '' ? null : r.minDepth,
        maxDepth: r.maxDepth == '' ? null : r.maxDepth,
        AgirlikDairesiVarMi: r.AgirlikDairesiVarMi,
        kasnakKonumu: r.kasnakKonumu,

        // 🔥 AKSİYON
        actionType: r.actionType,
        stockId: r.stockId,
        quantity: r.quantity,

        // 🔥 YENİ EKLENENLER
        stockType: r.stockType,
        thickness: r.thickness,
        density: r.density,
        en: r.en,
        boy: r.boy,
        length: r.length,
        // 🔥 GENEL
        priority: r.priority,
        formula: r.formula,
        description: r.description,
        kasnak: r.kasnakCap

      }))
    };

    try {
       await this.agirlikSasesiBomService.update(payload);
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
