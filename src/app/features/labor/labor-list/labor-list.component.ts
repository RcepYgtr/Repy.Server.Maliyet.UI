import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef, RowClassRules, GridOptions } from 'ag-grid-community';
import { ProjeType } from '../../../../libs/domain/siparis-genel/siparis-genel-models';
import { ToolbarHostService } from '../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { LaborToolbarStateService } from '../_state/labor-toolbar.state.service';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { LaborTypeService } from '../../../../libs/core/api/labor-type.service';
import { LaborToolbarFactory } from '../_factory/labor-toolbar.factory';
import { LABOR_COLUMNS } from '../_factory/labor.column';
import { GridCacheState } from '../../../../libs/shared/ui/tabs/tab-model';
export type LaborTabKey =
  | 'KABIN'
  | 'BUTON'
  | 'SUSPANSIYON'
  | 'LKARKAS'
  | 'AGIRLIK'
  | 'MAKINE';
const TAB_TO_PROJE_TYPE: Record<LaborTabKey, number> = {
  KABIN: ProjeType.KABIN,
  BUTON: ProjeType.BUTON,
  SUSPANSIYON: ProjeType.SUSPANSIYON,
  LKARKAS: ProjeType.LKARKAS,
  AGIRLIK: ProjeType.AGIRLIK,
  MAKINE: ProjeType.MAKINE
};
@Component({
  selector: 'app-labor-list',
  standalone: false,
  templateUrl: './labor-list.component.html',
  styleUrl: './labor-list.component.scss',
})
export class LaborListComponent implements OnInit {
  isLoading: any;

  rowData: any[] = [];
  private gridApi!: GridApi<any>;
  selectedItem: any | null = null;

  @Input() activeTab!: LaborTabKey;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.onTabChanged(this.activeTab);
    }
  }

  constructor(
    public host: ToolbarHostService,
    public _LaborToolbarStateService: LaborToolbarStateService,
    private tabService: TabService,
    private laborTypeService: LaborTypeService,
  ) { }



  ngOnInit(): void {

    const active = this.tabService.activeTab();

    if (active.context?.pageActiveTab) {
      this.activeTab = active.context.pageActiveTab;
    }
    const ctx = this._LaborToolbarStateService.ctx;
    ctx.onTabActivated = (tabId: string) => {
      this.onTabChanged(tabId as any);
    };
    ctx.headerActions = {
      // refresh: () => this.loadPage(ctx.pagination!.page),
      refresh: async () => {
        this.tabService.updateGridState(this.gridKey, null as any);
        this.loadPage(1, true);
      },
      firstPage: () => this.loadPage(1),
      prevPage: () => this.loadPage(ctx.pagination!.page - 1),
      nextPage: () => this.loadPage(ctx.pagination!.page + 1),
      lastPage: () => this.loadPage(ctx.pagination!.totalPages),
      goToPage: (p: number) => this.loadPage(p),
      new: () => this.add(),
      edit: () => this.update(),
      delete: () => this.deleteSelected(),

    };
    this.host.setHeaderToolbar(LaborToolbarFactory.grid(this._LaborToolbarStateService.ctx));
  }



  async loadPage(page: number, forceReload = false) {

    const ctx = this._LaborToolbarStateService.ctx;
    const p = ctx.pagination!;
    const tab = this.activeTab;

    p.page = page;

    const cache = this.getGridCache();

    // 🔥 CACHE SADECE 1. SAYFA
    if (!forceReload && page === 1 && cache?.rows) {

      this.rowData = cache.rows;
      p.totalPages = cache.totalPages!;
      p.totalCount = cache.totalCount!;
      return;
    }

    this.isLoading = true;

    try {
      const res = await this.laborTypeService.getAll();

      this.rowData = res;



      setTimeout(() => {
        this.selectFirstRow();
      }, 0);

    } finally {
      this.isLoading = false;
    }
  }

  add() {
    const href = `/features/labor/labor-create`;
    this.tabService.openTab({
      id: href,
      title: `İşçilik Oluştur`,
      href,
      closable: true,
      dirty: false
    });
  }
  update() {
    this.selectedItem
    const currentTabId = this.tabService.activeTabId(); // 🔥 aktif tab
    const row = this.selectedItem;
    if (!row) return;

    const href = `/features/labor/labor-detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `İşçilik Tipi #${row.seriNo ?? row.id}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        pageActiveTab: this.activeTab,   // 🔥 SATIR DATASI BURADA
        parentTabId: currentTabId
      }
    });
  }
  async deleteSelected() {
    if (!this.selectedItem) return;

    const confirmed = confirm('Bu kaydı silmek istiyor musunuz?');
    if (!confirmed) return;

    try {
      await this.laborTypeService.delete(this.selectedItem.id);

      // cache temizle
      this.tabService.updateGridState(this.gridKey, null as any);

      await this.loadPage(1, true);
    }
    catch (err) {
      console.error(err);
    }
  }








  gridOptions: GridOptions = {
    suppressNoRowsOverlay: true,
    suppressLoadingOverlay: true
  };
  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true
  };



  async getList(params: GridReadyEvent<any>) {
    this.gridApi = params.api;

    this.gridApi.setGridOption(
      'columnDefs',
      LABOR_COLUMNS
    );



    // 🔥 CACHE VAR MI?
    const cache = this.getGridCache();

    if (cache?.rows) {
      this.rowData = cache.rows;
      const ctx = this._LaborToolbarStateService.ctx;
      ctx.pagination!.page = 1;
      ctx.pagination!.totalCount = cache.totalCount ?? 0;
      ctx.pagination!.totalPages = cache.totalPages ?? 1;
      setTimeout(() => {
        this.selectFirstRow();
      }, 0);
      return;
    }

    this.loadPage(1);

  }


  onRowDoubleClick(event: any) {
    const row = event.data;
    if (!row) return;


    const href = `/features/labor/labor-detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `İşçilik Tipi  #${row.seriNo ?? row.id}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        pageActiveTab: this.activeTab   // 🔥 SATIR DATASI BURADA
      }
    });
  }
  onRowClicked(event: any) {
    this.selectedItem = event.data;
  }






  private selectFirstRow() {
    if (!this.gridApi) return;

    const firstNode = this.gridApi.getDisplayedRowAtIndex(0);
    if (!firstNode) return;

    firstNode.setSelected(true);
    this.selectedItem = firstNode.data;
  }
  onTabChanged(tab: LaborTabKey) {

    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.tabService.updateActiveTabContext({
      pageActiveTab: tab
    });





    this.loadPage(1);
  }


  private readonly TAB_STATE_KEY = 'Labor-active-tab';
  private get gridKey(): string {
    return `Labor-grid-${this.activeTab}`;
  }
  private getGridCache() {
    return this.tabService.getGridState(this.gridKey);
  }

  private setGridCache(state: Partial<GridCacheState>) {
    this.tabService.updateGridState(this.gridKey, state);
  }
}
