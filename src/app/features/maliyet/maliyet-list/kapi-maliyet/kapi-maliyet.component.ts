import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { DimentionService } from '../../../../../libs/core/api/dimention.service';
import { KapiCostService } from '../../../../../libs/core/api/kapi/kapi-cost.service';
import { debounceTime } from 'rxjs';
import { KapiTypeService } from '../../../../../libs/core/api/kapi/kapi-type.service';



@Component({
  selector: 'app-kapi-maliyet',
  standalone: false,
  templateUrl: './kapi-maliyet.component.html',
  styleUrl: './kapi-maliyet.component.scss',
})
export class KapiMaliyetComponent {


  activeTab: 'mekanizma' | 'kasa' | 'panel' = 'mekanizma';

  form: FormGroup;
  types: any[] = [];

  rowData: any[] = [];
  totalCost = 0;
  itemCost = 0;
  laborCost = 0;
  overheadCost = 0;
  loading = false;
  private firstLoadDone = false;
  constructor(
    private fb: FormBuilder,
    private costService: KapiCostService,
    private typeService: KapiTypeService,
    private dimensionService: DimentionService
  ) {
    this.form = this.createForm();


  }

  ngOnInit(): void {
    this.hesapla()



  }

  columnDefs = [
    {
      cellRenderer: (params: any) => {
        const componentName = params.data?.componentName ?? '';
        if (params.data?.isGroup) {
          return `${componentName} <span style=" color: #a90c0c;font-size: 10px;font-weight: 600;"> GROUPED</span>`;
        }
        return componentName;
      }, width: 400, headerName: "Bileşen", field: "componentName"
    },
    { width: 60, headerName: "En", field: "en", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    { width: 60, headerName: "Boy", field: "boy", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    { width: 60, field: 'length', headerName: 'Uzunluk', editable: true, valueParser: (p: any) => Number(p.newValue) || 0, valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    { width: 80, field: 'thickness', headerName: 'Kalınlık', editable: true },
    { width: 60, field: 'quantity', headerName: 'Adet', editable: true, valueParser: (p: any) => Number(p.newValue) || 0, valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    {
      width: 60, field: 'amount', headerName: 'Miktar', editable: true, valueFormatter: (p: any) => {
        if (!p.value || p.value == 0) return '-';
        return Number(p.value).toLocaleString('tr-TR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    },
    { width: 50, headerName: "Birim", field: "unitCode" },
    { width: 60, headerName: "Yoğunluk", field: "density", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    { width: 60, headerName: "Döviz", field: "foreignCost", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
    { width: 60, headerName: "Para Birimi", field: "currencyType", valueFormatter: (p: any) => !p.value || p.value == 'TL' ? '-' : p.value },
    { width: 60, headerName: "B.Fiyat", field: "unitCost", valueFormatter: (p: any) => `${p.value?.toLocaleString()} ₺` },
    {
      headerName: "Toplam",
      field: "total",
      valueFormatter: (p: any) => `${p.value?.toLocaleString()} ₺`,
      cellStyle: (params: any) => {
        if (params.value > 1000) {
          return { color: '#e74c3c', fontWeight: 'bold' };
        }
        return { color: '#2c3e50' };
      }
    }
  ];
  // =========================
  // FORM
  // =========================
  private createForm(): FormGroup {
    return this.fb.group({
      doorCategory: [1],
      kapiTipi: ["en81-20"],
      yon: ["Teleskobik"],
      panelSayisi: ["2 Panel"],
      kaplama: ["Satine Paslanmaz"],
      fotoselVarMi: ["YOK"],
      doorWidth: [900],
      doorHeight: [2000],
      machineCostPerHour: [2000],
    });
  }












  // =========================
  // CALCULATE
  // =========================
  private tryCalculate(): void {
    const f = this.form.value;
    if (!f.doorCategory) return;

    this.calculateCost();
  }

  // =========================
  // API CALL
  // =========================

  mekanizmaCost
  panelCost
  kasaCost
  private async calculateCost(): Promise<void> {

    const payload = this.buildPayload();

    this.loading = true;

    try {
      const res: any = await this.costService.calculate(payload);

      // 🔥 DATA AYIR
      this.mekanizmaData = res.mekanizmaItems || [];
      this.panelData = res.panelItems || [];
      this.kasaData = res.kasaItems || [];
      this.mekanizmaCost = res.mekanizmaCost || 0;
      this.panelCost = res.panelCost || 0;
      this.kasaCost = res.kasaCost || 0;
      // 🔥 TABA GÖRE GÖSTER
      this.changeTab(this.activeTab);

      // 🔥 COST
      this.totalCost = res.totalCost;
      this.laborCost = res.laborCost;
      this.overheadCost = res.overheadCost;
    } catch (error) {
      console.error("Maliyet hesaplama hatası", error);
    } finally {
      this.loading = false;
    }
  }

  // =========================
  // PAYLOAD
  // =========================
  private buildPayload(): any {
    // doorCategory: [1],
    // kapiTipi: ["en81-20"],
    // yon: ["Teleskobik"],
    // panelSayisi: ["2 Panel"],
    // kaplama: ["Satine Paslanmaz"],
    // fotoselVarMi: ["YOK"],
    // doorWidth: [900],
    const f = this.form.value;

    const payload: any = {
      doorCategory: f.doorCategory,
      kapiTipi: f.kapiTipi,
      yon: f.yon,
      panelSayisi: f.panelSayisi,
      kaplama: f.kaplama,
      fotoselVarMi: f.fotoselVarMi,
      doorWidth: f.doorWidth,
      doorHeight: f.doorHeight,
      machineCostPerHour: f.machineCostPerHour,

    };


    return payload;
  }



  changeTab(tab: 'mekanizma' | 'kasa' | 'panel') {
    this.activeTab = tab;

    if (tab === 'mekanizma') {
      this.rowData = this.mekanizmaData || [];
    }
    else if (tab === 'kasa') {
      this.rowData = this.kasaData || [];
    }
    else {
      this.rowData = this.panelData || [];
    }
  }

  mekanizmaData: any;
  kasaData: any;
  panelData: any;
  loadMekanizma() {
    this.rowData = this.mekanizmaData;
  }

  loadKasa() {
    this.rowData = this.kasaData;
  }

  loadPanel() {
    this.rowData = this.panelData;
  }
  hesapla() {
    this.tryCalculate()
  }



  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  gridApi: any;

  expandedMap = new Map<string, boolean>();
  onRowDoubleClick(event: any) {
    const row = event.data;
console.log(row);
    if (!row?.isGroup || !row.items) return;

    let newData = [...this.rowData];

    if (row.expanded) {
      newData = newData.filter(x => x.parent !== row);
      row.expanded = false;
    } else {
      const index = newData.findIndex(x => x === row);

      const children = row.items.map((i: any) => ({
        ...i,
        parent: row,
        isChild: true
      }));

      newData.splice(index + 1, 0, ...children);
      row.expanded = true;
    }

    this.rowData = newData;

    this.gridApi.setGridOption('rowData', this.rowData);

    // 🔥 KRİTİK
    this.gridApi.refreshCells({ force: true });
    this.gridApi.redrawRows();
  }
  getRowId = (params: any) => {
    if (params.data.isChild) {
      return params.data.parent.componentName + '_child_' + params.data.componentName;
    }

    return params.data.componentName;
  };

  rowClassRules = {
    // 🔥 Açılmış group satır
    'group-open': (params: any) =>
      params.data?.isGroup && params.data?.expanded,

    // 🔥 Kapalı group satır
    'group-row': (params: any) =>
      params.data?.isGroup && !params.data?.expanded,

    // 🔥 Child satırlar
    'child-row': (params: any) =>
      params.data?.isChild
  };



  doors: any = [
    { id: 1, value: "floor", name: "Kat Kapısı" },
    { id: 2, value: "cabin", name: "Kabin Kapısı" },


  ];

  doorTypes: any = [
    { id: 1, value: "en81-20", name: "en81-20" },
    { id: 2, value: "Yangın", name: "Yangın" },
    { id: 3, value: "newLine", name: "newLine" },


  ];
  yons: any = [
    { id: 1, value: "Teleskobik", name: "Teleskobik" },
    { id: 2, value: "Merkezi", name: "Merkezi" },


  ];
  panelSayilari: any = [
    { id: 1, value: "2", name: "2 Panel" },
    { id: 2, value: "3", name: "3 Panel" },
    { id: 3, value: "4", name: "4 Panel" },
  ];
  kaplamalar: any = [
    { id: 1, value: "satine paslanmaz", name: "Satine Paslanmaz" },
    { id: 2, value: "ayna paslanmaz", name: "Ayna Paslanmaz" },
    { id: 3, value: "camlı", name: "CAMLI" },
  ];

  fotoselVarMi: any = [
    { id: 1, value: "VAR", name: "VAR" },
    { id: 2, value: "YOK", name: "YOK" },
  ];

}
