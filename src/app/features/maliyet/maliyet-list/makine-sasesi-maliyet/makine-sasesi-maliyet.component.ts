import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { DimentionService } from '../../../../../libs/core/api/dimention.service';
import { MakineSasesiCostService } from '../../../../../libs/core/api/makine-sasesi/makine-sasesi-cost.service';
import { MakineSasesiTypeService } from '../../../../../libs/core/api/makine-sasesi/makine-sasesi-type.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-makine-sasesi-maliyet',
  standalone: false,
  templateUrl: './makine-sasesi-maliyet.component.html',
  styleUrl: './makine-sasesi-maliyet.component.scss',
})
export class MakineSasesiMaliyetComponent implements OnInit {





  form: FormGroup;
  types: any[] = [];

  rowData: any[] = [];
  totalCost = 0;
  itemCost = 0;
  laborCost = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private costService: MakineSasesiCostService,
    private typeService: MakineSasesiTypeService
  ) {
    this.form = this.createForm();
      this.loadTypes();

  }

  ngOnInit(): void {

  

    this.form.get('makineSasesiTypeId')?.valueChanges.subscribe(id => {

      const selected = this.types.find(x => x.id == id);

      if (!selected) return;

      this.form.patchValue({
        typeCode: selected.code
      }, { emitEvent: false }); // 🔥 loop engelle

      this.applyTypeConfig(selected.code);
    });



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
      makineSasesiTypeId: [null],
      typeCode: [null]
    });
  }

  // =========================
  // TYPE CONFIG (CODE BASED)
  // =========================
  TYPE_CONFIG: Record<string, string[]> = {
    RAYA_BAGLI: ['rayArasi'],
    DUVARDAN_SASE: ['kuyuDerinligi', 'capacity'],
    AGIRLIK_ARKADA_DUVARDAN_SASE: ['kuyuGenisligi', 'capacity']
  };

  // =========================
  // LOAD TYPES (DB)
  // =========================
  isInitialized = false;
  async loadTypes() {
    try {
      const res = await this.typeService.getAll();
      this.types = res;

      if (this.types.length) {
        const first = this.types[0];

        this.form.patchValue({
          makineSasesiTypeId: first.id,
          typeCode: first.code
        }, { emitEvent: false });

        this.applyTypeConfig(first.code);

        this.isInitialized = true; // 🔥 kritik

        this.tryCalculate(); // 🔥 ilk hesap
      }

    } catch (err) {
      console.error(err);
    }
  }
  // =========================
  // TYPE CHANGE (UI)
  // =========================
  onTypeChange(e: any) {

    const id = e?.value ?? e;

    const selected = this.types.find(x => x.id == id);

    if (!selected) return;

    this.form.patchValue({
      makineSasesiTypeId: selected.id,
      typeCode: selected.code
    });


    this.applyTypeConfig(selected.code);
  }

  // =========================
  // APPLY CONFIG
  // =========================
  private applyTypeConfig(typeCode: string) {

    this.removeOptionalControls();

    const fields = this.TYPE_CONFIG[typeCode];

    if (!fields) return;

    fields.forEach(f => {

      let defaultValue = null;

      // 🔥 DEFAULTLAR BURADA
      if (f === 'capacity') defaultValue = 800;
      if (f === 'rayArasi') defaultValue = 1100;
      if (f === 'kuyuDerinligi') defaultValue = 1100;
      if (f === 'kuyuGenisligi') defaultValue = 1100;

      this.form.addControl(f, this.fb.control(null));
      this.form.get(f)?.setValue(defaultValue, { emitEvent: false });
    });
  }

  // =========================
  // REMOVE OPTIONAL
  // =========================
  private removeOptionalControls() {
    
    ['kuyuDerinligi', 'kuyuGenisligi', 'rayArasi', 'capacity']
      .forEach(c => this.form.contains(c) && this.form.removeControl(c));
  }

  // =========================
  // CALCULATE
  // =========================
  private tryCalculate(): void {
    const f = this.form.value;

    if (!f.makineSasesiTypeId) return;

    this.calculateCost();
  }

  // =========================
  // API CALL
  // =========================
  private async calculateCost(): Promise<void> {

    const payload = this.buildPayload();
    this.loading = true;
    const start = Date.now();

    try {
      const res: any = await this.costService.calculate(payload);
      const elapsed = Date.now() - start;
      const remaining = 500 - elapsed;

      // ⏱️ minimum 1sn bekle
      if (remaining > 0) {
        await new Promise(res => setTimeout(res, remaining));
      }
      this.rowData = res.items;

      this.totalCost = res.totalCost;
      this.itemCost = res.itemCost;
      this.laborCost = res.laborCost;

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

    const f = this.form.value;

    const payload: any = {
      makineSasesiTypeId: f.makineSasesiTypeId
    };

    if (f.capacity)
      payload.capacity = f.capacity;

    if (f.rayArasi)
      payload.rayArasi = f.rayArasi;

    if (f.kuyuDerinligi)
      payload.kuyuDerinligi = f.kuyuDerinligi;

    if (f.kuyuGenisligi)
      payload.kuyuGenisligi = f.kuyuGenisligi;

    return payload;
  }






    hesapla(){
    this.tryCalculate()
  }





  
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  gridApi: any;

  expandedMap = new Map<string, boolean>();
  onRowDoubleClick(event: any) {
    const row = event.data;

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

}
