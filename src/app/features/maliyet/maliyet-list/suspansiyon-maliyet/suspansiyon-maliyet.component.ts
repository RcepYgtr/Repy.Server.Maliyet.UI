import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { DimentionService } from '../../../../../libs/core/api/dimention.service';
import { SuspansiyonCostService } from '../../../../../libs/core/api/suspansiyon/suspansiyon-cost.service';
import { SuspansiyonTypeService } from '../../../../../libs/core/api/suspansiyon/suspansiyon-type.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-suspansiyon-maliyet',
  standalone: false,
  templateUrl: './suspansiyon-maliyet.component.html',
  styleUrl: './suspansiyon-maliyet.component.scss',
})
export class SuspansiyonMaliyetComponent {

  // form: FormGroup;
  // dimensions: any[] = [];
  // rowData: any[] = [];
  // totalCost = 0;
  // itemCost = 0;
  // laborCost = 0;
  // loading = false;

  // constructor(
  //   private fb: FormBuilder,
  //   private tabService: TabService,
  //   private suspansiyonCostService: SuspansiyonCostService,
  //   private dimensionService: DimentionService
  // ) {
  //   this.form = this.createForm();
  // }

  // ngOnInit(): void {
  //   this.listenFormChanges();
  //   this.loadDimensions();
  // }
  // columnDefs = [
  //   { width: 400, headerName: "Bileşen", field: "componentName" },
  //   { width: 60, headerName: "En", field: "en", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   { width: 60, headerName: "Boy", field: "boy", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   { width: 60, field: 'length', headerName: 'Uzunluk', editable: true, valueParser: (p: any) => Number(p.newValue) || 0, valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   { width: 80, field: 'thickness', headerName: 'Kalınlık', editable: true },
  //   { width: 60, field: 'quantity', headerName: 'Adet', editable: true, valueParser: (p: any) => Number(p.newValue) || 0, valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   {
  //     width: 60, field: 'amount', headerName: 'Miktar', editable: true, valueFormatter: (p: any) => {
  //       if (!p.value || p.value == 0) return '-';
  //       return Number(p.value).toLocaleString('tr-TR', {
  //         minimumFractionDigits: 2,
  //         maximumFractionDigits: 2
  //       });
  //     }
  //   },
  //   { width: 50, headerName: "Birim", field: "unitCode" },
  //   { width: 60, headerName: "Yoğunluk", field: "density", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   { width: 60, headerName: "Döviz", field: "foreignCost", valueFormatter: (p: any) => !p.value || p.value == 0 ? '-' : p.value },
  //   { width: 60, headerName: "Para Birimi", field: "currencyType", valueFormatter: (p: any) => !p.value || p.value == 'TL' ? '-' : p.value },
  //   { width: 60, headerName: "B.Fiyat", field: "unitCost", valueFormatter: (p: any) => `${p.value?.toLocaleString()} ₺` },
  //   {
  //     headerName: "Toplam",
  //     field: "total",
  //     valueFormatter: (p: any) => `${p.value?.toLocaleString()} ₺`,
  //     cellStyle: (params: any) => {
  //       if (params.value > 1000) {
  //         return { color: '#e74c3c', fontWeight: 'bold' };
  //       }
  //       return { color: '#2c3e50' };
  //     }
  //   }
  // ];
  // // =========================
  // // FORM
  // // =========================
  // private createForm(): FormGroup {
  //   return this.fb.group({
  //     suspansiyonTypeId: [1],
  //     kapasite: [800],
  //     dimension: [null],
  //     rayArasi: [1100]
  //   });
  // }

  // // =========================
  // // FORM EVENTS
  // // =========================

  // private listenFormChanges(): void {
  //   this.form.get('suspansiyonTypeId')?.valueChanges.subscribe(type => {
  //     this.handleTypeChange(type);
  //   });
  //   this.form.get('kapasite')?.valueChanges.subscribe(() => {
  //     this.loadDimensions();
  //   });
  //   this.form.valueChanges.subscribe(() => {
  //     this.tryCalculate();
  //   });
  // }

  // // =========================
  // // TYPE CHANGE
  // // =========================
  // private handleTypeChange(typeId: number): void {

  //   this.removeOptionalControls();

  //   if (typeId === 2) { // P PLAKALI
  //     this.form.addControl('kasnakCap', this.fb.control("240"));
  //     this.form.addControl('kasnakKonumu', this.fb.control("Altta"));
  //     this.form.addControl('makineDairesiVarMi', this.fb.control("YOK"));
  //   }
  //   if (typeId === 3) { // ÇAPRAZ
  //     this.form.addControl('kasnakCap', this.fb.control("240"));
  //     this.form.addControl('kasnakKonumu', this.fb.control("Altta"));
  //     this.form.addControl('makineDairesiVarMi', this.fb.control("YOK"));
  //   }
  // }

