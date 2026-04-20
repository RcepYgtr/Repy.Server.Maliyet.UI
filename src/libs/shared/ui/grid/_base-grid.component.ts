import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GridCommands } from "./grid.command";
import { GridState } from "./grid.state";
import { GridEngine } from "./grid.engine";
import { GridApi, GridReadyEvent, ColDef, RowClassRules, GridOptions, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { GridSelectionFacade } from "./grid-selection.facade";
import { TabService } from "../tabs/tab.service";
import { GridConfig } from "../../utils/grid-config";
@Component({
  selector: 'base-grid',
  standalone: false,
  template: `

  <div class="erp-table-wrapper">

<ag-grid-angular
  class="ag-theme-quartz"
   style="width:100%; height:100%"
  [rowHeight]="rowHeight"
  [headerHeight]="headerHeight"
  [rowData]="state.rows()"
  [columnDefs]="columnDefs"
  [gridOptions]="gridOptions"
  (gridReady)="onGridReady($event)"
  (gridPreDestroy)="onGridDestroy()"
  (rowClicked)="onRowClick($event)"
    (rowDoubleClicked)="onRowDoubleClick($event)">
</ag-grid-angular>

  <!-- 🔥 SADECE TABLOYU KAPLAR -->
  <div class="erp-table-loader" *ngIf="state.loading()">
    <div class="erp-spinner"></div>
    <div class="erp-loader-text">Yükleniyor...</div>
  </div>

    <!-- 🔥 EMPTY STATE -->
  <div class="erp-empty-state" *ngIf="!state.loading() && state.rows().length === 0">
   Kayıt bulunamadı
  </div>

</div>
`,
  styles: [`@use "loader";@use "ag-grid-table";
    
    .erp-table-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.erp-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #777;
  background: #fff;
  z-index: 2;
  pointer-events: none;
}

    
    `]
})
export class BaseGridComponent<T extends { id: any }> {

  @Input({ required: true }) gridKey!: string;
  @Input() columnDefs!: ColDef[];
  @Input() loadFn!: (filters?: any) => Promise<T[]>;
  @Input() engine!: GridEngine<T>;
  @Input() createDefaultRow?: () => T;
  @Input() rowHeight: number = 22;
  @Input() headerHeight: number = 27;
  state = new GridState<T>();
  commands!: GridCommands<T>;

  constructor(private tabService: TabService, private selectionFacade: GridSelectionFacade) {
    // const cache = this.tabService.getGridState<any>(this.gridKey);

    // if (cache?.rows?.length) {
    //   this.state.rows.set(cache.rows);
    //   this.state.selectedRowId.set(cache.selectedRowId ?? null);
    // }
  }



  gridOptions: GridOptions = {
    getRowId: params => params.data.id.toString(), // 🔥 KRİTİK
    rowSelection: {
      mode: 'singleRow',
      enableClickSelection: true,
      checkboxes: false
    },
    context: {
      gridState: this.state
    },

    defaultColDef: {
      sortable: false,
      filter: false,
      resizable: true,
    },
    suppressNoRowsOverlay: true,

  };

  async onGridReady(e: GridReadyEvent<T>) {
    this.state.api = e.api;

    // 1️⃣ Facade register
    this.selectionFacade.register(this.gridKey, this.state);

    // 2️⃣ Engine bind
    if (this.engine) {
      this.engine.bind(this.state);
    }

    // 3️⃣ Commands
    this.commands = new GridCommands(
      this.gridKey,
      this.state,
      this.loadFn,
      this.tabService,
      this.createDefaultRow,
      (row) => {
        const api = this.state.api;
        this.engine?.validateRow(this.state, row);
        this.state.api?.refreshCells({ force: true });
      }
    );

    // 🔥 4️⃣ CACHE’TEN DENE
    const loadedFromCache = this.commands.loadFromCache();

    // 🔥 5️⃣ CACHE YOK → API
    if (!loadedFromCache) {
      await this.commands.refreshFromApi();
      if (this.createDefaultRow) {
        this.commands.addDefaultRowIfEmpty(); // 🔥

      }
    }
    // 🔥 3️⃣ DATA VAR → VALIDATE
    this.engine.validateAll(this.state);
    const api = this.state.api;
    if (!api || api.isDestroyed()) return;

    api.refreshCells({ force: true });
    this.state.api.refreshCells({ force: true });


    // this.tabService.registerGridRefresh(this.gridKey, async () => {
    //   await this.commands.refreshFromApi();
    //   this.engine.validateAll(this.state);
    //   this.state.api.refreshCells({ force: true });
    // });


    setTimeout(async () => await this.commands.selectFirstRow());
  }

  onGridDestroy() {
    // 🔥 API referansını KES
    this.state.api = null as any;

    // 🔥 Refresh callback’ini temizle
   // this.tabService.unregisterGridRefresh(this.gridKey);
  }



  // 🔥 DIŞARIDAN SORULABİLİR
  canSave(): boolean {
    return this.engine.canSave(this.state);
  }


  @Output() select = new EventEmitter<T>();
  @Output() doubleSelect = new EventEmitter<T>();
  @Input() config?: GridConfig;
  onRowClick(e: RowClickedEvent<T>) {
    if (this.config?.enableSelect === false) return;
    this.select.emit(e.data);
  }

  onRowDoubleClick(e: RowDoubleClickedEvent<T>) {
    if (this.config?.enableDoubleSelect === false) return;
    this.doubleSelect.emit(e.data);
  }









}