  // private removeOptionalControls(): void {
  //   ['kasnakCap', 'kasnakKonumu', 'makineDairesiVarMi']
  //     .forEach(c => this.form.contains(c) && this.form.removeControl(c));
  // }

  // // =========================
  // // DIMENSIONS
  // // =========================
  // async loadDimensions(): Promise<void> {
  //   const kapasite = Number(this.form.value.kapasite);

  //   if (!kapasite) {
  //     this.dimensions = [];
  //     return;
  //   }

  //   try {
  //     const res = await this.dimensionService.getDimensions(kapasite);
  //     this.dimensions = res;

  //     if (this.dimensions.length) {
  //       this.form.patchValue({ dimension: this.dimensions[0] });
  //     }

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // // =========================
  // // CALCULATE TRIGGER
  // // =========================
  // private tryCalculate(): void {

  //   const f = this.form.value;
  //   if (!f.suspansiyonTypeId || !f.kapasite || !f.dimension) return;

  //   if (f.suspansiyonTypeId === 2 || f.suspansiyonTypeId === 3) {

  //     if (!f.kasnakCap) return;
  //     if (!f.kasnakKonumu) return;


  //   }

  //   this.calculateCost();
  // }

  // // =========================
  // // API CALL
  // // =========================
  // private async calculateCost(): Promise<void> {

  //   const payload = this.buildPayload();
  //   this.loading = true;
  //   const start = Date.now();

  //   try {
  //     const res: any = await this.suspansiyonCostService.calculate(payload);
  //     const elapsed = Date.now() - start;
  //     const remaining = 1000 - elapsed;

  //     // ⏱️ minimum 1sn bekle
  //     if (remaining > 0) {
  //       await new Promise(res => setTimeout(res, remaining));
  //     }
  //     this.rowData = res.items;

  //     this.totalCost = res.totalCost;
  //     this.itemCost = res.itemCost;
  //     this.laborCost = res.laborCost;

  //   } catch (error) {
  //     console.error("Maliyet hesaplama hatası", error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // // =========================
  // // PAYLOAD BUILDER
  // // =========================
  // private buildPayload(): any {

  //   const { suspansiyonTypeId, kapasite, dimension, rayArasi } = this.form.value;

  //   const payload: any = {
  //     suspansiyonTypeId,
  //     capacity: kapasite,
  //     width: dimension.width,
  //     depth: dimension.depth,
  //     height: dimension.height,
  //     rayArasi
  //   };

  //   if (suspansiyonTypeId === 2) {
  //     payload.kasnakCap = this.form.get('kasnakCap')?.value;
  //     payload.kasnakKonumuu = this.form.get('kasnakKonumu')?.value;
  //     payload.makineDairesiVarMiVarMi = this.form.get('makineDairesiVarMi')?.value;
  //     if (payload.makineDairesiVarMiVarMi == null) {
  //       payload.makineDairesiVarMiVarMi = "YOK"
  //     }
  //   }
  //   if (suspansiyonTypeId === 3) {
  //     payload.kasnakCap = this.form.get('kasnakCap')?.value;
  //     payload.kasnakKonumuu = this.form.get('kasnakKonumu')?.value;
  //     payload.makineDairesiVarMiVarMi = this.form.get('makineDairesiVarMi')?.value;
  //     if (payload.makineDairesiVarMiVarMi == null) {
  //       payload.makineDairesiVarMiVarMi = "YOK"
  //     }

  //   }

  //   return payload;
  // }













  // kasnakCaps: any = [
  //   { id: 1, value: "240", name: "240x4x6.5" },
  //   { id: 2, value: "240", name: "240x5x6.5" },
  //   { id: 3, value: "240", name: "240x6x6.5" },
  //   { id: 4, value: "240", name: "240x7x6.5" },
  //   { id: 5, value: "240", name: "240x8x6.5" },
  //   { id: 6, value: "240", name: "240x8x6.5" },
  //   { id: 7, value: "240", name: "240x10x6.5" },
  //   { id: 8, value: "320", name: "320x4x8" },
  //   { id: 9, value: "320", name: "320x5x8" },
  //   { id: 10, value: "320", name: "320x6x8" },
  //   { id: 11, value: "320", name: "320x7x8" },
  //   { id: 12, value: "320", name: "320x8x8" },
  //   { id: 13, value: "320", name: "320x9x8" },
  //   { id: 14, value: "320", name: "320x10x8" },

  // ];

  // kasnakKonumus: any = [
  //   { id: 1, value: "Altta", name: "Altta" },
  //   { id: 2, value: "Üstte", name: "Üstte" },
  // ];
  // makineDairesiVarMi: any = [
  //   { id: 1, value: "VAR", name: "VAR" },
  //   { id: 2, value: "YOK", name: "YOK" },
  // ];



















  form: FormGroup;
  types: any[] = [];

  rowData: any[] = [];
  totalCost = 0;
  itemCost = 0;
  laborCost = 0;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private costService: SuspansiyonCostService,
    private typeService: SuspansiyonTypeService
  ) {
    this.form = this.createForm();
     this.loadTypes();
  }

  ngOnInit(): void {

   


    this.form.get('suspansiyonTypeId')?.valueChanges.subscribe(id => {

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
      suspansiyonTypeId: [null],
      typeCode: [null],
      rayArasi: [1100],
      capacity: [800],
    });
  }

  // =========================
  // TYPE CONFIG (CODE BASED)
  // =========================
  TYPE_CONFIG: Record<string, string[]> = {
    DIREK_ASKI: [],
    P_PLAKALI: ['kasnakCap', 'kasnakKonumu', 'makineDairesiVarMi'],
    CAPRAZ: ['kasnakCap', 'kasnakKonumu', 'makineDairesiVarMi'],
    RAY_EKSENINDE: ['kasnakCap', 'kasnakKonumu', 'makineDairesiVarMi']
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
          suspansiyonTypeId: first.id,
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
      suspansiyonTypeId: selected.id,
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
      if (f === 'kasnakCap') defaultValue = '240';
      if (f === 'kasnakKonumu') defaultValue = 'Altta';
      if (f === 'makineDairesiVarMi') defaultValue = 'YOK';


      this.form.addControl(f, this.fb.control(null));
      this.form.get(f)?.setValue(defaultValue, { emitEvent: false });
    });
  }

  // =========================
  // REMOVE OPTIONAL
  // =========================
  private removeOptionalControls() {

    ['kasnakCap', 'kasnakKonumu', 'makineDairesiVarMi']
      .forEach(c => this.form.contains(c) && this.form.removeControl(c));
  }

  // =========================
  // CALCULATE
  // =========================
  private tryCalculate(): void {
    const f = this.form.value;

    if (!f.suspansiyonTypeId) return;

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
      console.log(res);
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
      suspansiyonTypeId: f.suspansiyonTypeId,
      capacity: f.capacity,
      rayArasi: f.rayArasi,
    };

    if (f.makineDairesiVarMi)
      payload.makineDairesiVarMi = f.makineDairesiVarMi;

    if (f.kasnakKonumu)
      payload.kasnakKonumu = f.kasnakKonumu;

    if (f.kasnakCap)
      payload.kasnakCap = f.kasnakCap;

    if (f.kuyuGenisligi)
      payload.kuyuGenisligi = f.kuyuGenisligi;

    return payload;
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



  kasnakCaps: any = [
    { id: 1, value: "240", name: "240x4x6.5" },
    { id: 2, value: "240", name: "240x5x6.5" },
    { id: 3, value: "240", name: "240x6x6.5" },
    { id: 4, value: "240", name: "240x7x6.5" },
    { id: 5, value: "240", name: "240x8x6.5" },
    { id: 6, value: "240", name: "240x8x6.5" },
    { id: 7, value: "240", name: "240x10x6.5" },
    { id: 8, value: "320", name: "320x4x8" },
    { id: 9, value: "320", name: "320x5x8" },
    { id: 10, value: "320", name: "320x6x8" },
    { id: 11, value: "320", name: "320x7x8" },
    { id: 12, value: "320", name: "320x8x8" },
    { id: 13, value: "320", name: "320x9x8" },
    { id: 14, value: "320", name: "320x10x8" },
    { id: 15, value: "400", name: "400x4x8" },
    { id: 16, value: "400", name: "400x5x8" },
    { id: 17, value: "400", name: "400x6x8" },
    { id: 18, value: "400", name: "400x7x8" },
    { id: 19, value: "400", name: "400x8x8" },
    { id: 20, value: "400", name: "400x9x8" },
    { id: 21, value: "400", name: "400x10x8" },

  ];

  kasnakKonumus: any = [
    { id: 1, value: "Altta", name: "Altta" },
    { id: 2, value: "Üstte", name: "Üstte" },
  ];
  makineDairesiVarMi: any = [
    { id: 1, value: "VAR", name: "VAR" },
    { id: 2, value: "YOK", name: "YOK" },
  ];










}
